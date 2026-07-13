import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AI learning roadmap...');

  const user = await prisma.user.findUnique({ where: { email: 'demo@devvault.com' } });
  if (!user) {
    console.error('Demo user not found. Run basic seed first.');
    return;
  }

  const tagNames = ['Python', '机器学习', '深度学习', 'PyTorch', 'Transformer', 'LLM', 'RAG', 'Agent', 'LangChain', 'LoRA', 'Prompt', 'B站', '免费', '视频', '实战'];
  const tagMap = new Map<string, number>();
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, color: getTagColor(name) },
    });
    tagMap.set(name, tag.id);
  }
  console.log(`  ✅ Tags: ${tagNames.length}`);

  const path = await prisma.learningPath.create({
    data: {
      userId: user.id,
      title: '🚀 AI 大模型学习路线图',
      description: 'B站为主，全部免费，中文友好，从零到独立开发。',
      isPublic: true,
    },
  });
  console.log(`  ✅ Learning Path created`);

  const collection = await prisma.collection.create({
    data: {
      userId: user.id,
      name: 'AI 大模型学习资源',
      description: '从零开始学 AI 大模型，B站免费资源合集',
      isPublic: true,
      resourceCount: 0,
    },
  });
  console.log(`  ✅ Collection created`);

  console.log('🌱 AI Roadmap seed completed!');
}

function getTagColor(name: string): string {
  const colors: Record<string, string> = {
    Python: '#3776ab',
    机器学习: '#ff6b6b',
    深度学习: '#722ed1',
    PyTorch: '#ee4c2c',
    Transformer: '#faad14',
    LLM: '#1677ff',
    RAG: '#52c41a',
    Agent: '#eb2f96',
    LangChain: '#13c2c2',
    LoRA: '#fa541c',
    Prompt: '#2f54eb',
    B站: '#00a1d6',
    免费: '#00ff88',
    视频: '#00d2ff',
    实战: '#ff69b4',
  };
  return colors[name] || '#1677ff';
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });