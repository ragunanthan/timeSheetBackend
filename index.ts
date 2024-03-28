
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";


dotenv.config();
const app = express()
const port = process.env.PORT;
app.listen(port)

let corsOptions = {
    origin: [`http://localhost:${port}`],
}
app.use(cors(corsOptions))
app.use(express.json()); //Used to parse JSON bodies
app.use(helmet())


app.get("/", (req: Request, res: Response) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

