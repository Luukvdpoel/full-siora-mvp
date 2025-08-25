import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AnalyticsProvider } from "./providers";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = {
  title: "Siora",
  description: "Creator x Brand matching by tone & values",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="en" className="bg-gray-950 text-white">
      <body className="min-h-screen antialiased">
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );

  return clerkKey && clerkKey.startsWith("pk_") ? (
    <ClerkProvider publishableKey={clerkKey}>{content}</ClerkProvider>
  ) : (
    content
  );
}

