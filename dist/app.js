// src/app.ts
import express from "express";
import cors from "cors";
import experiencesRouter from "./routes/experiences.routes.js";
import bookingsRouter from "./routes/booking.routes.js";
import promoRouter from "./routes/promo.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_, res) => res.send("BookIt API is running 🚀"));
app.use("/api/experiences", experiencesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/promo", promoRouter);
export default app;
