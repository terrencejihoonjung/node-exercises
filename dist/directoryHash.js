import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
export async function hashDirectory(dirPath) {
    const hash = crypto.createHash("sha256");
    async function processItem(itemPath) {
        const stats = await fs.stat(itemPath);
        const relativePath = path.relative(dirPath, itemPath);
        hash.update(relativePath);
        if (stats.isFile()) {
            const fileContents = await fs.readFile(itemPath);
            hash.update(fileContents);
        }
        else if (stats.isDirectory()) {
            const dirContents = await fs.readdir(itemPath);
            dirContents.sort(); // allows for the same hash output for any OS
            for (let item of dirContents)
                await processItem(path.join(itemPath, item));
        }
    }
    try {
        await processItem(dirPath);
        return hash.digest("hex");
    }
    catch (error) {
        console.error(`Error hashing directory ${dirPath}:`, error);
        throw error;
    }
}
//# sourceMappingURL=directoryHash.js.map