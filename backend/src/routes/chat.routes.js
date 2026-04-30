const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const workshopId = req.user.workshopId;
  const messages = await prisma.chatMessage.findMany({
    where: { workshopId },
    include: { sender: { select: { id: true, fullName: true } } },
    orderBy: { createdAt: "asc" },
  });
  return res.json(messages);
});

router.post("/", requireAuth, async (req, res) => {
  const workshopId = req.user.workshopId;
  const { content, receiverId = null, orderId = null } = req.body;
  const created = await prisma.chatMessage.create({
    data: {
      workshopId,
      senderId: req.user.userId,
      receiverId,
      orderId,
      content,
    },
  });
  return res.status(201).json(created);
});

router.patch("/:id", requireAuth, async (req, res) => {
  const updated = await prisma.chatMessage.update({
    where: { id: req.params.id },
    data: {
      content: req.body.content,
      isEdited: true,
    },
  });
  return res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await prisma.chatMessage.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});

module.exports = router;
