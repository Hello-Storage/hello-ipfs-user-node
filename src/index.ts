import { Server } from "./app";
import dotenv from "dotenv";
import debug from "debug";
import { KuboDownloadHelper } from "./utils/ipfs-kubo-utils";

dotenv.config();
const log = debug("hello:index");
debug.enable("*");

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const KUBO_VERSION = process.env.KUBO_VERSION;

if (!KUBO_VERSION) {
    log("KUBO_VERSION is not set");
    process.exit(1);
}

log(`Kubo version: ${KUBO_VERSION}`);
log(KuboDownloadHelper.getDownloadLink(KUBO_VERSION));

new Server().start(PORT);