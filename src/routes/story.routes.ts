import { Router, Request, Response } from "express";
import {AppDataSource} from "../db/data-source";
import { validateBody } from "../middlewares/validateBody";
import { requiredFields } from "../middlewares/requiredFields";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    AppDataSource.getRepository("Story")
    .find()
    .then((stories) => {
        res.json(stories);
    })
    .catch((error) => {
        console.error("Error fetching stories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    });
});

export default router;  