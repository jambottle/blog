export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

export type Post = {
  metadata: PostMetadata;
  slug: string;
  html: string;
};
