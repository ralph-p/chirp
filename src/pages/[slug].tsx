
import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { api,  } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PageLayout } from "~/components/layout";



const ProfilePage: NextPage<{username: string}> = () => {

  const {data} = api.profile.getUserByUsername.useQuery({username: 'ralph-p'})
  if(!data) return <div>User Not Found</div>
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>

          {data.username}
      </PageLayout>
        
    </>
  );
};


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
