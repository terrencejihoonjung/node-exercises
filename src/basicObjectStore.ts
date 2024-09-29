import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

class BasicObjectStore {
  private storePath: string;

  constructor(repositoryPath: string) {
    this.storePath = path.join(repositoryPath, "objects");
  }

  async initialize(repositoryPath: string): Promise<void> {
    if (!this.storePath) this.storePath = path.join(repositoryPath, "objects");
  }

  async store(data: string): Promise<string> {
    try {
      const hash = crypto.createHash("sha256");
      hash.update(data);
      const hexHash = hash.digest("hex");

      const dirPath = path.join(this.storePath, hexHash.slice(0, 2));
      await fs.mkdir(dirPath, { recursive: true });

      const filePath = path.join(dirPath, hexHash.slice(2));
      await fs.writeFile(filePath, data);

      return hexHash;
    } catch (error) {
      console.error("Error storing object:", error);
      throw error;
    }
  }

  async retrieve(hash: string): Promise<string> {
    try {
      // TODO: Reconstruct the path from the hash
      const filePath = path.join(
        this.storePath,
        hash.slice(0, 2),
        hash.slice(2)
      );

      // TODO: Read and return the content of the file
      const contents = await fs.readFile(filePath);
      return contents.toString();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async exists(hash: string): Promise<boolean> {
    try {
      // TODO: Reconstruct the path from the hash
      const filePath = path.join(
        this.storePath,
        hash.slice(0, 2),
        hash.slice(2)
      );

      await fs.access(filePath);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default BasicObjectStore;
