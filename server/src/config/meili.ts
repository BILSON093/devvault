import { MeiliSearch } from 'meilisearch';
import { env } from './env';

let meili: MeiliSearch | null = null;
let meiliAvailable = false;

try {
  meili = new MeiliSearch({
    host: env.MEILI_URL,
    apiKey: env.MEILI_KEY,
  });
  // Test connection
  meili.health().then(() => {
    meiliAvailable = true;
    console.log('✅ MeiliSearch connected');
    initMeiliIndexes();
  }).catch(() => {
    console.log('⚠️  MeiliSearch not available — search indexing disabled');
  });
} catch {
  console.log('⚠️  MeiliSearch not available — search indexing disabled');
}

export default meili;
export { meiliAvailable };

// Initialize search indexes
async function initMeiliIndexes() {
  if (!meili) return;
  try {
    const resourcesIndex = meili.index('resources');
    await resourcesIndex.updateSettings({
      searchableAttributes: ['title', 'description', 'content'],
      filterableAttributes: ['type', 'language', 'source', 'userId', 'isPublic'],
      sortableAttributes: ['createdAt', 'viewCount', 'likeCount'],
    });
    console.log('✅ MeiliSearch indexes initialized');
  } catch (err) {
    console.error('❌ MeiliSearch init error:', err);
  }
}

// Safe MeiliSearch operations
export async function searchIndex(indexName: string, query: string, options?: any) {
  if (!meili || !meiliAvailable) return null;
  try {
    return await meili.index(indexName).search(query, options);
  } catch { return null; }
}

export async function indexDocument(indexName: string, document: any) {
  if (!meili || !meiliAvailable) return;
  try {
    await meili.index(indexName).addDocuments([document]);
  } catch {}
}

export async function deleteDocument(indexName: string, id: string | number) {
  if (!meili || !meiliAvailable) return;
  try {
    await meili.index(indexName).deleteDocument(id);
  } catch {}
}
