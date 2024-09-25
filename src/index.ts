import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import {
  copyFile,
  createDirectoryStructure,
  getFileInfo,
} from "./fileOperations";
import { pathExperiments } from "./pathOperations";
import { hashFile, hashString } from "./cryptoOperations.js";
import { hashDirectory } from "./directoryHash.js";

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

  // Test pathExperiments
  console.log("\nTesting pathExperiments:");
  pathExperiments("/home/user/documents", "report.pdf");
  pathExperiments("C:\\Users\\user\\Documents", "project.docx");
  pathExperiments("../relative/path", "script.js");
  pathExperiments(__dirname, "index.ts");
  console.log("pathExperiments tests completed.");

  // Test cryptoOperations
  console.log("\nTesting cryptoOperations:");

  // Test hashString
  const testString = "Hello, Crypto World!";
  const stringHash = hashString(testString);
  console.log(`Hash of "${testString}":`, stringHash);

  // Test hashFile
  const testFilePath = path.join(__dirname, "testHashFile.txt");
  const testFileContent = "This is a test file for hashing.";
  try {
    await fs.writeFile(testFilePath, testFileContent);
    const fileHash = await hashFile(testFilePath);
    console.log("Hash of test file:", fileHash);

    // Verify that the same content produces the same hash
    const contentHash = hashString(testFileContent);
    console.log("Hash of file content matches:", fileHash === contentHash);
  } catch (error) {
    console.error("Error in crypto tests:", error);
  } finally {
    // Clean up test file
    await fs.unlink(testFilePath).catch(console.error);
  }

  console.log("cryptoOperations tests completed.");

  console.log("\nTesting hashDirectory:");

  const testDirPath = path.join(__dirname, "testHashDir");
  try {
    // Create a test directory structure
    await fs.mkdir(testDirPath, { recursive: true });
    await fs.writeFile(
      path.join(testDirPath, "file1.txt"),
      "Content of file 1"
    );
    await fs.writeFile(
      path.join(testDirPath, "file2.txt"),
      "Content of file 2"
    );
    await fs.mkdir(path.join(testDirPath, "subdir"));
    await fs.writeFile(
      path.join(testDirPath, "subdir", "file3.txt"),
      "Content of file 3"
    );

    const dirHash = await hashDirectory(testDirPath);
    console.log("Hash of test directory:", dirHash);

    // Test consistency
    const secondHash = await hashDirectory(testDirPath);
    console.log("Hashes match:", dirHash === secondHash);
  } catch (error) {
    console.error("Error in hashDirectory test:", error);
  } finally {
    // Clean up
    await fs
      .rm(testDirPath, { recursive: true, force: true })
      .catch(console.error);
  }

  console.log("hashDirectory test completed.");

  // Clean up
  await fs.unlink(sourcePath);
  await fs.unlink(destPath);
  await fs.rm(testBasePath, { recursive: true, force: true });
  console.log("Test cleanup completed.");
}

runExercises().catch(console.error);
