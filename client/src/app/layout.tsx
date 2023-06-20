import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";

import { ApolloWrapper } from "~/lib/apollo";
import { Navbar } from "~/common/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Downtime Watchdog",
  description: "Downtime Watchdog - A basic but simple uptime tracker",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          "flex flex-col overflow-x-hidden bg-background-secondary font-sans text-font",
          inter.variable,
        )}
      >
        <ApolloWrapper>
          <Navbar />
          <div className="flex min-h-screen bg-background-primary">
            <div className="mx-auto w-full max-w-7xl overflow-hidden px-6 py-4">{children}</div>
            <div id="portal-root" />
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
