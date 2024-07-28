import type { Metadata } from "next";
import "./globals.css";
import {getUser} from "@/lib/auth/auth.service";
import {Providers} from "@/app/providers";
import Header from "@/components/header/header.component";

export const metadata: Metadata = {
  title: "SM Champions",
  description: "Beat your colleagues in fair competition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>
            <Header user={getUser()} />
            <div className="m-6" >
                {children}
            </div>
        </Providers>
      </body>
    </html>
  );
}

