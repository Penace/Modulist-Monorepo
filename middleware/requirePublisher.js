// Middleware to check if the user is a publisher
const requirePublisher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "publisher" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Publisher or admin access required" });
  }

  next();
};

export { requirePublisher };

