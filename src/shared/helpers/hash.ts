import * as crypto from 'node:crypto';

export const createSHA256 = (string: string, salt: string): string => crypto.createHash('sha256')
  .update(string)
  .update(crypto.createHash('sha256').update(salt).digest('hex'))
  .digest('hex');
