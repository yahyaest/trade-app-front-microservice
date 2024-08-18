const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require("next/constants");

/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      output: "standalone",
      experimental: {
        serverComponentsExternalPackages: ["pino", "pino-pretty"],
      },
      reactStrictMode: true,
      images: {
        domains: [
          // "media.kitsu.io",
          "cdn.coinranking.com",
          "172.26.0.4", // need to be fixed (eg: domain name in production , find alternative for development : fix docker network ip address ?)
        ],
      },
      env: {
        NEXT_APP_API_URL: "http://localhost:3000/api",
        NEXT_APP_ROOT_URL: "http://localhost:3000",
        NEXTAUTH_URL: "http://localhost:3000",
        ENV: process.env.ENV,
        LOG_LEVEL: process.env.LOG_LEVEL,
        BASE_URL: process.env.BASE_URL,
        GATEWAY_BASE_URL: process.env.GATEWAY_BASE_URL,
        CRYPTO_BASE_URL: process.env.CRYPTO_BASE_URL,
        WALLET_BASE_URL: process.env.WALLET_BASE_URL,
        NOTIFICATION_BASE_URL: process.env.NOTIFICATION_BASE_URL,
        TASK_SCHEDULER_BASE_URL: process.env.TASK_SCHEDULER_BASE_URL,
        WEBSOCKET_BASE_URL: process.env.WEBSOCKET_BASE_URL,
        
      },
    };
  }

  // production
  return {
    output: "standalone",
    experimental: {
      serverComponentsExternalPackages: ["pino", "pino-pretty"],
    },
    reactStrictMode: true,
    images: {
      domains: [
        // "media.kitsu.io",
      ],
    },
    env: {
      NEXT_APP_API_URL: "http://localhost:3000/api",
      NEXT_APP_ROOT_URL: "http://localhost:3000",
      NEXTAUTH_URL: "http://localhost:3000",
      ENV: process.env.ENV,
      LOG_LEVEL: process.env.LOG_LEVEL,
      BASE_URL: process.env.BASE_URL,
      // BASE_URL: "http://192.168.0.8:3000",
      GATEWAY_BASE_URL: process.env.GATEWAY_BASE_URL,
      CRYPTO_BASE_URL: process.env.CRYPTO_BASE_URL,
      WALLET_BASE_URL: process.env.WALLET_BASE_URL,
      NOTIFICATION_BASE_URL: process.env.NOTIFICATION_BASE_URL,
      TASK_SCHEDULER_BASE_URL: process.env.TASK_SCHEDULER_BASE_URL,
      // WEBSOCKET_BASE_URL: process.env.WEBSOCKET_BASE_URL,
      WEBSOCKET_BASE_URL: "http://192.168.0.10:8765"
    },
  };
};
