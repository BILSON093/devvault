import crypto from 'crypto';
import { cacheGet, cacheSet } from '../config/redis';
import prisma from '../config/database';
import { parseGitHub } from '../parsers/github.parser';
import { parseBilibili } from '../parsers/bilibili.parser';
import { parseGeneric } from '../parsers/generic.parser';

export interface ParsedResult {
  title: string;
  description?: string;
  cover?: string;
  type: string;
  source?: string;
  suggestedTags: string[];
  content?: string;
  extra?: Record<string, any>;
}

export async function parseUrlService(url: string): Promise<ParsedResult> {
  const urlHash = crypto.createHash('sha256').update(url).digest('hex');

  // 1. Check Redis cache
  const cached = await cacheGet(`parse:${urlHash}`);
  if (cached) return JSON.parse(cached);

  // 2. Check DB cache
  try {
    const dbCached = await prisma.urlParseCache.findUnique({ where: { urlHash } });
    if (dbCached && new Date(dbCached.expiresAt) > new Date()) {
      const result = JSON.parse(dbCached.parsedData);
      await cacheSet(`parse:${urlHash}`, JSON.stringify(result), 86400);
      return result;
    }
  } catch {}

  // 3. Parse based on URL pattern
  let result: ParsedResult;

  if (/github\.com\/[^/]+\/[^/]+\/gist/.test(url)) {
    result = await parseGitHub(url, 'gist');
  } else if (/github\.com\/[^/]+\/[^/]+/.test(url)) {
    result = await parseGitHub(url, 'repo');
  } else if (/bilibili\.com|b23\.tv/.test(url)) {
    result = await parseBilibili(url);
  } else {
    result = await parseGeneric(url);
  }

  // 4. Save to Redis (24h)
  await cacheSet(`parse:${urlHash}`, JSON.stringify(result), 86400);

  // 5. Save to DB (7 days)
  try {
    await prisma.urlParseCache.upsert({
      where: { urlHash },
      create: {
        urlHash,
        url,
        parsedData: JSON.stringify(result),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      update: {
        parsedData: JSON.stringify(result),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  } catch {}

  return result;
}
