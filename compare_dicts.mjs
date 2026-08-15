import { readFileSync } from 'fs';

const uk = JSON.parse(readFileSync('src/dictionaries/uk.json', 'utf8'));
const en = JSON.parse(readFileSync('src/dictionaries/en.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const ukKeys = getKeys(uk);
const enKeys = getKeys(en);

const missingInEn = ukKeys.filter(k => !enKeys.includes(k));
const missingInUk = enKeys.filter(k => !ukKeys.includes(k));

console.log('Missing in EN:', missingInEn);
console.log('Missing in UK:', missingInUk);
