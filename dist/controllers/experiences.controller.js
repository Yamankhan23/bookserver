import prisma from "../models/prismaClient.js";
// ------------------ GET All Experiences ------------------
export const getAllExperiences = async (req, res) => {
    try {
        const experiences = await prisma.experience.findMany({
            include: { slots: true },
            orderBy: { id: "asc" },
        });
        if (!experiences.length) {
            res.status(404).json({ message: "No experiences found" });
            return;
        }
        res.status(200).json(experiences);
    }
    catch (error) {
        console.error("❌ Error fetching experiences:", error);
        res.status(500).json({ message: "Internal server error while fetching experiences" });
    }
};
// ------------------ GET Experience by ID ------------------
export const getExperienceById = async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await prisma.experience.findUnique({
            where: { id: Number(id) },
            include: { slots: true },
        });
        if (!experience) {
            res.status(404).json({ message: "Experience not found" });
            return;
        }
        res.status(200).json(experience);
    }
    catch (error) {
        console.error("❌ Error fetching experience details:", error);
        res.status(500).json({ message: "Internal server error while fetching experience details" });
    }
};
