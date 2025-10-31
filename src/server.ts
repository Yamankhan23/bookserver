/* import express from "express";
import cors from "cors"; */
import dotenv from "dotenv";
import app from "./app.js";

// Import routes (ESM needs `.js` extensions)
import experienceRoutes from "./routes/experiences.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import promoRoutes from "./routes/promo.routes.js"; // ✅ include promo

dotenv.config();

//onst app = express();

/* // ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Base health route (helps check API status)
app.get("/", (_, res) => res.send("🚀 BookIt API is running"));

// ✅ API routes — match your frontend baseURL "http://localhost:5000/api"
app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes); */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
