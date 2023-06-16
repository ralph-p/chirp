import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
dayjs.extend(relativeTime);



const SinglePostPage: NextPage = () => {


  return (
    <>
    <Head>
      <title>Post</title>
    </Head>
      <main className="flex justify-center h-screen">
        <div className="">
          Post Page
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;
