# Logo System Documentation

## Overview

The GreenThumb website now supports multiple logo variants to provide optimal visual integration across different contexts and backgrounds.

## Logo Variants

### 1. `logo.png` (Default)

- **Purpose**: Standard logo with background
- **Use Cases**:
  - Social media sharing (OpenGraph, Twitter cards)
  - Structured data (JSON-LD)
  - Contexts where background contrast is needed
- **Characteristics**: Has a background for better visibility on social platforms

### 2. `logo-transparent.png` (Transparent)

- **Purpose**: Logo with transparent background
- **Use Cases**:
  - Hero sections and main content areas
  - About page displays
  - Chat avatars
  - Contexts where seamless background integration is desired
- **Characteristics**: Transparent background for better visual integration

## Implementation

### Utility Function

The logo system uses a centralized utility function in `lib/utils.ts`:

```typescript
export function getLogoPath(
  context: "default" | "transparent" | "social" | "avatar" = "default"
): string;
```

### Context Types

- **`'default'`**: Returns `/logo.png` (standard logo)
- **`'transparent'`**: Returns `/logo-transparent.png` (transparent background)
- **`'social'`**: Returns `/logo.png` (optimized for social media)
- **`'avatar'`**: Returns `/logo-transparent.png` (for avatar contexts)

## Usage Examples

### In Components

```typescript
import { getLogoPath } from "@/lib/utils";

// For hero sections
<Image src={getLogoPath('transparent')} alt="GreenThumb Logo" />

// For chat avatars
<AvatarImage src={getLogoPath('avatar')} alt="GreenThumb Logo" />

// For social media metadata
const socialLogo = getLogoPath('social');
```

### In Metadata

```typescript
// For OpenGraph and Twitter cards
openGraph: {
  images: [
    {
      url: getLogoPath("social"),
      width: 1200,
      height: 630,
      alt: "GreenThumb banner",
    },
  ];
}
```

### In Structured Data

```typescript
// For JSON-LD structured data
publisher: {
  "@type": "Organization",
  name: "The GreenThumb",
  logo: {
    "@type": "ImageObject",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${getLogoPath('social')}`,
  },
}
```

## File Locations

### Logo Files

- `public/logo.png` - Standard logo with background
- `public/logo-transparent.png` - Logo with transparent background

### Updated Components

- `components/Home/Hero/Model.tsx` - Uses transparent logo
- `components/Chat/ResponseDisplay.tsx` - Uses avatar logo
- `components/About/CoverSection.tsx` - Uses transparent logo

### Updated Metadata

- `app/layout.tsx` - Main layout metadata
- `app/page.tsx` - Homepage structured data
- `app/(tips)/tip/[slug]/page.tsx` - Tip page structured data
- `app/(tips)/tips/layout.tsx` - Tips layout structured data
- `app/(plants)/plant/[slug]/page.tsx` - Plant page structured data

## Best Practices

1. **Always use the utility function** instead of hardcoding logo paths
2. **Choose the appropriate context** based on the usage:
   - Use `'transparent'` for hero sections and main content
   - Use `'social'` for metadata and structured data
   - Use `'avatar'` for chat and user interface elements
3. **Maintain consistent alt text** for accessibility
4. **Test both logos** on different backgrounds to ensure visibility

## Adding New Logo Variants

To add a new logo variant:

1. Add the new logo file to the `public/` directory
2. Update the `getLogoPath` function in `lib/utils.ts` to include the new variant
3. Update this documentation
4. Test the new variant across different contexts

## Migration Notes

- All existing logo references have been updated to use the utility function
- The system is backward compatible - if a logo file is missing, it falls back to the default
- No breaking changes to existing functionality
