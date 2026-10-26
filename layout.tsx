import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOXON AI — Create Beyond Limits",
  description: "A unified AI workspace for chat, image creation, and video editing.",
  applicationName: "VOXON AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
