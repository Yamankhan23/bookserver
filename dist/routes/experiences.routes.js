import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
// Get all experiences
router.get("/", async (req, res) => {
    try {
        const experiences = await prisma.experience.findMany();
        res.json(experiences);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch experiences" });
    }
});
// Get experience by ID (with slots)
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const experience = await prisma.experience.findUnique({
            where: { id: Number(id) },
            include: { slots: true },
        });
        if (!experience)
            return res.status(404).json({ error: "Experience not found" });
        res.json(experience);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch experience details" });
    }
});
export default router;
