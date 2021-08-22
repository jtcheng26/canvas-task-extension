import NewQueryClient from './queryClientWrapper';
import { renderHook } from '@testing-library/react-hooks';
import { UseQueryResult } from 'react-query';

export default async function testHookData(
  hook: () => UseQueryResult
): Promise<UseQueryResult> {
  const { result, waitFor } = renderHook(hook, {
    wrapper: NewQueryClient(),
  });

  await waitFor(() => result.current.isSuccess);

  return result.current;
}
