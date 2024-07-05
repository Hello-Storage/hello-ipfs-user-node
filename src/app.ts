import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import debug from "debug";

export class Server {
    private app: Express;
    private log: debug.IDebugger;

    constructor() {
        this.log = debug("hello:app");
        this.app = express();
        this.configureMiddleware();
        this.configureRoutes();
        debug.enable("*");
    }

    private configureMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan("dev"));
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
