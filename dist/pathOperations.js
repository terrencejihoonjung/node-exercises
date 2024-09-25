// src/pathOperations.ts
import path from "path";
export function pathExperiments(basePath, fileName) {
    // Use path.join to combine basePath and fileName
    const fullPath = path.join(basePath, fileName);
    // Use path.resolve to get the absolute path
    const absolutePath = path.resolve(fullPath);
    // Use path.dirname to get the directory name
    const directoryName = path.dirname(fullPath);
    // Use path.basename to get the base name
    const baseName = path.basename(fullPath);
    // Use path.extname to get the file extension
    const extName = path.extname(fileName);
    // Log all these values
    console.log(fullPath, absolutePath, directoryName, baseName, extName);
}
//# sourceMappingURL=pathOperations.js.map