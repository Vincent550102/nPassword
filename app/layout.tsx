import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DomainProvider } from "@/context/DomainContext";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nPassword",
  description: "A Password Manager for Windows Active Directory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>nPassword</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DomainProvider>
          <div className="container mx-auto md:p-4">{children}</div>
        </DomainProvider>
      </body>
    </html>
  );
}
