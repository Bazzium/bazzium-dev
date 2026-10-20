import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoMeta {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  author?: {
    name: string;
    url: string;
  };
  robots?: string;
  keywords?: string[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteName = 'Bazzium | Dev';
  private readonly baseUrl = 'https://dev.bazzium.com';
  private readonly defaultImage = `${this.baseUrl}/og-placeholder.png`;

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  setPageMetadata(config: SeoMeta): void {
    // Cloudflare serves prerendered directory indexes at trailing-slash URLs.
    const canonicalPath = `${config.path.replace(/\/+$/, '')}/`;
    const canonicalUrl = `${this.baseUrl}${canonicalPath}`;
    const image = config.image ?? this.defaultImage;
    const type = config.type ?? 'website';

    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: (config.keywords ?? []).join(', ') });
    if (config.robots) {
      this.meta.updateTag({ name: 'robots', content: config.robots });
    } else {
      this.meta.removeTag("name='robots'");
    }

    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: image });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (type === 'article' && config.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: config.publishedTime });
    } else {
      this.meta.removeTag("property='article:published_time'");
    }

    this.setCanonical(canonicalUrl);
    this.setStructuredData(config, canonicalUrl);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setStructuredData(config: SeoMeta, canonicalUrl: string): void {
    const articleProperties =
      config.type === 'article'
        ? {
            datePublished: config.publishedTime,
            author: config.author
              ? {
                  '@type': 'Organization',
                  name: config.author.name,
                  url: config.author.url,
                }
              : undefined,
            publisher: {
              '@id': `${this.baseUrl}/#organization`,
            },
          }
        : {};

    const graph = [
      {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
        name: this.siteName,
        url: this.baseUrl,
        logo: `${this.baseUrl}/favicon.svg`,
        description:
          'Izrada sajtova, online prodavnica, web aplikacija i integracija po meri.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Belgrade',
          addressCountry: 'RS',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${this.baseUrl}/#website`,
        name: this.siteName,
        url: this.baseUrl,
        publisher: {
          '@id': `${this.baseUrl}/#organization`,
        },
      },
      {
        '@type': config.type === 'article' ? 'Article' : 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: config.title,
        description: config.description,
        isPartOf: {
          '@id': `${this.baseUrl}/#website`,
        },
        about: {
          '@id': `${this.baseUrl}/#organization`,
        },
        ...articleProperties,
      },
    ];

    const data = {
      '@context': 'https://schema.org',
      '@graph': graph,
    };

    let script = this.document.head.querySelector(
      "script[type='application/ld+json'][data-bazzium-seo]",
    ) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-bazzium-seo', 'true');
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }
}


