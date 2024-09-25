import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import { copyFile, createDirectoryStructure, getFileInfo, } from "./fileOperations.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function runExercises() {
    console.log("Running file operation exercises...");
    // Test copyFile
    const sourcePath = path.join(__dirname, "testSource.txt");
    const destPath = path.join(__dirname, "testDestination.txt");
    await fs.writeFile(sourcePath, "This is a test file.");
    await copyFile(sourcePath, destPath);
    console.log("copyFile test completed.");
    // Test createDirectoryStructure
    const testBasePath = path.join(__dirname, "testStructure");
    await createDirectoryStructure(testBasePath);
    console.log("createDirectoryStructure test completed.");
    // Test getFileInfo
    await getFileInfo(destPath); // File info
    await getFileInfo(testBasePath); // Directory info
    console.log("getFileInfo test completed.");
    // Clean up
    await fs.unlink(sourcePath);
    await fs.unlink(destPath);
    await fs.rm(testBasePath, { recursive: true, force: true });
    console.log("Test cleanup completed.");
}
runExercises().catch(console.error);
//# sourceMappingURL=index.js.map