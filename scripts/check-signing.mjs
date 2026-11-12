import { existsSync } from 'node:fs';
const required = ['KURAL_KEYSTORE_PATH', 'KURAL_KEYSTORE_PASSWORD', 'KURAL_KEY_ALIAS', 'KURAL_KEY_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length || !existsSync(process.env.KURAL_KEYSTORE_PATH ?? '')) {
  console.error('Release signing is not configured. Set the KURAL_* signing variables using secure storage; see release/RELEASE.md.');
  process.exit(1);
}
