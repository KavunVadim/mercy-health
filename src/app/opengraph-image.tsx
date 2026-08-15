import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'Mercy & Health Foundation';
export const size = { width: 1200, height: 627 };
export const contentType = 'image/png';

function loadImage(path: string): string {
  const filePath = join(process.cwd(), 'public', path);
  const ext = path.split('.').pop() || 'png';
  const data = readFileSync(filePath);
  const base64 = data.toString('base64');
  return `data:image/${ext === 'svg' ? 'svg+xml' : ext};base64,${base64}`;
}

export default async function Image() {
  const logo = loadImage('fond-emblem.svg');

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 627,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0d0d2b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.03,
        }}
      >
        <img src={logo} width={800} height={800} alt="" style={{ objectFit: 'contain' }} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          padding: '60px 80px',
        }}
      >
        <img src={logo} width={120} height={120} alt="" style={{ objectFit: 'contain' }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Mercy & Health Foundation
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center',
              letterSpacing: '0.05em',
              marginTop: 8,
            }}
          >
            Милосердя та Здоров&apos;я
          </span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 627 },
  );
}
