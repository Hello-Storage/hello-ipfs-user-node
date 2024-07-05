export class KuboDownloadHelper {
    // Function to get the operating system of the user
    private static getOperatingSystem(): string {
        const platform = process.platform;
        switch (platform) {
            case 'win32':
                return 'windows';
            case 'darwin':
                return 'macos';
            case 'linux':
                return 'linux';
            case 'freebsd':
                return 'freebsd';
            case 'openbsd':
                return 'openbsd';
            default:
                return 'unknown';
        }
    }

    // Function to get the architecture of the processor of the user
    private static getArchitecture(): string {
        const arch = process.arch;
        switch (arch) {
            case 'x64':
                return '64-bit';
            case 'ia32':
                return '32-bit';
            case 'arm':
                return 'ARM';
            case 'arm64':
                return 'ARM-64';
            default:
                return 'unknown';
        }
    }

    // Function to generate the download link for Kubo based on version
    static getDownloadLink(version: string): string {
        const baseUrl = "https://dist.ipfs.tech/";
        const operatingSystem = KuboDownloadHelper.getOperatingSystem();
        const architecture = KuboDownloadHelper.getArchitecture();

        // Operating system mapping to file names
        const osMap: Record<string, string> = {
            "windows": "windows",
            "macos": "darwin",
            "linux": "linux",
            "freebsd": "freebsd",
            "openbsd": "openbsd"
        };

        // Architecture mapping to file suffixes
        const archMap: Record<string, string> = {
            "32-bit": "386",
            "64-bit": "amd64",
            "ARM": "arm",
            "ARM-64": "arm64"
        };

        // Base file name
        const fileNameBase = `kubo_v${version}_${osMap[operatingSystem]}-`;

        // Determine extension based on operating system
        const extension = operatingSystem === "windows" ? "zip" : "tar.gz";

        // Get architecture suffix based on provided parameter
        const archSuffix = archMap[architecture];

        // Full download link
        const downloadLink = `${baseUrl}kubo/v${version}/${fileNameBase}${archSuffix}.${extension}`;

        return downloadLink;
    }
}