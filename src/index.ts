import { Server } from "./app";
import dotenv from "dotenv";
import debug from "debug";
import path from "path";
import { downloadFile, extractZipFile } from "./utils/file-utils";
import { KuboDownloadHelper } from "./utils/ipfs-kubo-utils";
import fs from "fs";
import os from "os";

const dotenvAbsolutePath = path.join(__dirname, '../.env');

dotenv.config({
    path: dotenvAbsolutePath
});

debug.enable("hello:index, hello:app");
class App {
    private PORT: number;
    private KUBO_VERSION: string;
    private server: Server;
    private log: debug.IDebugger;

    constructor() {
        this.PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        this.KUBO_VERSION = process.env.KUBO_VERSION ?? "";

        this.log = debug("hello:index");

        if (!this.KUBO_VERSION) {
            this.log("KUBO_VERSION is not set");
            process.exit(1);
        }


        this.log(`Kubo version: ${this.KUBO_VERSION}`);
        this.server = new Server();
    }

    public async start(): Promise<void> {
        try {
            const [downloadLink, fileName] = KuboDownloadHelper.getDownloadLink(this.KUBO_VERSION);
            this.log("Download Link: " + downloadLink);

            this.log("Downloading file: " + fileName);

            // create "kubo" directory if it doesn't exist
            const kuboDir = path.join(os.homedir(), "hello-ipfs-user-node/assets/kubo");
            if (!fs.existsSync(kuboDir)) {
                fs.mkdirSync(kuboDir, { recursive: true });
            }

            const downloadPath = path.join(os.homedir(), "hello-ipfs-user-node/assets/kubo", fileName);
            try {
                await downloadFile(downloadLink, downloadPath, this.log);
                await extractZipFile(downloadPath, this.log, {
                    deleteZipAfterExtract: false,
                    overwrite: true
                });
            } catch (error) {
                this.log("Error:", error);
            }


            this.log(`Downloaded ${fileName}`);

            this.server.start(this.PORT);
        } catch (err) {
            this.log("Error downloading file:", err);
            process.exit(1);
        }
    }
}

const app = new App();
app.start();
