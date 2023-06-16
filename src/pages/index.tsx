import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);


const CreatePostWizard = () => {
  const { user } = useUser()
  const [input, setInput] = useState<string>('')
  const ctx = api.useContext()
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if(errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post")
      }
    }
  })
  if (!user) return null

  return (
    <div className="flex gap-3 m-2 p-1">
      <Image
        src={user.imageUrl}
        className="h-14 w-14 rounded-full"
        alt={`profile picture`}
        width={56}
        height={56}
      />
      <input
        placeholder="Input some emojis"
        className="grow bg-transparent outline-none"
        type={"text"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button onClick={() => mutate({ content: input })}>Post</button>
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (

    <div className="flex p-8 border-b border-slate-400 p-4 gap-3">
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300 font-semibold gap-1">
          <span>{`@ ${author.username}`}</span>

          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {

  const { data, isLoading } = api.posts.getAll.useQuery()

  if (isLoading) return <LoadingPage />
  if (!data) return <div>Could not load feed</div>
  return (
    <div className="flex flex-col">
      {
        data.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))
      }
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  // start fetching the posts asap
  api.posts.getAll.useQuery()

  if (!userLoaded) return <div />
  return (
    <>
      <main className="flex justify-center h-screen">
        <div className="md:max-w-2xl w-full border-x border-slate-100/10 h-full">
          <div className="border-b border-slate-100/10 p-4 flex">

            {!isSignedIn && <SignInButton />}
            {!!isSignedIn && <SignOutButton />}
          </div>
          <div>
            {
              !!isSignedIn && <CreatePostWizard />
            }
            <Feed />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
