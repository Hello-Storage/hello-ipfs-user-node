import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import debug from "debug";
import cors from "cors";

export class Server {
    private app: Express;
    private log: debug.IDebugger;
	private prefix = "/v1";

    constructor() {
        this.log = debug("hello:app");
        this.app = express();
        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware(): void {
        this.app.use(express.json());
		this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan("dev"));
		this.app.disable("x-powered-by");
    }

    private configureRoutes(): void {
        this.app.use((req: Request, res: Response) => {
            res.status(404).send("Not Found");
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            this.log(`Server is running on port ${port}`);
        });
    }
}
