import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'website' | 'tool';
  toolName?: string;
  toolDescription?: string;
  toolUrl?: string;
}

export function StructuredData({
  type = 'website',
  toolName,
  toolDescription,
  toolUrl
}: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';

    if (type === 'website') {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Konsulthjälpen',
        alternateName: 'Konsultverktyg',
        url: 'https://konsulthjalpen.se',
        description: 'Gratis kalkylatorer och verktyg för konsulter och egenföretagare i Sverige. Räkna ut lön efter skatt, timpris, utdelning, förmånsbil, tjänstepension och K10-blankett.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'SEK'
        },
        inLanguage: 'sv-SE',
        audience: {
          '@type': 'Audience',
          audienceType: 'Consultants, Self-employed, Small business owners'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Konsulthjälpen',
          url: 'https://konsulthjalpen.se'
        }
      };
      script.text = JSON.stringify(websiteSchema);
    } else if (type === 'tool' && toolName && toolDescription && toolUrl) {
      const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: toolName,
        description: toolDescription,
        url: toolUrl,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'SEK'
        },
        inLanguage: 'sv-SE',
        isPartOf: {
          '@type': 'WebApplication',
          name: 'Konsulthjälpen',
          url: 'https://konsulthjalpen.se'
        }
      };
      script.text = JSON.stringify(toolSchema);
    }

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [type, toolName, toolDescription, toolUrl]);

  return null;
}
