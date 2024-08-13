import { Metadata } from "next";

export function constructMetadata({
  title = "Kaamyak Pant",
  description = "Portfolio website of Kaamyak Pant",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: "Kaamyak Pant | Portfolio Website",
      description: "Portfolio Website of Kaamyak Pant",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kaamyak Pant | Portfolio Website",
      description,
      images: [image],
      creator: "@KaamyakPant",
    },
    icons,
    metadataBase: new URL("https://kaamyak.dev/"),
  };
}
