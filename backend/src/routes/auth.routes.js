const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { jwtSecret } = require("../config/env");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, role = "OWNER", workshopName } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const workshop = await prisma.workshop.create({
      data: { name: workshopName || "MotoManager Workshop" },
    });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        fullName,
        role,
        workshopId: workshop.id,
      },
    });

    const token = jwt.sign(
      { userId: user.id, workshopId: user.workshopId, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, user: { ...user, password: undefined }, workshop });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar usuario", detail: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { userId: user.id, workshopId: user.workshopId, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const workshop = await prisma.workshop.findUnique({ where: { id: user.workshopId } });

    return res.json({ token, user: { ...user, password: undefined }, workshop });
  } catch (error) {
    return res.status(500).json({ message: "Error al iniciar sesión", detail: error.message });
  }
});

module.exports = router;
