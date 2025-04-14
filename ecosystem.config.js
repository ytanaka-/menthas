module.exports = {
  apps : [{
    name: "menthas",
    script: "./src/backend/server.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
