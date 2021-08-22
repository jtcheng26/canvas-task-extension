import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function NewQueryClient(): React.FC {
  const queryClient = new QueryClient();
  function QueryClientWrapper({
    children,
  }: {
    children?: React.ReactNode;
  }): JSX.Element {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return QueryClientWrapper;
}
