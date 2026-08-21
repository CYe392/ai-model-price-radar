"use client";

import { useEffect, useState, type FormEvent } from "react";

type Preference = {
  email: string;
  region: string;
  locale: string;
  status: string;
};

export function SubscriptionManager() {
  const [token, setToken] = useState("");
  const [preference, setPreference] = useState<Preference | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "saving" | "done" | "error">("loading");
  const [message, setMessage] = useState("Opening your private subscription link…");

  useEffect(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    window.history.replaceState(null, "", "/subscription");
    if (value.length < 32 || value.length > 200) {
      queueMicrotask(() => {
        setState("error");
        setMessage("Open the Manage preferences link from a ModelScope email.");
      });
      return;
    }
    fetch("/api/newsletter/preferences", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "read", token: value }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Subscription not found");
        return (await response.json()) as Preference;
      })
      .then((data) => {
        setToken(value);
        setPreference(data);
        setState("ready");
        setMessage("");
      })
      .catch(() => {
        setState("error");
        setMessage("This subscription link is invalid or no longer exists.");
      });
  }, []);

  async function act(action: "update" | "unsubscribe" | "delete", details: Record<string, string> = {}) {
    setState("saving");
    setMessage("");
    const response = await fetch("/api/newsletter/preferences", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, token, ...details }),
    }).catch(() => null);
    if (!response?.ok) {
      setState("error");
      setMessage("We could not apply this request. Open the email link again and retry.");
      return;
    }
    if (action === "update") {
      setPreference((current) => current ? { ...current, ...details } : current);
      setState("ready");
      setMessage("Preferences saved.");
    } else {
      setState("done");
      setMessage(action === "delete" ? "Your subscription data has been permanently deleted." : "You have been unsubscribed.");
      setToken("");
      setPreference(null);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void act("update", {
      region: String(form.get("region") ?? ""),
      locale: String(form.get("locale") ?? ""),
    });
  }

  if (!preference)
    return <section className="subscriptionManager"><output className={state === "error" ? "error" : ""} aria-live="polite">{message}</output></section>;

  return (
    <section className="subscriptionManager" aria-labelledby="subscription-manager-title">
      <div><b>PRIVATE LINK</b><h2 id="subscription-manager-title">{preference.email}</h2><p>Status: <strong>{preference.status}</strong>. The complete address is never returned to this page.</p></div>
      <form onSubmit={save}>
        <label>Market<select name="region" defaultValue={preference.region}><option value="global">Global</option><option value="north-america">North America</option><option value="europe">Europe</option><option value="asia-pacific">Asia Pacific</option></select></label>
        <label>Language<select name="locale" defaultValue={preference.locale}><option value="en">English</option><option value="zh">中文</option></select></label>
        <button type="submit" disabled={state === "saving"}>Save preferences</button>
      </form>
      <div className="subscriptionDanger"><button type="button" onClick={() => void act("unsubscribe")} disabled={state === "saving"}>Unsubscribe</button><button type="button" onClick={() => window.confirm("Permanently delete this subscription and its delivery history?") && void act("delete")} disabled={state === "saving"}>Delete my subscription data</button></div>
      {message ? <output aria-live="polite">{message}</output> : null}
    </section>
  );
}
