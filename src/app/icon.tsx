import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
          borderRadius: 8,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main central pad */}
          <path
            d="M 50 48 C 42 48 34 56 36 67 C 37 73 43 78 50 78 C 57 78 63 73 64 67 C 66 56 58 48 50 48 Z"
            fill="#ffffff"
          />
          {/* Toe 1 (left-most) */}
          <ellipse cx="30" cy="46" rx="6.5" ry="9" transform="rotate(-25 30 46)" fill="#ffffff" />
          {/* Toe 2 (mid-left) */}
          <ellipse cx="43" cy="36" rx="6.5" ry="9.5" transform="rotate(-8 43 36)" fill="#ffffff" />
          {/* Toe 3 (mid-right) */}
          <ellipse cx="57" cy="36" rx="6.5" ry="9.5" transform="rotate(8 57 36)" fill="#ffffff" />
          {/* Toe 4 (right-most) */}
          <ellipse cx="70" cy="46" rx="6.5" ry="9" transform="rotate(25 70 46)" fill="#ffffff" />
          {/* Sparkle */}
          <path
            d="M 76 22 L 78 27 L 83 29 L 78 31 L 76 36 L 74 31 L 69 29 L 74 27 Z"
            fill="#fef08a"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}