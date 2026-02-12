/* eslint-disable no-console */
import 'dotenv/config';
import fse from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import del from 'del';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDatabaseType(url = process.env.DATABASE_URL) {
  const type = process.env.DATABASE_TYPE || (url && url.split(':')[0]);

  if (type === 'postgres') {
    return 'postgresql';
  }

  return type;
}

const databaseType = getDatabaseType();

if (!databaseType || !['mysql', 'postgresql'].includes(databaseType)) {
  throw new Error(`Missing or invalid database type: ${databaseType}`);
}

console.log(`Database type detected: ${databaseType}`);

const src = path.resolve(__dirname, `../db/${databaseType}`);
const dest = path.resolve(__dirname, '../prisma');

del.sync(dest);

fse.copySync(src, dest);

console.log(`Copied ${src} to ${dest}`);
