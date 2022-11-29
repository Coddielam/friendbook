"use client";

import useUser from "@/utils/auth/useUser";
import Link from "next/link";
import Image from "next/image";
import { PropsWithChildren, useState } from "react";
import { TUser } from "@/types/api/user";
import useAcceptFriendRequest from "@/hooks/useAcceptFriendRequest";
import { useSWRConfig } from "swr";
import serverAxiosInstance from "@/utils/axios/serverInstance";

const RequestsContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="absolute w-[calc(100%-10px)] md:w-fit top-[80px] right-[5px] md:absolute md:block md:top-[calc(100%+10px)] md:right-[calc(100%-30px)] divide-y-2 divide-slate-400 bg-white p-2 shadow-md flex-wrap">
      {children}
    </div>
  );
};

const UserProfile = () => {
  const { userId, profile_pic, friendRequests, mutate: mutateUser } = useUser();
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const { mutate: mutateGlobal } = useSWRConfig();
  const { acceptFriendRequest } = useAcceptFriendRequest({
    userId,
    onSuccess: () => {
      mutateGlobal(["user", userId, "nonFriendUsers"]);
      mutateUser();
    },
  });

  const logout = async () => {
    try {
      await serverAxiosInstance.put("/user/logout");
      mutateUser();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-3 md:gap-6 items-center">
      <Link
        className="text-white text-2xl md:text-3xl"
        href={`/user/${userId}`}
      >
        🔍
      </Link>
      <button
        className="text-2xl md:text-3xl md:relative"
        onClick={() => setShowRequestsDropdown((state) => !state)}
      >
        <span className="relative">
          🌍
          <span className="text-sm bg-red-400 text-white rounded-full px-1 absolute bottom-0 right-0">
            {friendRequests?.length}
          </span>
        </span>
        {/* friend requests dropdown */}
        {showRequestsDropdown && (
          <RequestsContainer>
            {!friendRequests.length && (
              <p className="whitespace-nowrap px-4">No friend request</p>
            )}
            {friendRequests.length > 0 &&
              friendRequests.map((requestUser: TUser) => {
                return (
                  <div className="grid gap-3 grid-cols-10 items-center w-[400px] py-3">
                    <div className="h-14 w-14 overflow-clip relative col-span-2 flex items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${requestUser.profile_pic}`}
                        alt={requestUser.name}
                        width={50}
                        height={50}
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                        className="col-span-2"
                      />
                    </div>
                    <p className="whitespace-nowrap col-span-6 text-base">
                      {requestUser.name} sent you a friend request!
                    </p>
                    <button
                      className="bg-green py-2 rounded-md text-sm h-fit col-span-2 text-white text-center"
                      onClick={() => acceptFriendRequest(requestUser.id)}
                    >
                      Accept
                    </button>
                  </div>
                );
              })}
          </RequestsContainer>
        )}
      </button>
      <Link href={`/user/${userId}/profile`}>
        <div className="rounded-full h-8 w-8 md:h-12 md:w-12 overflow-hidden relative flex items-center">
          <Image
            className="rounded-full h-full w-full"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${profile_pic}`}
            alt="Profile"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </Link>
      <button className="text-2xl md:text-3xl" onClick={logout}>
        🚪
      </button>
    </div>
  );
};

export default UserProfile;
