"use client";

import useAcceptFriendRequest from "@/hooks/useAcceptFriendRequest";
import useSendFriendRequest from "@/hooks/useSendFriendRequest";
import { TUser } from "@/types/api/user";
import useUser from "@/utils/auth/useUser";
import serverAxiosInstance from "@/utils/axios/serverInstance";
import { useState } from "react";
import useSWR from "swr";
import ProfileContainer from "../ProfileContainer";

const NonUserFriends = () => {
  const { userId, friendRequests, mutate: mutateUser } = useUser();

  const { data: nonFriends, mutate: mutateNonFriends } = useSWR(
    userId ? ["user", userId, "nonFriendUsers"] : null,
    async () => {
      if (!userId) return null;
      const { data } = await serverAxiosInstance.get<TUser[]>(
        `/user/${userId}/nonFriendUsers`
      );
      return data;
    }
  );

  const {
    loading: sendFriendRequestLoading,
    error: sendFriendRequestError,
    sendFriendRequest,
  } = useSendFriendRequest({
    userId,
    onSuccess: () => {
      mutateUser();
      mutateNonFriends();
      setAddFriendBtnId("");
    },
  });

  const {
    acceptFriendRequest,
    loading: acceptFriendRequestLoading,
    error,
  } = useAcceptFriendRequest({
    userId,
    onSuccess: () => {
      mutateUser();
      mutateNonFriends();
    },
  });

  const [addFriendBtnId, setAddFriendBtnId] = useState("");

  if (nonFriends && !nonFriends.length) {
    return <h2>There are no new friends to add ✨</h2>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
      {nonFriends &&
        nonFriends.length &&
        nonFriends.map((user) => {
          return (
            <ProfileContainer
              key={user.id}
              linkProfilePic={true}
              user={user}
              renderChildren={(user) => {
                if (!user) return null;

                if (
                  friendRequests.find(
                    (requestUser: TUser) => requestUser.id === user.id
                  )
                ) {
                  return (
                    <button
                      className=" bg-blue px-4 py-2 text-white rounded-md disabled:bg-slate-300"
                      onClick={() => acceptFriendRequest(user.id)}
                      disabled={acceptFriendRequestLoading}
                    >
                      Accept Request
                    </button>
                  );
                }

                return (
                  <button
                    className="bg-green px-4 py-2 text-white rounded-md disabled:bg-slate-300"
                    onClick={() => {
                      setAddFriendBtnId(user.id);
                      sendFriendRequest(user.id);
                    }}
                    disabled={
                      (sendFriendRequestLoading &&
                        addFriendBtnId === user.id) ||
                      user.friendRequested
                    }
                  >
                    {sendFriendRequestLoading && addFriendBtnId === user.id
                      ? "Loading"
                      : user.friendRequested
                      ? "Request sent"
                      : "Add friend"}
                  </button>
                );
              }}
            ></ProfileContainer>
          );
        })}
    </div>
  );
};

export default NonUserFriends;
