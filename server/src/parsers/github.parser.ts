import axios from 'axios';
import type { ParsedResult } from '../services/parse.service';

const GITHUB_API = 'https://api.github.com';

export async function parseGitHub(url: string, variant: 'repo' | 'gist'): Promise<ParsedResult> {
  if (variant === 'gist') {
    return parseGist(url);
  }
  return parseRepo(url);
}

async function parseRepo(url: string): Promise<ParsedResult> {
  // Extract owner/repo from URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('无法解析 GitHub URL');

  const [, owner, repo] = match;

  try {
    const [repoRes, readmeRes] = await Promise.all([
      axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
        headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'DevVault/1.0' },
      }).catch(() => null),
      axios.get(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'DevVault/1.0' },
      }).catch(() => null),
    ]);

    const data = repoRes?.data;
    if (!data) throw new Error('无法获取仓库信息');

    const tags: string[] = [];
    if (data.language) tags.push(data.language);
    if (data.topics) tags.push(...data.topics.slice(0, 5));
    tags.push('GitHub');

    let readmeContent: string | undefined;
    if (readmeRes?.data?.content) {
      readmeContent = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8').substring(0, 2000);
    }

    return {
      title: `${data.full_name} — ${data.description || 'GitHub Repository'}`,
      description: data.description || undefined,
      cover: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
      type: 'repository',
      source: 'github',
      suggestedTags: [...new Set(tags)],
      content: readmeContent,
      extra: {
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        license: data.license?.name,
        owner: data.owner?.login,
        ownerAvatar: data.owner?.avatar_url,
      },
    };
  } catch (err: any) {
    if (err.response?.status === 404) throw new Error('仓库不存在或为私有仓库');
    throw new Error('GitHub API 请求失败');
  }
}

async function parseGist(url: string): Promise<ParsedResult> {
  const match = url.match(/gist\.github\.com\/([^/]+)\/([a-f0-9]+)/);
  if (!match) throw new Error('无法解析 Gist URL');

  const [, username, gistId] = match;

  try {
    const { data } = await axios.get(`${GITHUB_API}/gists/${gistId}`, {
      headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'DevVault/1.0' },
    });

    const files = Object.values(data.files || {}) as any[];
    const firstFile = files[0];
    const language = firstFile?.language || 'Unknown';

    return {
      title: data.description || `Gist by ${username}`,
      description: files.map((f: any) => f.filename).join(', '),
      type: 'snippet',
      source: 'github',
      suggestedTags: [language, 'GitHub', 'Gist'].filter(Boolean),
      content: firstFile?.content?.substring(0, 5000),
      extra: {
        language,
        files: files.map((f: any) => ({ filename: f.filename, language: f.language, size: f.size })),
        owner: data.owner?.login,
        ownerAvatar: data.owner?.avatar_url,
      },
    };
  } catch (err: any) {
    if (err.response?.status === 404) throw new Error('Gist 不存在');
    throw new Error('GitHub API 请求失败');
  }
}
