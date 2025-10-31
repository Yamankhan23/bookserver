// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    await prisma.booking.deleteMany();
    await prisma.slot.deleteMany();
    await prisma.experience.deleteMany();

    await prisma.experience.createMany({
        data: [
            {
                title: "Scuba Diving in Goa",
                description:
                    "Dive deep into the Arabian Sea and witness colorful marine life with certified instructors.",
                location: "Goa",
                price: 4999,
                imageUrl:
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            },
            {
                title: "Desert Safari in Jaisalmer",
                description:
                    "Ride across golden dunes, enjoy sunset views, and traditional Rajasthani performances.",
                location: "Rajasthan",
                price: 3499,
                imageUrl:
                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            },
            {
                title: "River Rafting in Rishikesh",
                description:
                    "Experience adrenaline-pumping rapids in the holy Ganga with expert guides.",
                location: "Uttarakhand",
                price: 2999,
                imageUrl:
                    "https://images.unsplash.com/photo-1614605670899-47ecba60bf2a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2172",
            },
            {
                title: "Trek to Triund",
                description:
                    "A beginner-friendly trek offering panoramic views of the Dhauladhar ranges.",
                location: "Himachal Pradesh",
                price: 3299,
                imageUrl:
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            },
            {
                title: "Camping in Coorg",
                description:
                    "Enjoy serene nights amidst coffee plantations with bonfires and starry skies.",
                location: "Karnataka",
                price: 2499,
                imageUrl:
                    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            },
            {
                title: "Houseboat Stay in Alleppey",
                description:
                    "Sail through Kerala’s backwaters, enjoy authentic cuisine and peaceful landscapes.",
                location: "Kerala",
                price: 5999,
                imageUrl:
                    "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
            },
            {
                title: "Jaipur Heritage Walk",
                description:
                    "Explore the Pink City’s culture, forts, and hidden gems with a local guide.",
                location: "Rajasthan",
                price: 1499,
                imageUrl:
                    "https://images.unsplash.com/photo-1667099639128-4b10f464f4a2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2073",
            },
            {
                title: "Paragliding in Bir Billing",
                description:
                    "Fly high above the scenic Bir valley — India’s best paragliding destination.",
                location: "Himachal Pradesh",
                price: 3999,
                imageUrl:
                    "https://images.unsplash.com/photo-1620720970374-5b7e67e1e610?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
            },
        ],
    });

    const allExperiences = await prisma.experience.findMany();

    const slotTemplates = [
        { date: "Nov 5", times: ["07:00 AM", "09:00 AM", "11:00 AM", "01:00 PM"] },
        { date: "Nov 6", times: ["07:00 AM", "09:00 AM", "11:00 AM", "01:00 PM"] },
        { date: "Nov 7", times: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM"] },
    ];

    for (const exp of allExperiences) {
        const slotData = [];
        for (const day of slotTemplates) {
            for (const time of day.times) {
                const remaining = Math.floor(Math.random() * 10) + 1;
                slotData.push({
                    date: day.date,
                    time,
                    status: remaining === 0 ? "Sold Out" : "Available",
                    remaining,
                    experienceId: exp.id,
                });
            }
        }
        await prisma.slot.createMany({ data: slotData });
    }

    console.log("✅ Seeding complete with extended slots!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
