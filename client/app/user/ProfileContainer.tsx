import React, { PropsWithChildren, ReactNode } from "react";
import { TUser } from "@/types/api/user";
import Image from "next/image";
import Link from "next/link";

type TProfileContainerUser =
  | (Omit<TUser, "friends"> & { friendRequested?: boolean })
  | null;

export default function ProfileContainer({
  user,
  linkProfilePic = false,
  smallPic = false,
  renderChildren,
}: {
  user: TProfileContainerUser;
  linkProfilePic?: boolean;
  smallPic?: boolean;
  renderChildren?: (user: TProfileContainerUser) => ReactNode;
}) {
  const ProfilePicContainer = ({
    withLink,
    user,
    children,
  }: PropsWithChildren<{ withLink: boolean; user: TProfileContainerUser }>) => {
    if (!withLink || !user) return <>{children}</>;

    return <Link href={`/user/otherUsers/${user.id}/profile`}>{children}</Link>;
  };

  return (
    <div className="pt-3 w-full bg-white p-2 pb-5 px-4 rounded-md flex flex-col gap-1 items-start h-full">
      {user && (
        <>
          <div className="rounded-full h-20 w-20 overflow-hidden relative">
            <ProfilePicContainer withLink={linkProfilePic} user={user}>
              <Image
                className="rounded-full shadow-sm shadow-slate-400 h-full w-full"
                fill
                style={{ objectFit: "cover" }}
                placeholder="blur"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.profile_pic}`}
                alt={user.name}
              />
            </ProfilePicContainer>
          </div>
          <p>{user.name}</p>
          <p>Working at {user.company}</p>
          <p>Email: {user.email}</p>
          <p>Number: {user.phone}</p>
        </>
      )}
      <div className="mt-auto w-full">
        {renderChildren && renderChildren(user)}
      </div>
    </div>
  );
}
