"use client";

import serverAxiosInstance from "@/utils/axios/serverInstance";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import Link from "next/link";
import useUser from "@/utils/auth/useUser";
import validateRegisterForm from "@/utils/validations/validateRegisterForm";

export default function HomePage() {
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const { mutate: mutateUser } = useUser(
    "social_feed_page",
    true,
    shouldFetchUser
  );
  const [errorMsg, setErrorMsg] = useState("");

  /* showing how many times the form re-rendered */
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });
  /* showing how many times the form re-rendered */

  const register: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMsg("");

    const formErrorMsg = validateRegisterForm(formData);
    if (formErrorMsg.length) {
      setErrorMsg(formErrorMsg);
      return;
    }

    try {
      const { data } = await serverAxiosInstance.post(
        "/user/register",
        formData
      );
      setShouldFetchUser(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 w-fit justify-center items-center h-full md:max-w-5xl mx-auto px-4">
      <div className="h-fit p-5 self-end md:self-auto mr-auto">
        <h1 className="text-blue">friendbook</h1>
        <p>Faceboot helps you create genuine friendships.</p>
      </div>

      <form
        onSubmit={register}
        className="bg-white h-fit p-5 rounded-md flex flex-col gap-8 divide-y divide-gray-300 max-w-sm self-start md:self-auto"
      >
        <div className="flex flex-col w-full gap-5 relative">
          {/* showing how many times the form re-render */}
          <div className="bg-red-400 text-white absolute -top-3 right-0 rounded-full translate-x-full -translate-y-full h-5 w-5 text-center flex items-center justify-center text-xs opacity-80">
            {renderCount.current}
          </div>
          {/* showing how many times the form re-render */}

          <input type="text" name="name" placeholder="Your name" />
          <label htmlFor="profile_pic">
            Upload a profile picture:
            <br />
            <input
              className="inline-block max-w-full"
              type="file"
              accept="image/*"
              name="profile_pic"
              id="profile_pic"
              placeholder="A profile picture"
            />
          </label>
          <input type="text" name="company" placeholder="Your Company" />
          <input type="text" name="phone" placeholder="Your Phone" />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <input
            type="password"
            name="repeat_password"
            id="repeat_password"
            placeholder="Enter your password again"
          />
          <button
            className="bg-green p-btn rounded-btn text-white"
            type="submit"
          >
            Register Account
          </button>
          {errorMsg && <p className="text-red-400">{errorMsg}</p>}
        </div>
        <div className="pt-8 w-full">
          <Link href="/" className="text-slate-600">
            Login instead
          </Link>
        </div>
      </form>
    </div>
  );
}
