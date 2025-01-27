module.exports = {
  apps: [{
    name: "PDNR",
    script: "./dist/app.js",
    interpreter: "node",
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    max_memory_restart: "1G",
    env_production: {
      NODE_ENV: "production",
      PORT: 3349
    },
    error_file: "./logs/pm2/err.log",
    out_file: "./logs/pm2/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
    log_type: "json"
  }]
};