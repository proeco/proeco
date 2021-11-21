import useSWR, { SWRResponse } from 'swr';

import { restClient } from '~/utils/rest-client';
import { User } from '~/domains/user';

/**
 * 現在ログイン中のユーザーを取得するSWR
 * @returns data ログイン中のユーザー
 * @returns isValidating 取得中を表す boolean
 * @returns error エラー
 * @returns mutate データの更新関数
 */
export const useCurrentUser = (): SWRResponse<User, Error> => {
  return useSWR('/users/me', (endpoint: string) => restClient.apiGet(endpoint).then((result) => result.data), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
};