// global state for the project

const globalConfig: Record<string, any> = {
    kubo_location: "hello-ipfs-user-node/kubo-download",
};

export function getGlobalConfig(key: string) {
    return globalConfig[key];
}

export function setGlobalConfig(key: string, value: any) {
    globalConfig[key] = value;
}
