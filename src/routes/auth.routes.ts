import { Router, Request, Response } from "express";
import {AppDataSource} from "../db/data-source";
import { validateBody } from "../middlewares/validateBody";
import { requiredFields } from "../middlewares/requiredFields";
const router = Router();

router.post("/login", validateBody, requiredFields("email", "password"), async (req: Request, res: Response) => {
    try {
    const { email, password } = req.body;
        const user = await AppDataSource.getRepository("User").findOneBy({  email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }   
        const valid = await user.validatePassword(password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }  
        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("[POST /auth/login]:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }  
});


export default router;