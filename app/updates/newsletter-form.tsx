"use client";

import { useState, type FormEvent } from "react";

const notices: Record<string, string> = {
  confirmed: "Your email is confirmed. Future updates will arrive by email.",
  removed: "You have been unsubscribed.",
  invalid: "This subscription link is invalid or has already been used.",
};

export function NewsletterForm({ subscriptionStatus }: { subscriptionStatus?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState(
    subscriptionStatus ? notices[subscriptionStatus] ?? "" : "",
  );

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("sending");
    setMessage("");
    const form = new FormData(formElement);
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        region: form.get("region"),
        locale: "en",
        consent: form.get("consent") === "on",
      }),
    }).catch(() => null);

    if (!response?.ok) {
      setState("error");
      setMessage("We could not save this subscription. Check the form and try again.");
      return;
    }

    setState("done");
    setMessage("Check your inbox to confirm your subscription.");
    formElement.reset();
  }

  return (
    <section className="newsletterCard" aria-labelledby="newsletter-title">
      <div>
        <b>PRICE &amp; PRODUCT BRIEF</b>
        <h2 id="newsletter-title">Useful changes, not inbox noise.</h2>
        <p>Receive material price, route, availability, and methodology updates. Choose the market context you care about.</p>
      </div>
      <form onSubmit={subscribe}>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
        <label>Market<select name="region" defaultValue="global"><option value="global">Global</option><option value="north-america">North America</option><option value="europe">Europe</option><option value="asia-pacific">Asia Pacific</option></select></label>
        <label className="newsletterConsent"><input name="consent" type="checkbox" required /><span>I agree to receive ModelScope updates. I can unsubscribe from every email.</span></label>
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Saving…" : "Subscribe"}</button>
        {message ? <output className={state === "error" ? "error" : ""} aria-live="polite">{message}</output> : null}
      </form>
    </section>
  );
}
