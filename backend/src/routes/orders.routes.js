const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    let { workshopId } = req.user;
    const { role, userId } = req.user;

    if (!workshopId && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { workshopId: true },
      });
      workshopId = user?.workshopId;
    }

    if (!workshopId) {
      return res.json({ data: [], debug: { workshopId: null, totalInDb: 0 } });
    }

    const where = { workshopId };
    if (role === "MECHANIC") {
      where.OR = [{ mechanicId: userId }, { mechanicId: null }];
    }

    const totalInDb = await prisma.workOrder.count({ where: { workshopId } });
    const orders = await prisma.workOrder.findMany({
      where,
      include: {
        client: true,
        vehicle: true,
        mechanic: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ data: orders, debug: { workshopId, totalInDb } });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener órdenes", detail: error.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const workshopId = req.user.workshopId;
    const {
      clientId,
      vehicleId,
      mechanicId,
      diagnosis,
      notes,
      laborCost = 0,
      partsCost = 0,
      status = "PENDIENTE",
    } = req.body;

    const count = await prisma.workOrder.count({ where: { workshopId } });
    const number = `OT-${String(count + 1).padStart(5, "0")}`;
    const totalCost = Number(laborCost) + Number(partsCost);

    const order = await prisma.workOrder.create({
      data: {
        workshopId,
        number,
        clientId,
        vehicleId,
        mechanicId: mechanicId || null,
        diagnosis,
        notes,
        laborCost: Number(laborCost),
        partsCost: Number(partsCost),
        totalCost,
        status,
      },
      include: { client: true, vehicle: true },
    });
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear orden", detail: error.message });
  }
});

module.exports = router;
