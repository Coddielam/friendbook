import { useRouter } from "next/navigation";
import useSWR from "swr";
import serverAxiosInstance from "../axios/serverInstance";

const fetcher = async () => {
  try {
    const { data } = await serverAxiosInstance.get("/user/session");
    return data;
  } catch (e) {
    const error = new Error("Unauthenticated");
    (error as any).status = 403;
    throw error;
  }
};

export default function useUser(
  redirectTo: "social_feed_page" | "profile_page" | undefined = undefined,
  stayIfError: boolean = false,
  shouldFetch: boolean = true
) {
  const router = useRouter();
  const { data, error, mutate, isValidating } = useSWR(
    shouldFetch ? "/user/session" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return;

        if (retryCount >= 3) return;

        setTimeout(() => {
          revalidate({ retryCount });
        }, 5000);
      },
    }
  );

  if (error && error.status >= 400 && !stayIfError) {
    // redirect to login page
    router.push("/");
    mutate(null);
  } else {
    if (redirectTo && data && !isValidating) {
      switch (redirectTo) {
        case "profile_page":
          router.push(`/user/${data.userId}/profile`);
          break;
        case "social_feed_page":
        default:
          router.push(`/user/${data.userId}`);
          break;
      }
    }
  }

  return {
    userId: data?.userId,
    profile_pic: data?.profile_pic,
    friendRequests: data?.friendRequests,
    isValidating,
    error,
    mutate,
  };
}
