import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheLife: {
    max: {
      stale: 0,
      revalidate: 0,
      expire: 86400,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "vikna.tv",
      },
      {
        protocol: "https",
        hostname: "cdn4.suspilne.media",
      },
      {
        protocol: "https",
        hostname: "tvmtm.online",
      },
      {
        protocol: "https",
        hostname: "np.pl.ua",
      },
      {
        protocol: "https",
        hostname: "www.stopcor.org",
      },
      {
        protocol: "https",
        hostname: "armyinform.com.ua",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
    ],
  },
  async redirects() {
    // Без цього / (і старі шляхи без локалі) віддавали 200 з порожнім каркасом
    // через клієнтський redirect() — Google бачив дубль головної.
    const legacyRoutes = ["about", "news", "projects", "reports", "support"];

    // Слаги, змінені після правок транслітерації (і→ї тощо). Google досі тримає
    // старі адреси в черзі сканування, тому вони мають віддавати постійне
    // переспрямування (Next для permanent:true віддає 308 — для Google це той самий
    // постійний редирект, що й 301), а не 404.
    const legacySlugs: { from: string; to: string }[] = [
      {
        from: "blahodina-i-oha-my-poruch-na-vdnh",
        to: "blahodiina-ioha-my-poruch-na-vdnh",
      },
    ];

    return [
      { source: "/", destination: "/uk", permanent: true },
      // Специфічні правила для старих слагів — вище за загальні wildcard-и.
      ...legacySlugs.flatMap(({ from, to }) => [
        { source: `/:lang(uk|en)/news/${from}`, destination: `/:lang/news/${to}`, permanent: true },
        { source: `/news/${from}`, destination: `/uk/news/${to}`, permanent: true },
      ]),
      ...legacyRoutes.map((route) => ({
        source: `/${route}`,
        destination: `/uk/${route}`,
        permanent: true,
      })),
      ...legacyRoutes.map((route) => ({
        source: `/${route}/:path*`,
        destination: `/uk/${route}/:path*`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:path*.(jpg|jpeg|png|webp|avif|gif|svg|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.(woff|woff2|ttf|otf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/api/health",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
