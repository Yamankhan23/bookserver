import { Request, Response } from "express";

// Define allowed promo code keys
const promoCodes: Record<string, number> = {
    SAVE10: 0.1,   // 10% off
    FLAT100: 100,  // ₹100 off
};

export const validatePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, total } = req.body;

        if (!code || !total) {
            res.status(400).json({ message: "Promo code and total are required" });
            return;
        }

        const normalized = code.trim().toUpperCase();
        const discount = promoCodes[normalized]; // ✅ now safely typed

        if (discount) {
            const discountValue =
                discount < 1 ? total * discount : discount;

            const discountedTotal = Math.max(0, total - discountValue);

            res.status(200).json({
                valid: true,
                discount: discountValue,
                newTotal: discountedTotal,
            });
        } else {
            res.status(400).json({ valid: false, message: "Invalid promo code" });
        }
    } catch (error) {
        console.error("❌ Error validating promo code:", error);
        res.status(500).json({ message: "Internal server error while validating promo code" });
    }
};





