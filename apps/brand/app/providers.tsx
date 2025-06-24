"use client";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { trpc } from "@/lib/trpcClient";
import { BrandUserProvider } from "@/lib/brandUser";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "/api/trpc" })],
    })
  );
  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <BrandUserProvider>{children}</BrandUserProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
