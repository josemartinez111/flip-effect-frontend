// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//        LIB > COMPOSABLES > USE_SOCIAL_MEDIA_METADATA_COMPOSABLE.TS
// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import { useHead } from '@unhead/vue';
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

type MetaTag =
	| { name: string; content: string }
	| { property: string; content: string };

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

const createMetaTag = (
	nameAttribute: PlatformConfig['nameAttribute'],
	key: string,
	content: string,
): MetaTag => {
	if (nameAttribute === 'name') {
		return { name: key, content };
	}

	return { property: key, content };
};

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export function UseSocialMediaMetadataComposable({
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
      createMetaTag(nameAttribute, `${prefix}:title`, title),
      createMetaTag(nameAttribute, `${prefix}:description`, description),
    ];

    if (prefix === 'og') {
      baseTags.push(
        createMetaTag(nameAttribute, `${prefix}:type`, type),
        createMetaTag(nameAttribute, `${prefix}:url`, url),
      );
    }

    if (image) {
      baseTags.push(createMetaTag(nameAttribute, `${prefix}:image`, image));
    }

    if (extraMeta) {
      Object.entries(extraMeta).forEach(([key, metaValue]) => {
        baseTags.push(
          createMetaTag(nameAttribute, `${prefix}:${key}`, metaValue),
        );
      });
    }

    return baseTags;
  });

  useHead({ meta });
}

// ⚫️ ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
