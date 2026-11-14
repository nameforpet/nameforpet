import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'nameforpet.com - AI Pet Name Generator from Photo';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF6F0',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #E8DFD4 2%, transparent 0%), radial-gradient(circle at 75px 75px, #E8DFD4 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 24px',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FDBA74',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
          }}
        >
          <span style={{ fontSize: '28px' }}>🐾</span>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#1C1917',
              letterSpacing: '-0.5px',
            }}
          >
            nameforpet<span style={{ color: '#EA580C' }}>.com</span>
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#D1FAE5',
              padding: '4px 12px',
              borderRadius: '9999px',
            }}
          >
            AI Vision Engine
          </span>
        </div>

        {/* Main Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          <h1
            style={{
              fontSize: '62px',
              fontWeight: 900,
              color: '#1C1917',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              margin: '0 0 16px 0',
            }}
          >
            Find your pet&apos;s perfect name
            <span
              style={{
                marginLeft: '16px',
                color: '#EA580C',
                backgroundImage: 'linear-gradient(to right, #EA580C, #D97706)',
                backgroundClip: 'text',
              }}
            >
              with AI
            </span>
          </h1>

          <p
            style={{
              fontSize: '26px',
              color: '#57534E',
              lineHeight: 1.4,
              maxWidth: '820px',
              margin: '0 0 40px 0',
            }}
          >
            Upload your dog, cat, rabbit, or bird photo. Scan coat colors &amp; personality traits across 22+ languages.
          </p>
        </div>

        {/* Feature Highlights Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: '1px solid #E7E5E4',
              fontSize: '18px',
              fontWeight: 700,
              color: '#44403C',
            }}
          >
            <span>🌍</span> 22+ Worldwide Languages
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: '1px solid #E7E5E4',
              fontSize: '18px',
              fontWeight: 700,
              color: '#44403C',
            }}
          >
            <span>✨</span> 17,900+ Curated Names
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: '1px solid #E7E5E4',
              fontSize: '18px',
              fontWeight: 700,
              color: '#059669',
            }}
          >
            <span>🔒</span> 100% Free &amp; Private
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
