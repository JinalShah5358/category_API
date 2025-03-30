import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "./db/db";
import globalRouter from "./routes/index";
dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 7001;

app.use(express.json());

// Health check route
app.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});

app.use("/api", globalRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
