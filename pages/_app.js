import '../styles/globals.css'
import { storyblokInit, apiPlugin } from "@storyblok/react";

storyblokInit({
  accessToken: process.env.SB_PREVIEW_TOKEN,
  use: [apiPlugin],
  components: {},
});


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
