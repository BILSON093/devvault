import axios from 'axios';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import type { ParsedResult } from '../services/parse.service';

// Known site patterns for source detection
const SITE_PATTERNS: Record<string, { name: string; tags: string[] }> = {
  'juejin.cn': { name: 'juejin', tags: ['掘金'] },
  'csdn.net': { name: 'csdn', tags: ['CSDN'] },
  'cnblogs.com': { name: 'cnblogs', tags: ['博客园'] },
  'segmentfault.com': { name: 'segmentfault', tags: ['思否'] },
  'zhihu.com': { name: 'zhihu', tags: ['知乎'] },
  'stackoverflow.com': { name: 'stackoverflow', tags: ['StackOverflow'] },
  'developer.mozilla.org': { name: 'mdn', tags: ['MDN', '文档'] },
  'docs.microsoft.com': { name: 'microsoft-docs', tags: ['微软文档'] },
  'docs.oracle.com': { name: 'oracle-docs', tags: ['Oracle文档'] },
  'medium.com': { name: 'medium', tags: ['Medium'] },
  'dev.to': { name: 'devto', tags: ['DEV.to'] },
  'npmjs.com': { name: 'npm', tags: ['npm', '包'] },
  'yarnpkg.com': { name: 'yarn', tags: ['yarn', '包'] },
};

export async function parseGeneric(url: string): Promise<ParsedResult> {
  const { data: html, headers } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
    timeout: 10000,
    maxRedirects: 5,
    maxContentLength: 5 * 1024 * 1024, // 5MB max
  });

  const $ = cheerio.load(html);

  // Extract metadata
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text().trim() ||
    'Untitled';

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    '';

  const cover =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    undefined;

  const keywords =
    $('meta[name="keywords"]').attr('content')?.split(',').map((k) => k.trim()).filter(Boolean) || [];

  // Detect source site
  let source = 'other';
  const suggestedTags: string[] = [];
  for (const [domain, info] of Object.entries(SITE_PATTERNS)) {
    if (url.includes(domain)) {
      source = info.name;
      suggestedTags.push(...info.tags);
      break;
    }
  }

  // Detect resource type
  const type = detectType(url, $);

  // Extract readable content using Readability
  let content: string | undefined;
  try {
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;
    const reader = new Readability(doc);
    const article = reader.parse();
    if (article?.textContent) {
      content = article.textContent.substring(0, 2000);
    }
  } catch {
    // Readability may fail on some pages, that's OK
  }

  // Add keywords to tags
  suggestedTags.push(...keywords.slice(0, 3));

  // If it's a documentation page, add tag
  if (/\/docs?\//.test(url) || /\/api\//.test(url) || /\/reference\//.test(url)) {
    suggestedTags.push('文档');
  }

  return {
    title: title.substring(0, 200),
    description: description.substring(0, 500) || undefined,
    cover,
    type,
    source,
    suggestedTags: [...new Set(suggestedTags)].slice(0, 8),
    content,
  };
}

function detectType(url: string, $: cheerio.CheerioAPI): string {
  // Check for video platforms
  if (/youtube\.com|youtu\.be|bilibili\.com|vimeo\.com/.test(url)) return 'video';

  // Check for Q&A
  if (/stackoverflow\.com\/(q|questions)|zhihu\.com\/question/.test(url)) return 'qa';

  // Check for documentation
  if (/\/docs?\//.test(url) || /\/api\//.test(url) || /\/reference\//.test(url) || /developer\./.test(url)) {
    return 'documentation';
  }

  // Check for code
  if ($('code, pre').length > 5) return 'snippet';

  return 'article';
}
