// Offline phonetic rendering; translations remain sourced from the bundled dataset.
const vowels: Record<string, string> = { 'அ':'a','ஆ':'aa','இ':'i','ஈ':'ee','உ':'u','ஊ':'oo','எ':'e','ஏ':'ae','ஐ':'ai','ஒ':'o','ஓ':'oa','ஔ':'au','ஃ':'h' };
const consonants: Record<string, string> = { 'க':'k','ங':'ng','ச':'ch','ஞ':'ny','ட':'t','ண':'n','த':'th','ந':'n','ப':'p','ம':'m','ய':'y','ர':'r','ல':'l','வ':'v','ழ':'zh','ள':'l','ற':'r','ன':'n','ஜ':'j','ஷ':'sh','ஸ':'s','ஹ':'h','ஶ':'sh' };
const signs: Record<string, string> = { 'ா':'aa','ி':'i','ீ':'ee','ு':'u','ூ':'oo','ெ':'e','ே':'ae','ை':'ai','ொ':'o','ோ':'oa','ௌ':'au','்':'' };
export function toTanglish(text: string): string {
  const chars = Array.from(text.normalize('NFC'));
  return chars.map((char, index) => {
    if (char in vowels) return vowels[char];
    if (char in consonants) return consonants[char] + (chars[index + 1] in signs ? signs[chars[index + 1]] : 'a');
    if (char in signs) return '';
    return char;
  }).join('');
}
