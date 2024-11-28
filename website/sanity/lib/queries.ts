import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `
    *[_type=="post" && defined(slug.current) && publishedAt < now()] | order(publishedAt desc) {
      _id, 
      slug,
      title,
      categories[] -> {title, slug, description},
      body, 
      publishedAt,
      author -> {_id, name, slug, image, bio},
      mainImage {
        asset -> {
          _id,
          url
        },
          alt
      }
    } 
  `
);
