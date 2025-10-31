// src/controllers/booking.controller.ts
import { Request, Response } from "express";
import prisma from "../models/prismaClient.js";

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { experience: true },
            orderBy: { id: "desc" },
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ message: "Internal server error while fetching bookings" });
    }
};

//create booking 

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, date, time, totalPrice, experienceId, quantity } = req.body;

        // Validation
        if (!name || !email || !date || !time || !experienceId || !quantity) {
            res.status(400).json({ message: "Missing required booking fields" });
            return;
        }

        // Convert/validate quantity
        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty <= 0) {
            res.status(400).json({ message: "Quantity must be a positive integer" });
            return;
        }

        // Transaction: check slot remaining, create booking, decrement remaining, update status if zero
        const result = await prisma.$transaction(async (tx) => {
            // find the slot row (FOR UPDATE semantics not available, but transaction helps)
            const slot = await tx.slot.findFirst({
                where: { date, time, experienceId },
            });

            if (!slot) {
                throw { status: 404, message: "Selected slot not found" };
            }

            // Ensure remaining exists and enough seats
            const remaining = typeof slot.remaining === "number" ? slot.remaining : Infinity;
            if (remaining < qty) {
                throw { status: 400, message: "Not enough seats available" };
            }

            // create booking
            const booking = await tx.booking.create({
                data: {
                    name,
                    email,
                    date,
                    time,
                    quantity: qty,
                    totalPrice: Number(totalPrice) || 0,
                    experienceId: Number(experienceId),
                },
            });

            // decrement remaining (if remaining is numeric)
            if (typeof slot.remaining === "number") {
                const newRemaining = slot.remaining - qty;
                await tx.slot.update({
                    where: { id: slot.id },
                    data: {
                        remaining: newRemaining,
                        status: newRemaining <= 0 ? "Sold Out" : "Available",
                    },
                });
                // return remaining in response
                return { booking, remaining: newRemaining };
            }

            // If no remaining field, set slot to Sold Out (fallback)
            await tx.slot.update({
                where: { id: slot.id },
                data: { status: "Sold Out" },
            });

            return { booking, remaining: 0 };
        });

        res.status(201).json({
            message: "Booking confirmed successfully",
            booking: result.booking,
            remaining: result.remaining,
        });
    } catch (err: any) {
        console.error("❌ Error creating booking:", err);
        const status = err?.status || 500;
        const message = err?.message || "Internal server error while creating booking";
        res.status(status).json({ message });
    }
};
