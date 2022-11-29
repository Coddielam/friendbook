import { useState } from "react";
import serverAxiosInstance from "@/utils/axios/serverInstance";

const useAcceptFriendRequest = ({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess: () => void;
}) => {
  const [acceptFriendRequestState, setAcceptFriendRequestState] = useState({
    loading: false,
    error: "",
  });

  const acceptFriendRequest = async (requestUserId: string) => {
    setAcceptFriendRequestState({ loading: true, error: "" });
    try {
      await serverAxiosInstance.post(`/user/${userId}/accpetFriendRequest`, {
        friendId: requestUserId,
      });
      onSuccess();
      setAcceptFriendRequestState({ loading: false, error: "" });
    } catch (error: any) {
      setAcceptFriendRequestState({ loading: false, error: error.message });
    }
  };

  return { ...acceptFriendRequestState, acceptFriendRequest };
};

export default useAcceptFriendRequest;
