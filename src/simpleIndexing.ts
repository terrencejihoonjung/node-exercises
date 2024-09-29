import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

interface IndexEntry {
  path: string;
  hash: string;
}

class SimpleIndex {
  private indexPath: string;
  private entries: IndexEntry[];

  constructor(repositoryPath: string) {
    this.indexPath = path.join(repositoryPath, "index");
    this.entries = [];
  }

  async load(): Promise<void> {
    try {
      // TODO: Read the index file if it exists
      const content = await fs.readFile(this.indexPath, "utf-8");
      // TODO: Parse the content and populate this.entries
      const parsedContent = JSON.parse(content);
      console.log(parsedContent);
      this.entries = parsedContent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ("code" in error && error.code === "ENOENT") {
          this.entries = [];
          console.log(
            "No existing index file found. Starting with an empty index."
          );
        } else {
          console.error("Error loading index:", error);
          throw error;
        }
      }
    }
  }

  async save(): Promise<void> {
    try {
      // TODO: Serialize this.entries to a string
      const serializedEntries = JSON.stringify(this.entries, null, 2);
      // TODO: Write the serialized data to the index file
      await fs.writeFile(this.indexPath, serializedEntries, "utf-8");
      console.log("Index saved successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving serialized entries:", error);
        throw error;
      }
    }
  }

  async add(filePath: string): Promise<void> {
    try {
      const absoluteFilePath = path.resolve(filePath);
      const content = await fs.readFile(absoluteFilePath);

      const hash = crypto.createHash("sha256");
      hash.update(content);

      const relativePath = path.relative(
        path.dirname(this.indexPath),
        absoluteFilePath
      );
      const entry = {
        path: relativePath,
        hash: hash.digest("hex"),
      };

      const entryIndex = this.entries.findIndex((e) => e.path === relativePath);
      if (entryIndex !== -1) this.entries[entryIndex] = entry;
      else this.entries.push(entry);

      await this.save();
      console.log(`Added/updated ${relativePath} to index`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding index", error);
        throw error;
      }
    }
  }

  async remove(filePath: string): Promise<void> {
    try {
      const absoluteFilePath = path.resolve(filePath);
      const relativePath = path.relative(
        path.dirname(this.indexPath),
        absoluteFilePath
      );

      this.entries = this.entries.filter((e) => e.path !== relativePath);
      await this.save();
      console.log(`Removed ${relativePath} from index`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error removing index entry", error);
        throw error;
      }
    }
  }

  getEntries(): IndexEntry[] {
    return this.entries;
  }
}

export default SimpleIndex;
