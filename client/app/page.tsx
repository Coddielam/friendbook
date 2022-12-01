"use client";

import serverAxiosInstance from "@/utils/axios/serverInstance";
import React, { FormEventHandler, useState } from "react";
import Link from "next/link";
import useUser from "@/utils/auth/useUser";
import { SWRConfig } from "swr";

function HomePage() {
  const { mutate: mutateUser } = useUser("social_feed_page", true);
  const [errorMsg, setErrorMsg] = useState("");

  const login: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);

    const requestBody = ["email", "password"].reduce(
      (requestBody, key) => {
        return { ...requestBody, [key]: formData.get(key) };
      },
      { email: "", password: "" }
    );

    try {
      const { data } = await serverAxiosInstance.post(
        "/user/login",
        requestBody
      );
      // redirect to user profile page
      mutateUser();
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
        onSubmit={login}
        className="bg-white h-fit p-5 rounded-md flex flex-col gap-8 divide-y divide-gray-300 max-w-sm self-start md:self-auto"
      >
        <div className="flex flex-col w-full gap-5">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email address or phone number"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <button
            className="bg-green p-btn rounded-btn text-white"
            type="submit"
          >
            Log in
          </button>
          {errorMsg && <p className="text-red-400">{errorMsg}</p>}
        </div>
        <div className="pt-8 w-full">
          <Link href="/register" className="text-slate-600">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function () {
  return (
    <SWRConfig
      value={{
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {

          if (retryCount >= 3) return;

          setTimeout(() => {
            revalidate({ retryCount });
          }, 5000);
        },
      }}
    >
      <HomePage />
    </SWRConfig>
  );
}
