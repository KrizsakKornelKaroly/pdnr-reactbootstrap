module.exports = {
  apps: [
    {
      name: "PDNR",
      script: "./dist/app.js",
      interpreter: "node",
      watch: ["dist"],
      ignore_watch: ["node_modules", "src"],
      env: {
        NODE_ENV: "development"
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      node_args: "--require ts-node/register"  // Add this line
    }
  ]
};