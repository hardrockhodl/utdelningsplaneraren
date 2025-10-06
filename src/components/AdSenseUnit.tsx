import { useEffect } from 'react';

interface AdSenseUnitProps {
  adSlot: string;
  adFormat?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSenseUnit({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdSenseUnitProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={{ minHeight: '100px', ...style }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-6465549409883885"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
