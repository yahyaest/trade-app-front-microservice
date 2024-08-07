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
      reactStrictMode: true,
      images: {
        domains: [
          // "media.kitsu.io",
          "cdn.coinranking.com",
          "172.26.0.4" // need to be fixed (eg: domain name in production , find alternative for development : fix docker network ip address ?)
        ],
      },
      env: {
        NEXT_APP_API_URL: "http://localhost:3000/api",
        NEXT_APP_ROOT_URL: "http://localhost:3000",
        NEXTAUTH_URL: "http://localhost:3000",
        GATEWAY_BASE_URL: process.env.GATEWAY_BASE_URL,
        CRYPTO_BASE_URL: process.env.CRYPTO_BASE_URL,
        WALLET_BASE_URL: process.env.WALLET_BASE_URL,
        NOTIFICATION_BASE_URL: process.env.NOTIFICATION_BASE_URL,
        TASK_SCHEDULER_BASE: process.env.TASK_SCHEDULER_BASE
      },
    };
  }

  // production
  return {
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
      GATEWAY_BASE_URL: process.env.GATEWAY_BASE_URL,
      CRYPTO_BASE_URL: process.env.CRYPTO_BASE_URL,
      WALLET_BASE_URL: process.env.WALLET_BASE_URL,
      NOTIFICATION_BASE_URL: process.env.NOTIFICATION_BASE_URL,
      TASK_SCHEDULER_BASE: process.env.TASK_SCHEDULER_BASE
    },
  };
};
