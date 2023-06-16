import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";


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
      if (errorMessage && errorMessage[0]) {
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
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (input !== "") mutate({ content: input })
          }
        }}
      />
      {input !== "" && !isPosting && <button onClick={() => mutate({ content: input })}>Post</button>}
      {isPosting && <LoadingSpinner size={20} />}
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
    <PageLayout>
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
    </PageLayout>
  );
};

export default Home;
