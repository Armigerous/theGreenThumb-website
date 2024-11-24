import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `
       *[_type=="post" && defined(slug.current) && publishedAt < now()] | order(publishedAt desc) {
      _id, 
      categories,
      body, 
      slug,
      title,
      publishedAt,
      author -> {name, slug, image, bio}
  } `
);
