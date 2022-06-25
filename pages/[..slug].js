import Head from "next/head";
import styles from "../styles/Home.module.css";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page({ story }) {
  story = useStoryblokState(story);

  if (story === undefined || story.content === undefined) {
    return <p>No content yet.</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{story ? story.name : "My Site"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>{story ? story.name : "My Site"}</h1>
      </header>

      <StoryblokComponent blok={story.content} />
    </div>
  );
}

export async function getStaticProps(props) {
  const { params } = props;
  let slug = params;
  const requestSlug = slug?.slug || ["landing-page"];
  let sbParams = {
    version: "draft", // or 'published'
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(
    `cdn/stories/${requestSlug[0]}`,
    sbParams
  );

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const storyblokApi = getStoryblokApi();
  let sbParams = {
    version: "draft", // or 'published'
  };
  let {
    data: { links },
  } = await storyblokApi.get("cdn/links/", sbParams);

  let paths = [];
  Object.keys(links).forEach((linkKey) => {
    if (links[linkKey].is_folder) {
      return;
    }

    if (!links[linkKey].is_startpage) {
      return;
    }

    const { slug } = links[linkKey].slug;
    let splittedSlug = slug?.split("/");
    if (slug === "home") splittedSlug = false;
    paths.push({ params: { slug: splittedSlug } });
  });

  return {
    paths: paths,
    fallback: true,
  };
}
