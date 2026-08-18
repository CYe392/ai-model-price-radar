/* eslint-disable @next/next/no-html-link-for-pages -- client error boundary avoids the vinext next/link hook incompatibility */
"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="recoveryPage">
      <div><i>M</i><b>RECOVERABLE APPLICATION ERROR</b><h1>That view did not load.</h1><p>Your browser-local alerts, preferences, and workspace remain on this device. Retry the view, or return to the price explorer.</p><span><button onClick={reset}>Try again</button><a href="/">Return home</a></span></div>
    </main>
  );
}
