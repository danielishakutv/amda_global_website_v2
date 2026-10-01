// Generates the server env credentials for /admin real auth.
// Usage: npm run admin:hash "Your Strong Password Here" [username]
// Prints ADMIN_USERNAME / ADMIN_SALT / ADMIN_HASH (server-only, never
// NEXT_PUBLIC_) plus a fresh ADMIN_SESSION_SECRET. Uses the exact
// PBKDF2-SHA256 parameters the login API uses, so hashes match.
import { pbkdf2Sync, randomBytes } from "node:crypto";

const ITERATIONS = 600_000;

const password = process.argv[2];
const username = process.argv[3] || "amda-admin";
if (!password || password.length < 12) {
  console.error('Usage: npm run admin:hash "a password of at least 12 characters" [username]');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256").toString("hex");
const secret = randomBytes(32).toString("hex");

console.log("# Server env for /admin (never commit, never prefix with NEXT_PUBLIC_):");
console.log(`ADMIN_USERNAME=${username}`);
console.log(`ADMIN_SALT=${salt}`);
console.log(`ADMIN_HASH=${hash}`);
console.log(`ADMIN_SESSION_SECRET=${secret}`);
console.log(`# iterations: ${ITERATIONS}, algorithm: PBKDF2-SHA256`);
