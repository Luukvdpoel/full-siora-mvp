import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import PostHogProvider from "@/components/PostHogProvider";

export const metadata = {
  title: "Siora",
  description: "Creator x Brand matching by tone & values",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-gray-950 text-white">
        <body className="min-h-screen antialiased">
          <PostHogProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

