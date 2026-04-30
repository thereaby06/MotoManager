const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { jwtSecret } = require("../config/env");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;

    if (!req.user.workshopId && req.user.userId) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { workshopId: true },
      });
      if (user?.workshopId) {
        req.user.workshopId = user.workshopId;
      }
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = { requireAuth };
