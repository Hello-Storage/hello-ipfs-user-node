import { Server } from "./app";
import dotenv from "dotenv";
import debug from "debug";
import path from "path";
import { downloadFile, extractZipFile } from "./utils/file-utils";
import { KuboDownloadHelper } from "./utils/ipfs-kubo-utils";
import fs from "fs";
import os from "os";
import { ChildProcessExecutor } from "./utils/commands-utils";

const dotenvAbsolutePath = path.join(__dirname, '../.env');

dotenv.config({
    path: dotenvAbsolutePath
});

debug.enable("*");

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
            // get download link and file name
            const [downloadLink, fileName] = KuboDownloadHelper.getDownloadLink(this.KUBO_VERSION);
            this.log("Download URL: " + downloadLink);
            this.log("Downloading file: " + fileName);

            // create "kubo" directory if it doesn't exist
            const kuboDir = path.join(os.homedir(), "hello-ipfs-user-node/assets/kubo");
            if (!fs.existsSync(kuboDir)) {
                fs.mkdirSync(kuboDir, { recursive: true });
            }

            // download and extract the file on the home directory so we can use ipfs (kubo)
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

            const childExecutor = new ChildProcessExecutor()
            await childExecutor.startProcess("echo hello there, im just testing if this works");

            // start the server so we can use ipfs locally and comunicate with the browser hello.app page
            this.server.start(this.PORT);
        } catch (err) {
            this.log("Error setting up:", err);
            process.exit(1);
        }
    }
}

const app = new App();
app.start();
