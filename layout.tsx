import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "VOXON AI — Your AI Workspace", description: "Chat, create, and explore with VOXON AI." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
