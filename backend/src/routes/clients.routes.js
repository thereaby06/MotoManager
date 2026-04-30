const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/vehicles", requireAuth, async (req, res) => {
  try {
    const workshopId = req.user.workshopId;
    const { clientId, plate, brand, model, year } = req.body;
    const normalizedPlate = (plate || "").toUpperCase();

    const vehicle = await prisma.vehicle.create({
      data: {
        workshopId,
        clientId,
        plate: normalizedPlate,
        brand,
        model,
        year: year ? Number(year) : null,
      },
    });
    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar vehículo", detail: error.message });
  }
});

router.get("/vehicles/search", requireAuth, async (req, res) => {
  const workshopId = req.user.workshopId;
  const plate = (req.query.plate || "").toString().toUpperCase();
  const vehicles = await prisma.vehicle.findMany({
    where: {
      workshopId,
      plate: { contains: plate },
    },
  });
  return res.json(vehicles);
});

module.exports = router;
