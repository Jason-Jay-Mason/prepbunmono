"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider: React.FC<any> = (p) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
  );
};
