import jsonPackage from "../../../package.json"

export const JsonPackageAdapter = ({
    getVersion(): string {
        const version = jsonPackage.version;
        return version;
    },
})

