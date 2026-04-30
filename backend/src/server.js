const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { port } = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/orders.routes");
const appointmentRoutes = require("./routes/appointments.routes");
const chatRoutes = require("./routes/chat.routes");
const clientRoutes = require("./routes/clients.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/clients", clientRoutes);

const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(
  express.static(frontendDist, {
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    },
  })
);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(port, () => {
  console.log(`MotoManager backend running on ${port}`);
});
