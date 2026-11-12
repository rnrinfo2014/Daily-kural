import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { ALL_1330_KURALS, CHAPTERS_133, TOPICS } from '../src/data/kurals';
const dir = 'android/app/src/main/assets';
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/kurals.json`, JSON.stringify({ kurals: ALL_1330_KURALS, chapters: CHAPTERS_133, topics: TOPICS }));
copyFileSync('public/privacy-policy.html', `${dir}/privacy-policy.html`);
console.log(`Exported ${ALL_1330_KURALS.length} Kurals and ${CHAPTERS_133.length} chapters for native Android.`);
