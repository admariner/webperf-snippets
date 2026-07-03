import { useEffect, useRef, useState } from "react";

/**
 * Embeds a self-contained interactive demo (a static HTML file under
 * `public/demos/`) inside an iframe. The demo reports its own content height
 * via `postMessage({ [heightKey]: number })`, so the iframe grows to fit
 * without an inner scrollbar. Theme (light/dark) syncs automatically: the demo
 * reads `localStorage.theme`, which Nextra also writes, and both share the same
 * origin.
 */
export function Demo({
  src,
  title,
  caption,
  heightKey = "rafDemoHeight",
  minHeight = 400,
}) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const value = event.data?.[heightKey];
      if (typeof value === "number") {
        setHeight(value + 24);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [heightKey]);

  return (
    <figure className="nx-mt-6 first:nx-mt-0">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        loading="lazy"
        style={{
          width: "100%",
          height: `${height}px`,
          border: "none",
          borderRadius: "0.75rem",
          display: "block",
        }}
      />
      {caption ? (
        <figcaption className="nx-mt-2 nx-text-sm nx-text-gray-500 dark:nx-text-gray-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
