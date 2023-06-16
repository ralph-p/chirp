import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);




const ProfilePage: NextPage = () => {

  const {data, isLoading} = api.profile.getUserByUsername.useQuery({username: 'ralph-p'})
  if(isLoading) return <LoadingPage />
  if(!data) return <div>User Not Found</div>
  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div className="">
          {data.username}
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
