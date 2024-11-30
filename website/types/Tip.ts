export interface Tip {
  _id: string;
  title: string;
  slug: {
    current: string; // Sanity slug format
  };
  description: string;
  mainImage: {
    asset: {
      _ref: string;
      url: string;
    };
    alt: string;
  };
  author: {
    name: string;
  };
  categories: {
    title: string;
    slug: {
      current: string; // Sanity slug format
    };
    description: string;
  }[];
  publishedAt: string;
  body: {
    _type: string;
    style?: string; // e.g., "normal", "h1", "blockquote"
    children?: {
      _type: string;
      text: string;
      marks?: string[]; // for decorators like "strong", "em"
    }[];
    listItem?: string; // for lists
    level?: number; // e.g., 1 for ordered/unordered lists
  }[]; // Portable Text content array
}

export type TipSlug = {
  slug: string;
};
