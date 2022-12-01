import { useState } from "react";
import serverAxiosInstance from "@/utils/axios/serverInstance";

const useSendFriendRequest = ({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess: () => void;
}) => {
  const [sendFriendRequestState, setSendFriendRequestState] = useState({
    loading: false,
    error: "",
  });

  const sendFriendRequest = async (personId: string) => {
    setSendFriendRequestState({ loading: true, error: "" });
    try {
      const res = await serverAxiosInstance.post(
        `/user/${userId}/friendRequest`,
        {
          friendId: personId,
        }
      );
      onSuccess();
      setSendFriendRequestState({ loading: false, error: "" });
      return res;
    } catch (error: any) {
      setSendFriendRequestState({ loading: false, error: error.message });
    }
  };

  return { ...sendFriendRequestState, sendFriendRequest };
};

export default useSendFriendRequest;
