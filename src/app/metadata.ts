import { getURL } from "@/lib/config";

const siteMetadata = {
  title: "Twitter Personality · AI Agent",
  author: "Wordware",
  headerTitle: "Twitter Personality",
  description:
    "Twitter Personality is an AI Agent that analyzes your tweets to reveal the unique traits that make you, you. Discover insights about your online persona.",
  language: "en-us",
  theme: "light",
  siteUrl: new URL(getURL()),
  socialBanner: "/social/og.png",
  locale: "en-US",
};

export default siteMetadata;
