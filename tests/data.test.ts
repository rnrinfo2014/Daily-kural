import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_1330_KURALS, CHAPTERS_133 } from '../src/data/kurals';
import { toTanglish } from '../src/lib/tanglish';

test('all 1330 Kurals have valid chapter mappings and nonempty localized content', () => {
  assert.equal(ALL_1330_KURALS.length, 1330);
  assert.equal(CHAPTERS_133.length, 133);
  for (const [index, kural] of ALL_1330_KURALS.entries()) {
    assert.equal(kural.number, index + 1);
    assert.equal(kural.adhigaramNumber, Math.ceil(kural.number / 10));
    for (const language of ['tamil', 'tanglish', 'english'] as const) {
      for (const value of Object.values(kural.content[language])) assert.ok(typeof value === 'string' && value.length > 0);
    }
  }
});
test('phonetic Tanglish handles vowel signs and pure consonants', () => {
  assert.equal(toTanglish('தமிழ்'), 'thamizh');
  assert.equal(toTanglish('குறள்'), 'kural');
  assert.equal(toTanglish('கோ கௌ'), 'koa kau');
  assert.ok(!/[\u0B80-\u0BFF]/.test(ALL_1330_KURALS[1].content.tanglish.explanation));
});
