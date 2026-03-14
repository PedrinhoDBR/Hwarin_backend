import { Router, Request, Response } from "express";
import {AppDataSource} from "../db/data-source";
import {hashPassword} from "../utils/cryptPassword";
import { validateBody } from "../middlewares/validateBody";
import { requiredFields } from "../middlewares/requiredFields";
const router = Router();

const UserRepo = () => AppDataSource.getRepository("User");

router.get("/", async (req: Request, res: Response) => {
    AppDataSource.getRepository("User")
    .find()
    .then((users) => {
        res.json(users);
    })
    .catch((error) => {
        console.error("[GET /users]:", error);
        res.status(500).json({ error: "Internal Server Error" });
    });
});

router.post("/", validateBody, requiredFields("username", "email", "password"), async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        let { role } = req.body;
        role = role || "user"; 

        const existing = await UserRepo().findOneBy({ email });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const password_hash = await hashPassword(password); 

        const user = UserRepo().create({
            username,
            email,
            password_hash,
            role
        });

        await UserRepo().save(user);
        res.status(201).json(user);
    } catch (error) {
        console.error("[POST /users]:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserRepo().findOneBy({ id: Number(req.params.id) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await UserRepo().remove(user);
        return res.status(204).send();
    } catch (error) {
        console.error('[DELETE /users/:id]', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;  