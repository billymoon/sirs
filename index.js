const express = require("express");
const morgan = require("morgan");
const serveIndex = require("serve-index");
const { createProxyMiddleware } = require("http-proxy-middleware");

const sirs = ({ staticRoutes, proxyRoutes, host = "0.0.0.0", port = 80 }) => {
  const app = express();

  app.use(morgan("dev"));

  staticRoutes.forEach(({ route, filePath }) => {
    app.use(route, express.static(filePath));
    app.use(route, serveIndex(filePath));
    console.log(`[SFS] Static File Server created: ${route}  -> file://${filePath}`);
  });

  proxyRoutes.forEach(({ route, target }) => {
    app.use(route, createProxyMiddleware({ target, ws: true }));
  });

  app.listen(port, host, () => {
    console.log(`Starting server at ${host}:${port}`);
  });
};

module.exports = sirs;
