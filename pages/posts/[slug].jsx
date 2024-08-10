import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/blog/container";
import PostBody from "../../components/blog/post-body";
import Header from "../../components/blog/header";
import PostHeader from "../../components/blog/post-header";
import Layout from "../../components/blog/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import PostTitle from "../../components/blog/post-title";
import Head from "next/head";

export default function Post({ post, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-8">
              <Head>
                <title>{post.title} | Cristian Ariza</title>
              </Head>
              <PostHeader
                title={post.title}
                mainImage={post.mainImage}
                publishedAt={post.publishedAt}
              />
              <PostBody body={post.body} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps = async (context) => {
  const { slug } = context.params;
  const post = await getPostBySlug(slug, ["slug", "content"]);

  return {
    props: {
      post,
    },
  };
};

export async function getStaticPaths() {
  const allPosts = await getAllPosts(["slug", "content"]);
  return {
    paths: allPosts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: true,
  };
}