import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import {
  copyFile,
  createDirectoryStructure,
  getFileInfo,
} from "./fileOperations.js";
import { pathExperiments } from "./pathOperations.js";
import { hashFile, hashString } from "./cryptoOperations.js";
import { hashDirectory } from "./directoryHash.js";
import BasicObjectStore from "./basicObjectStore.js";
import SimpleIndex from "./simpleIndexing.js";

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

async function testGetFileInfo(filePath: string, dirPath: string) {
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
  } catch (error) {
    console.error("Error in crypto tests:", error);
  } finally {
    await fs.unlink(testFilePath).catch(console.error);
  }
  console.log("cryptoOperations tests completed.");
}

async function testHashDirectory() {
  console.log("Testing hashDirectory...");
  const testDirPath = path.join(__dirname, "testHashDir");
  try {
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

    const secondHash = await hashDirectory(testDirPath);
    console.log("Hashes match:", dirHash === secondHash);
  } catch (error) {
    console.error("Error in hashDirectory test:", error);
  } finally {
    await fs
      .rm(testDirPath, { recursive: true, force: true })
      .catch(console.error);
  }
  console.log("hashDirectory test completed.");
}

// Test the BasicObjectStore
async function testBasicObjectStore() {
  console.log("Testing testBasicObjectStore...");
  const store = new BasicObjectStore("./test-repo");

  const testData = "This is a test object";
  const hash = await store.store(testData);
  console.log("Stored object with hash:", hash);

  const retrieved = await store.retrieve(hash);
  console.log("Retrieved object:", retrieved);
  console.log("Data matches:", testData === retrieved);

  const exists = await store.exists(hash);
  console.log("Object exists:", exists);

  const nonExistentHash = "abcdef1234567890";
  const nonExistentExists = await store.exists(nonExistentHash);
  console.log("Non-existent object exists:", nonExistentExists);
}

// Test the SimpleIndex
async function testSimpleIndex() {
  console.log("Testing SimpleIndex...");

  const testRepoPath = "./test-repo";
  const index = new SimpleIndex(testRepoPath);
  await index.load();

  // Create test files
  await fs.mkdir(testRepoPath, { recursive: true });
  await fs.writeFile(path.join(testRepoPath, "file1.txt"), "Content of file 1");
  await fs.writeFile(path.join(testRepoPath, "file2.txt"), "Content of file 2");

  await index.add(path.join(testRepoPath, "file1.txt"));
  await index.add(path.join(testRepoPath, "file2.txt"));

  console.log("Index after adding files:", index.getEntries());

  await index.remove(path.join(testRepoPath, "file1.txt"));

  console.log("Index after removing file1.txt:", index.getEntries());

  // Test non-existent file
  try {
    await index.add(path.join(testRepoPath, "non-existent.txt"));
  } catch (error) {
    console.log("Correctly caught error when adding non-existent file:", error);
  }

  console.log("SimpleIndex tests completed.");
}

async function runExercises() {
  console.log("Running file operation exercises...");

  try {
    const { sourcePath, destPath } = await testCopyFile();
    const testBasePath = await testCreateDirectoryStructure();
    await testGetFileInfo(destPath, testBasePath);
    testPathExperiments();
    await testCryptoOperations();
    await testHashDirectory();
    await testBasicObjectStore();
    await testSimpleIndex();
  } finally {
    // Add a small delay before cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));
    await cleanup();
  }
}

async function cleanup() {
  console.log("Starting cleanup...");

  const paths = [
    path.join(__dirname, "testSource.txt"),
    path.join(__dirname, "testDestination.txt"),
    path.join(__dirname, "testStructure"),
    "./test-repo",
    path.join("./test-repo", "index"), // Add this line
  ];

  for (const p of paths) {
    try {
      await fs.rm(p, { recursive: true, force: true });
      console.log(`Cleaned up: ${p}`);
    } catch (error) {
      console.error(`Error cleaning up ${p}:`, error);
    }
  }

  console.log("Cleanup completed.");
}

runExercises().catch(console.error);
