import crypto from 'crypto';

const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED || 'GHW25-DEFAULT';

export function getAssignmentSeed() {
  return ASSIGNMENT_SEED;
}

export function checksumDigit(seed, value) {
  const s = `${seed}:${value}`;
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return (sum % 10).toString();
}

export function generateSku(seed, base) {
  const idFragment = base.toString().slice(-6);
  const chk = checksumDigit(seed, base);
  return `${idFragment}-${chk}`;
}

export function hmacSignature(body) {
  const seed = getAssignmentSeed();
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  return crypto.createHmac('sha256', seed).update(payload).digest('hex');
}

export function platformFee(subtotal) {
  const seed = getAssignmentSeed();
  const n = parseInt(seed.replace(/\D/g, '')) || 0;
  const fee = Math.floor(subtotal * 0.017 + n);
  return fee;
}

export default { getAssignmentSeed, checksumDigit, generateSku, hmacSignature, platformFee };
