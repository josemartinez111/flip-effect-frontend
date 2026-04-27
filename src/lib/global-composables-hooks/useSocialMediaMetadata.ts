// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//        LIB > COMPOSABLES > USE-SOCIAL-MEDIA-METADATA.TS
// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { useHead } from '@vueuse/head';
// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

/**
 * Valid social media platforms supported by the metadata generator.
 * Used to ensure type safety when specifying platforms for meta-tag generation.
 */
type SupportedPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

/**
 * Configuration for each social media platform's meta-tag requirements.
 * @property prefix - The prefix used in meta tag names (e.g., 'og' for Open Graph)
 * @property nameAttribute - Whether platform uses 'name' or 'property' attribute
 * @property extraMeta - Additional platform-specific meta tags (e.g., Twitter card type)
 */
interface PlatformConfig {
  prefix: string;
  nameAttribute: 'name' | 'property';
  extraMeta?: Record<string, string>;
}

/**
 * ShowProps for generating social media metadata.
 * @property siteUrl - Base URL of the website
 * @property title - Title for meta tags
 * @property description - Description for meta tags
 * @property path - Optional path to append to siteUrl
 * @property image - Optional social media preview image URL
 * @property type - Content type (website, article, or profile)
 * @property platforms - Array of social platforms to generate meta-tags for
 */
interface SocialMetadataProps {
  siteUrl: string;
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  platforms: SupportedPlatform[];
}

type MetaTag = Record<string, string>;

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const PLATFORM_CONFIGS: Record<SupportedPlatform, PlatformConfig> = {
  facebook: {
    prefix: 'og',
    nameAttribute: 'property',
  },
  instagram: {
    prefix: 'og',
    nameAttribute: 'property',
  },
  twitter: {
    prefix: 'twitter',
    nameAttribute: 'name',
    extraMeta: { card: 'summary_large_image' },
  },
  linkedin: {
    prefix: 'linkedin',
    nameAttribute: 'name',
  },
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export function useSocialMediaMetadata({
  siteUrl,
  title,
  description,
  path = '',
  image,
  type = 'website',
  platforms,
}: SocialMetadataProps): void {
  const url = `${siteUrl}${path}`;

  const meta: MetaTag[] = platforms.flatMap((platform) => {
    const config = PLATFORM_CONFIGS[platform];
    const { prefix, nameAttribute, extraMeta } = config;

    const baseTags: MetaTag[] = [
      { [nameAttribute]: `${prefix}:title`, content: title },
      { [nameAttribute]: `${prefix}:description`, content: description },
    ];

    if (prefix === 'og') {
      baseTags.push(
        { [nameAttribute]: `${prefix}:type`, content: type },
        { [nameAttribute]: `${prefix}:url`, content: url },
      );
    }

    if (image) {
      baseTags.push({ [nameAttribute]: `${prefix}:image`, content: image });
    }

    if (extraMeta) {
      Object.entries(extraMeta).forEach(([key, metaValue]) => {
        baseTags.push({ [nameAttribute]: `${prefix}:${key}`, content: metaValue });
      });
    }

    return baseTags;
  });

  useHead({ meta });
}

// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
