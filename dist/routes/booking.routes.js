import { Router } from "express";
import { getAllBookings, createBooking } from "../controllers/bookings.controller.js";
const router = Router();
router.get("/", getAllBookings);
router.post("/", createBooking);
export default router;
