import { readdir, readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";

const directory = new URL("../drizzle/", import.meta.url);
const migrations = (await readdir(directory))
  .filter((name) => /^\d{4}_.+\.sql$/.test(name))
  .sort();
const database = new DatabaseSync(":memory:");
database.exec("PRAGMA foreign_keys = ON");

for (const migration of migrations) {
  const sql = await readFile(new URL(migration, directory), "utf8");
  for (const statement of sql.split("--> statement-breakpoint")) {
    if (statement.trim()) database.exec(statement);
  }
}

const tables = database
  .prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all();
console.log(`Migration check passed: ${migrations.length} files, ${tables.length} tables`);
