"use client";

import { PropsWithChildren, useEffect, useMemo } from "react";
import { TUser } from "@/types/api/user";
import serverAxiosInstance from "@/utils/axios/serverInstance";
import useSWR, { useSWRConfig } from "swr";
import useUser from "@/utils/auth/useUser";
import ProfileContainer from "../../../ProfileContainer";
import useSendFriendRequest from "@/hooks/useSendFriendRequest";
import { usePathname, useRouter } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";

function ProfileSkeleton() {
  return (
    <ProfileContainer
      user={null}
      renderChildren={() => (
        <div className="animate-pulse flex flex-col gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-300"></div>
          <p className="w-16 h-2 bg-slate-300 rounded-md"></p>
          <p className="w-full h-2 bg-slate-300 rounded-md"></p>
          <p className="w-full h-2 bg-slate-300 rounded-md"></p>
          <p className="w-full h-2 bg-slate-300 rounded-md"></p>
        </div>
      )}
    />
  );
}

function FriendsContainer({ children }: PropsWithChildren) {
  return (
    <div className="bg-white px-5 py-3 rounded-md flex flex-col gap-3 divide-y-2 divide-gray-300">
      {children}
    </div>
  );
}

function FriendsSkeleton() {
  const friends = Array(3)
    .fill("")
    .map((_, index) => (
      <div key={index}>
        <ProfileSkeleton key={index} />
      </div>
    ));

  return (
    <FriendsContainer>
      <div className="w-full animate-pulse">
        <p className="h-2 my-2 bg-slate-300 w-16"></p>
      </div>
      {friends}
    </FriendsContainer>
  );
}

function UserProfile() {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { userId, mutate: mutateGlobalUser } = useUser();
  // getting the user
  const path = usePathname();
  // /user/otherUsers/[id]/profile
  const profileUserId = path.split("/")[path.split("/").length - 2];
  const { user, mutateUser, error, userLoading } = useGetUser(
    profileUserId,
    true
  );
  const router = useRouter();

  // redirect if it's logged in user
  useEffect(() => {
    if (userId && profileUserId) {
      if (userId === profileUserId) {
        router.replace("/user/me/profile");
      }
    }
  }, [profileUserId, userId]);

  const {
    error: sendFreindRequestError,
    loading: sendFriendRequestLoaidng,
    sendFriendRequest,
  } = useSendFriendRequest({
    userId,
    onSuccess: () => {
      user && mutateUser({ ...user, requestedAddFriend: true });
    },
  });

  const isAlreadyFriend = useMemo(() => {
    if (user && profileUserId) {
      return user.friends.some((friend) => friend.id === userId);
    }
    return false;
  }, [user, profileUserId]);

  return (
    <div className="pt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* loading skeleton */}
      {userLoading && (
        <div className="h-fit md:sticky md:top-[132px]">
          <ProfileSkeleton />
        </div>
      )}
      {/* user profile */}
      {!userLoading && user && (
        <div className="h-fit md:sticky md:top-[132px]">
          <ProfileContainer
            user={user}
            renderChildren={() => {
              if (isAlreadyFriend) {
                return (
                  <p className="font-semibold text-green">
                    You are {user.name} are already friends 👬{" "}
                  </p>
                );
              }

              return (
                <>
                  <button
                    className="bg-blue px-4 py-2 rounded-md text-white disabled:bg-slate-500"
                    disabled={user.requestedAddFriend}
                    onClick={() => {
                      sendFriendRequest(profileUserId);
                    }}
                  >
                    {user.requestedAddFriend
                      ? "Request sent"
                      : "Send Friend Request"}
                  </button>
                </>
              );
            }}
          />
        </div>
      )}

      {/* friends skeleton */}
      {userLoading && <FriendsSkeleton />}
      {/* user friends */}
      {!userLoading && user?.friends && (
        <div className="bg-white px-5 py-3 rounded-md divide-y-2 divide-gray-300 flex flex-col gap-3">
          {user.friends.length ? (
            <p>
              {user.name} has {user.friends.length} friend
              {user.friends.length > 1 ? "s" : ""}
            </p>
          ) : (
            <p>{user.name} has no friends</p>
          )}
          {user?.friends &&
            user.friends.map((friend) => {
              return (
                <div className="pt-3" key={friend.id}>
                  <ProfileContainer
                    user={friend}
                    linkProfilePic={true}
                    smallPic
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
