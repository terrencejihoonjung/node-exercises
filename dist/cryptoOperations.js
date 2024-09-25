import { promises as fs } from "fs";
import crypto from "crypto";
export async function hashFile(filePath) {
    try {
        const contents = await fs.readFile(filePath);
        const hash = crypto.createHash("sha256");
        hash.update(contents);
        return hash.digest("hex");
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export function hashString(input) {
    const hash = crypto.createHash("sha256");
    hash.update(input);
    return hash.digest("hex");
}
//# sourceMappingURL=cryptoOperations.js.map