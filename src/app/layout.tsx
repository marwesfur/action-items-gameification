import type {Metadata} from "next";
import "./globals.css";
import {Providers} from "@/app/providers";
import Frame from "@/components/frame/frame.component";
import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";

export const metadata: Metadata = {
    title: "SM Champions",
    description: "Beat your colleagues in fair competition",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const loggedInUser = await getLoggedInUserOrFail();

    return (
        <html suppressHydrationWarning lang="en">
            <body>
                <Providers>
                    <Frame user={loggedInUser}>
                        <div className="m-6">
                            {children}
                        </div>
                    </Frame>
                </Providers>
            </body>
        </html>
    );
}

