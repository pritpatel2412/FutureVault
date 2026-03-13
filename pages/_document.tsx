import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>💡 FutureVault | Ideas Running 24/7</title>
        <meta name="description" content="A 24/7 live feed of future startup ideas contributed by anyone." />
      </Head>
      <body className="antialiased font-syne text-[var(--text-primary)] bg-[var(--bg)]">
        <svg style={{ position: 'absolute', width: 0, height: 0 }} xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
        </svg>
        <div className="noise-overlay" style={{ filter: 'url(#noiseFilter)' }}></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
