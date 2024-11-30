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

export const ALL_POSTS_TITLES_QUERY = defineQuery(
  `
  *[_type == "post" && defined(slug.current) && publishedAt < now()] {
    title,
    "slug": slug.current
  }

  `
);

export const ALL_POSTS_SLUGS_QUERY = defineQuery(
  `
  *[_type == "post" && defined(slug.current) && publishedAt < now()] {
    "slug": slug.current
  }

  `
);

export const FILTERED_POSTS_QUERY = defineQuery(
  `
    *[_type=="post" && defined(slug.current) && publishedAt < now() && 
      (title match $search || description match $search)] | order(publishedAt desc) {
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

export const POSTS_BY_CATEGORY_QUERY = defineQuery(
  `
    *[_type=="post" && defined(slug.current) && publishedAt < now() && 
      $category in categories[]->slug.current] | order(publishedAt desc) {
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

export const PAGINATED_POSTS_QUERY = defineQuery(
  `
    {
      "posts": *[
        _type == "post" && 
        defined(slug.current) && 
        publishedAt < now() && 
        (!$input || $input == "" || 
          title match "*" + $input + "*" || 
          description match "*" + $input + "*" || 
          categories[]->title match "*" + $input + "*"
        )
      ] | order(publishedAt desc)[$start...$end] {
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
      },
      "totalCount": count(*[
        _type == "post" && 
        defined(slug.current) && 
        publishedAt < now() && 
        (!$input || 
          title match "*" + $input + "*" || 
          description match "*" + $input + "*" || 
          categories[]->title match "*" + $input + "*"
        )
      ])
    }
  `
);

export const LATEST_SIX_POSTS_QUERY = defineQuery(
  `
    *[_type=="post" && defined(slug.current) && publishedAt < now()] 
    | order(publishedAt desc)[0...6] {
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
