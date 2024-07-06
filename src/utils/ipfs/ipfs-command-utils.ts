import os from "os";
import path from "path";
import { ChildProcessExecutor } from "../commands-utils";
import { getGlobalConfig } from "../../globals";

export class IpfsCommandUtils {
    // Function to get the version of Kubo
    static async getIpfsVersion(): Promise<string> {
        let ipfs = path.join(os.homedir(), getGlobalConfig("kubo_location")) + "/kubo/ipfs";
        return await new ChildProcessExecutor().startProcess(ipfs + " version", false);
    }
}