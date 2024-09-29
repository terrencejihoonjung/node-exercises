import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import { copyFile, createDirectoryStructure, getFileInfo, } from "./fileOperations.js";
import { pathExperiments } from "./pathOperations.js";
import { hashFile, hashString } from "./cryptoOperations.js";
import { hashDirectory } from "./directoryHash.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function testCopyFile() {
    console.log("Testing copyFile...");
    const sourcePath = path.join(__dirname, "testSource.txt");
    const destPath = path.join(__dirname, "testDestination.txt");
    await fs.writeFile(sourcePath, "This is a test file.");
    await copyFile(sourcePath, destPath);
    console.log("copyFile test completed.");
    return { sourcePath, destPath };
}
async function testCreateDirectoryStructure() {
    console.log("Testing createDirectoryStructure...");
    const testBasePath = path.join(__dirname, "testStructure");
    await createDirectoryStructure(testBasePath);
    console.log("createDirectoryStructure test completed.");
    return testBasePath;
}
async function testGetFileInfo(filePath, dirPath) {
    console.log("Testing getFileInfo...");
    await getFileInfo(filePath); // File info
    await getFileInfo(dirPath); // Directory info
    console.log("getFileInfo test completed.");
}
function testPathExperiments() {
    console.log("Testing pathExperiments...");
    pathExperiments("/home/user/documents", "report.pdf");
    pathExperiments("C:\\Users\\user\\Documents", "project.docx");
    pathExperiments("../relative/path", "script.js");
    pathExperiments(__dirname, "index.ts");
    console.log("pathExperiments tests completed.");
}
async function testCryptoOperations() {
    console.log("Testing cryptoOperations...");
    const testString = "Hello, Crypto World!";
    const stringHash = hashString(testString);
    console.log(`Hash of "${testString}":`, stringHash);
    const testFilePath = path.join(__dirname, "testHashFile.txt");
    const testFileContent = "This is a test file for hashing.";
    try {
        await fs.writeFile(testFilePath, testFileContent);
        const fileHash = await hashFile(testFilePath);
        console.log("Hash of test file:", fileHash);
        const contentHash = hashString(testFileContent);
        console.log("Hash of file content matches:", fileHash === contentHash);
    }
    catch (error) {
        console.error("Error in crypto tests:", error);
    }
    finally {
        await fs.unlink(testFilePath).catch(console.error);
    }
    console.log("cryptoOperations tests completed.");
}
async function testHashDirectory() {
    console.log("Testing hashDirectory...");
    const testDirPath = path.join(__dirname, "testHashDir");
    try {
        await fs.mkdir(testDirPath, { recursive: true });
        await fs.writeFile(path.join(testDirPath, "file1.txt"), "Content of file 1");
        await fs.writeFile(path.join(testDirPath, "file2.txt"), "Content of file 2");
        await fs.mkdir(path.join(testDirPath, "subdir"));
        await fs.writeFile(path.join(testDirPath, "subdir", "file3.txt"), "Content of file 3");
        const dirHash = await hashDirectory(testDirPath);
        console.log("Hash of test directory:", dirHash);
        const secondHash = await hashDirectory(testDirPath);
        console.log("Hashes match:", dirHash === secondHash);
    }
    catch (error) {
        console.error("Error in hashDirectory test:", error);
    }
    finally {
        await fs
            .rm(testDirPath, { recursive: true, force: true })
            .catch(console.error);
    }
    console.log("hashDirectory test completed.");
}
async function runExercises() {
    console.log("Running file operation exercises...");
    const { sourcePath, destPath } = await testCopyFile();
    const testBasePath = await testCreateDirectoryStructure();
    await testGetFileInfo(destPath, testBasePath);
    testPathExperiments();
    await testCryptoOperations();
    await testHashDirectory();
    // Clean up
    await fs.unlink(sourcePath);
    await fs.unlink(destPath);
    await fs.rm(testBasePath, { recursive: true, force: true });
    console.log("Test cleanup completed.");
}
runExercises().catch(console.error);
//# sourceMappingURL=index.js.map