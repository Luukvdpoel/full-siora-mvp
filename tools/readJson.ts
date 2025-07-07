import fs from 'fs/promises';
import path from 'path';

export async function readJson(fileName: string) {
  const filePath = path.join(__dirname, '../db', fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}
