import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `
    *[_type=="post" && defined(slug.current) && publishedAt < now()] | order(publishedAt desc) {
      _id, 
      slug,
      title,
      description,
      categories[] -> {title, slug, description},
      publishedAt,
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

export const POST_BY_SLUG_QUERY = defineQuery(
  `
    *[_type=="post" && slug.current == $slug][0]{
      _id,
      slug,
      title,
      description,
      categories[] -> {title, slug, description},
      body[]{
        ...,
        _type == "image" => {
          "imageUrl": asset->url,
          alt,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height
        },
        _type == "block" => {
          ...
        }
      },
      publishedAt,
      mainImage {
        asset -> {
          _id,
          url
        },
          alt
      }
    } `
);

export const POST_VIEWS_QUERY = defineQuery(
  `
 *[_type=="post" && _id == $id][0]{
    _id, views
  }

`
);
