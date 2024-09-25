// src/fileOperations.ts
import { promises as fs } from "fs";
import path from "path";
export async function copyFile(source, destination) {
    try {
        const contents = await fs.readFile(source);
        await fs.writeFile(destination, contents);
        console.log(`File successfully copied from ${source} to ${destination}`);
    }
    catch (error) {
        console.error(error);
    }
}
export async function createDirectoryStructure(basePath) {
    try {
        const parentDirectoryPath = path.join(basePath, "parent");
        await fs.mkdir(parentDirectoryPath, { recursive: true });
        await fs.mkdir(path.join(parentDirectoryPath, "child1"), {
            recursive: true,
        });
        await fs.mkdir(path.join(parentDirectoryPath, "child1"), {
            recursive: true,
        });
        await fs.writeFile(path.join(parentDirectoryPath, "child1", "hello.txt"), "Hello, Node.js!");
        console.log(`Directory structure created successfully in ${basePath}`);
    }
    catch (error) {
        console.error(error);
    }
}
export async function getFileInfo(filePath) {
    // TODO: Implement file/directory information retrieval
    // Use fs.stat to get file/directory stats
    try {
        const stats = await fs.stat(filePath);
        console.log(`File/Directory: ${filePath}`);
        console.log(`Type: ${stats.isDirectory() ? "Directory" : "File"}`);
        console.log(`Size: ${stats.size} bytes`);
        console.log(`Last modified: ${stats.mtime}`);
        if (stats.isDirectory()) {
            const contents = await fs.readdir(filePath);
            console.log(`Contents: `, contents);
        }
    }
    catch (error) {
        console.error(error);
    }
    // Log whether it's a file or directory, its size, and last modified date
    // If it's a directory, use fs.readdir to list its contents
    // Handle potential errors
}
//# sourceMappingURL=fileOperations.js.map