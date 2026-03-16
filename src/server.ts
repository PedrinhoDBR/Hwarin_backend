import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./db/data-source";
import userRoutes from "./routes/user.route";
import storyRoutes from "./routes/story.routes";
import authRoutes from "./routes/auth.routes"
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

const defaultendpoint = "/api";

app.use(cors());

const routes = [
  {path: '/auth', route: authRoutes},
  { path: `/users`, route: userRoutes },
  { path: `/stories`, route: storyRoutes }
];

routes.forEach((route) => {
  app.use(`${defaultendpoint}${route.path}`, route.route);
});

app.get("/", (req, res) => {
  return res.json({ message: "API rodando 🚀" });
});

AppDataSource.initialize()
  .then(() => {
    const server = app.listen(3000, () => {
      console.log("Servidor rodando 🚀 link: http://localhost:3000");
    });

    process.on("SIGINT", async () => {
      console.log("Fechando conexão...");
      await AppDataSource.destroy();
      server.close(() => {
        process.exit(0);
      });
    });
  })
  .catch((error) => console.log(error));

