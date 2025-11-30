exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  // Em produção, não vaze stacktrace
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(500).json({ error: message });
};
