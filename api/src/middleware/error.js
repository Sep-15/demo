// File: src/middleware/error.js
export const errorHandle = (err, req, res, next) => {
  const status = err.status || 500;

  const message =
    status >= 500 ? "INTERNAL_SERVER_ERROR" : err.message || "REQUEST_ERROR";

  res.status(status).json({
    message,
  });
};
