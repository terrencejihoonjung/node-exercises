import { promises as fs } from "fs";
import crypto from "crypto";

export async function hashFile(filePath: string): Promise<string> {
  // TODO: Implement file hashing
  // Read the file content using fs.readFile
  // Create a SHA-256 hash of the content
  // Return the hash as a hexadecimal string
  // Handle potential errors
  return "";
}

export function hashString(input: string): string {
  // TODO: Implement string hashing
  // Create a SHA-1 hash of the input string
  // Return the hash as a hexadecimal string
  return "";
}
