"use client";

import {
  FormEventHandler,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { TUser } from "@/types/api/user";
import serverAxiosInstance from "@/utils/axios/serverInstance";
import useSWR from "swr";
import useUser from "@/utils/auth/useUser";
import ProfileContainer from "../../ProfileContainer";
import validateUpdateUserForm from "@/utils/validations/validateUpdateUser";
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

function UpdateUserForm({
  onCancelClick,
  userData,
  onSuccessCb,
}: {
  onCancelClick: () => void;
  userData: TUser;
  onSuccessCb: () => void;
}) {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const updateUser: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newFormData = new FormData();

    // filter out empty fields
    for (const [key, value] of formData.entries()) {
      if (
        value &&
        [...Object.keys(userData), "password", "repeat_password"].includes(key)
      ) {
        if (key === "profile_pic") {
          // only append user profile if there's an image uploaded
          if ((formData.get(key) as File).size > 0) {
            newFormData.append(key, value);
          }
        } else {
          /* @ts-ignore */
          newFormData.append(key, value);
        }
      }
    }
    const validateErrorMsg = validateUpdateUserForm(formData);
    if (validateErrorMsg.length) {
      setErrorMsg(validateErrorMsg);
      return;
    }

    try {
      const { data } = await serverAxiosInstance.put(
        `/user/${userData.id}/updateProfile`,
        newFormData
      );
      setSuccessMsg(data.message);
      const onSuccessCbTimeout = setTimeout(() => {
        onSuccessCb();
        clearTimeout(onSuccessCbTimeout);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  return (
    <form
      onSubmit={updateUser}
      className="h-fit rounded-md flex flex-col gap-8 divide-y divide-gray-300 items-start w-full"
    >
      <div className="flex flex-col w-full gap-5 [&>*]:max-w-full">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          defaultValue={userData.name}
        />
        <label htmlFor="profile_pic">
          New profile picture:
          <br />
          <input
            className="inline-block w-full"
            type="file"
            name="profile_pic"
            id="profile_pic"
            placeholder="A profile picture"
          />
        </label>
        <input
          type="text"
          name="company"
          placeholder="Your Company"
          defaultValue={userData.company}
        />
        <input
          type="text"
          name="phone"
          placeholder="Your Phone"
          defaultValue={userData.phone}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email address"
          defaultValue={userData.email}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="New Password"
        />
        <input
          type="password"
          name="repeat_password"
          id="repeat_password"
          placeholder="Enter your new password again"
        />
        <button className="bg-green p-btn rounded-btn text-white" type="submit">
          Update Profile
        </button>
        {errorMsg && <p className="text-red-400">{errorMsg}</p>}
        {successMsg && <p className="text-green">{successMsg}</p>}
        <button
          onClick={onCancelClick}
          className="bg-slate-400 px-4 py-2 rounded-md text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function UserProfile() {
  const { userId, mutate: mutateGlobalUser } = useUser();
  const [showUpdateUserForm, setShowUpadteUserForm] = useState(false);
  const { user, mutateUser, error, userLoading } = useGetUser(userId, true);

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
              return !showUpdateUserForm ? (
                <>
                  <button
                    className="bg-green px-4 py-2 rounded-md text-white"
                    onClick={() => setShowUpadteUserForm(true)}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <UpdateUserForm
                    userData={user}
                    onSuccessCb={() => {
                      setShowUpadteUserForm(false);
                      mutateUser();
                      mutateGlobalUser();
                    }}
                    onCancelClick={() => setShowUpadteUserForm(false)}
                  />
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
              You have {user.friends.length} friend
              {user.friends.length > 1 ? "s" : ""}
            </p>
          ) : (
            <p>You have no friends</p>
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
