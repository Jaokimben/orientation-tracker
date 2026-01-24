// Simple health check endpoint for Vercel (CommonJS)
module.exports = function handler(req, res) {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "API is running on Vercel",
    node_version: process.version
  });
};
