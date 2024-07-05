import { spawn } from "child_process";

export function startProccess(command: string) {
    try {
        const childProcess = spawn(command, { shell: true, stdio: 'inherit' });

        if (!childProcess || !childProcess.stdout || !childProcess.stderr) {
            return 'Error getting the operating system';
        }

        childProcess.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

    } catch (error) {
        console.error(error);
        return 'Error getting the operating system';
    }
}
