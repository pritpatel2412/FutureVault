import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Syne, DM_Mono } from "next/font/google";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${syne.variable} ${dmMono.variable} font-syne`}>
      <Component {...pageProps} />
    </main>
  );
}
