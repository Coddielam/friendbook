import { ReactNode } from "react";
import { TUser } from "@/types/api/user";
import Image from "next/image";

export default function ProfileContainer({
  user,
  smallPic = false,
  renderChildren,
}: {
  user: (Omit<TUser, "friends"> & { friendRequested?: boolean }) | null;
  smallPic?: boolean;
  renderChildren?: (
    user: (Omit<TUser, "friends"> & { friendRequested?: boolean }) | null
  ) => ReactNode;
}) {
  return (
    <div className="pt-3 w-full bg-white p-2 pb-5 px-4 rounded-md flex flex-col gap-1 items-start h-full">
      {user && (
        <>
          <div className="rounded-full h-20 w-20 overflow-hidden relative">
            <Image
              className="rounded-full shadow-sm shadow-slate-400 h-full w-full"
              fill
              style={{ objectFit: "cover" }}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.profile_pic}`}
              alt={user.name}
            />
          </div>
          <p>{user.name}</p>
          <p>Working at {user.company}</p>
          <p>Email: {user.email}</p>
          <p>Number: {user.phone}</p>
        </>
      )}
      <div className="mt-auto max-w-full">
        {renderChildren && renderChildren(user)}
      </div>
    </div>
  );
}
