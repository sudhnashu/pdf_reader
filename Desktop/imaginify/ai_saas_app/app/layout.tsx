import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
// we are using IBM_PLEX font instead of normal font
// initialisiing the constructor
const IBMPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex'
});

export const metadata: Metadata = {
  title: "Imaginify",
  description: "AI-powered image generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ClerkProvider is a component that provides authentication and user context to your app.
    // clerkProvider is a component that provides active session and user context to clerk's hooks and other components
    <ClerkProvider appearance={{
      variables: { colorPrimary: '#624cf5' }
    }}>
      <html lang="en">
        {/* cn is a constructor function which allows us to combine two classes together using the rules of tailwind css  */}
        {/* combining the IBM-plex font with  the other classnames  */}
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
