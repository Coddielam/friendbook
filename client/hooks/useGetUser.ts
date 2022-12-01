import { TUser } from "@/types/api/user";
import serverAxiosInstance from "@/utils/axios/serverInstance";
import { useEffect } from "react";
import useSWR from "swr";

const useGetUser = (userId: string, revalidateOnMount: boolean = false) => {
  const {
    data: user,
    mutate: mutateUser,
    error,
    isValidating: userLoading,
  } = useSWR<TUser & { requestedAddFriend: boolean }>(
    userId ? ["user", userId] : null,
    async () => {
      if (!userId) return null;
      try {
        const { data } = await serverAxiosInstance.get(`/user/${userId}`);
        return data.user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (revalidateOnMount) {
      mutateUser();
    }
  }, [revalidateOnMount]);

  return { user, mutateUser, error, userLoading };
};

export default useGetUser;
