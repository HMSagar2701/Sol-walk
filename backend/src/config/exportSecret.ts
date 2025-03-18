import bs58 from 'bs58';
import fs from 'fs';

const wallet = JSON.parse(fs.readFileSync('./dev-wallet.json', 'utf-8'));
const secretKeyUint8Array = Uint8Array.from(wallet);
const base58Key = bs58.encode(secretKeyUint8Array);

console.log('\n🔑 userSecretKey (Base58 Encoded):\n');
console.log(base58Key);
