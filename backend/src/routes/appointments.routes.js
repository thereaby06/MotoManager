const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/:id/convert-to-order", requireAuth, async (req, res) => {
  const appointmentId = req.params.id;
  const workshopId = req.user.workshopId;
  const mechanicId = req.body.mechanicId || null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findFirst({
        where: { id: appointmentId, workshopId },
      });

      if (!appointment) {
        throw new Error("Cita no encontrada");
      }

      const count = await tx.workOrder.count({ where: { workshopId } });
      const number = `OT-${String(count + 1).padStart(5, "0")}`;

      const order = await tx.workOrder.create({
        data: {
          workshopId,
          clientId: appointment.clientId,
          vehicleId: appointment.vehicleId,
          number,
          diagnosis: appointment.reason || "Pendiente",
          notes: `Generada desde cita ${appointment.id}`,
          mechanicId,
          status: "PENDIENTE",
        },
      });

      await tx.appointment.update({
        where: { id: appointment.id },
        data: { status: "CONVERTIDA", workOrderId: order.id },
      });

      return { appointmentId: appointment.id, order };
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: "No fue posible convertir la cita", detail: error.message });
  }
});

module.exports = router;
