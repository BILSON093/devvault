import axios from 'axios';
import type { ParsedResult } from '../services/parse.service';

export async function parseBilibili(url: string): Promise<ParsedResult> {
  // Extract BV or AV id
  const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
  const avMatch = url.match(/av(\d+)/);

  let bvid: string | undefined;
  let aid: string | undefined;

  if (bvMatch) {
    bvid = bvMatch[0];
  } else if (avMatch) {
    aid = avMatch[1];
  } else {
    throw new Error('无法解析 B站视频链接');
  }

  try {
    const params: any = {};
    if (bvid) params.bvid = bvid;
    else if (aid) params.aid = aid;

    const { data } = await axios.get('https://api.bilibili.com/x/web-interface/view', {
      params,
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.bilibili.com' },
    });

    if (data.code !== 0) throw new Error(data.message || 'B站 API 错误');

    const video = data.data;
    const tags: string[] = ['B站', '视频'];
    if (video.tname) tags.push(video.tname);

    return {
      title: video.title,
      description: video.desc || undefined,
      cover: video.pic?.startsWith('//') ? `https:${video.pic}` : video.pic,
      type: 'video',
      source: 'bilibili',
      suggestedTags: [...new Set(tags)],
      extra: {
        author: video.owner?.name,
        authorAvatar: video.owner?.face,
        view: video.stat?.view,
        danmaku: video.stat?.danmaku,
        like: video.stat?.like,
        duration: video.duration,
        bvid: video.bvid,
        aid: video.aid,
      },
    };
  } catch (err: any) {
    if (err.response?.status) throw new Error('B站 API 请求失败，视频可能已删除');
    throw err;
  }
}
