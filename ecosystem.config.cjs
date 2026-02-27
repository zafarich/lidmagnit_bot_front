module.exports = {
  apps: [
    {
      name: "onboarding2-frontend",
      port: 8007,
      exec_mode: "cluster",
      instances: 2,
      script: "./.output/server/index.mjs",
      env: {
        PORT: 8007,
        NODE_ENV: "production",
      },
    },
  ],
};
