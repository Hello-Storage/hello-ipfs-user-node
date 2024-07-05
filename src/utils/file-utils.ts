import axios from 'axios';
import fs from 'fs';
import AdmZip from 'adm-zip';
import path from 'path';
import debug from 'debug';


export async function downloadFile(url: string, destPath: string, log: debug.IDebugger): Promise<boolean> {
    if (fs.existsSync(destPath)) {
        console.log(`The file ${destPath} already exists. No download will be performed.`);
        return true;
    }

    const writer = fs.createWriteStream(destPath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise<boolean>((resolve, reject) => {
        writer.on('finish', () => resolve(true));
        writer.on('error', (err) => {
            fs.unlink(destPath, () => reject(err));
        });
    });
}


interface ExtractOptions {
    deleteZipAfterExtract?: boolean;
    overwrite?: boolean;
}

export async function extractZipFile(zipFilePath: string, log: debug.IDebugger, options: ExtractOptions = {
    deleteZipAfterExtract: false,
    overwrite: false
}): Promise<void> {
    const { deleteZipAfterExtract = false, overwrite = false } = options;

    try {
        const zip = new AdmZip(zipFilePath);
        const zipFileDir = path.dirname(zipFilePath);

        zip.getEntries().forEach(entry => {
            const entryPath = path.join(zipFileDir, entry.entryName);
            if (!overwrite && fs.existsSync(entryPath)) {
                return;
            }
            zip.extractEntryTo(entry, zipFileDir, /* maintainEntryPath */ true, /* overwrite */ overwrite);
        });

        log(`File ${zipFilePath} extracted to ${zipFileDir}.`);

        if (deleteZipAfterExtract) {
            await fs.promises.unlink(zipFilePath);
            log(`File ${zipFilePath} deleted after extraction.`);
        }
    } catch (error) {
        log(`Error extracting ${zipFilePath}:`, error);
        throw error;
    }
}
