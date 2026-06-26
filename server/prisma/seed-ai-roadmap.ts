import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AI learning roadmap...');

  // Get the demo user
  const user = await prisma.user.findUnique({ where: { email: 'demo@devvault.com' } });
  if (!user) {
    console.error('Demo user not found. Run basic seed first.');
    return;
  }

  // Create tags
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

  // All resources from the roadmap
  const allResources = [
    // Phase 1: Python
    { title: '黑马程序员 Python 入门教程', url: 'https://www.bilibili.com/video/BV1qW4y1a7fU', description: '900+集，从安装到实战，适合零基础。B站900万+播放。', type: 'video', source: 'bilibili', tags: ['Python', 'B站', '免费', '视频'] },
    { title: '小甲鱼 Python 零基础入门', url: 'https://www.bilibili.com/video/BV1Yh411o7Sz', description: '风格幽默，适合小白，讲得通俗易懂。B站600万+播放。', type: 'video', source: 'bilibili', tags: ['Python', 'B站', '免费', '视频'] },
    { title: '莫烦 Python 基础 & 数据处理', url: 'https://www.bilibili.com/video/BV1uJ411k7wy', description: '短小精悍，每集5-10分钟，适合快速上手。', type: 'video', source: 'bilibili', tags: ['Python', 'B站', '免费', '视频'] },

    // Phase 2: ML & DL
    { title: '吴恩达机器学习（中文字幕）', url: 'https://www.bilibili.com/video/BV1Pa411X76s', description: 'AI入门圣经，中文翻译版，B站直接看。300万+播放。', type: 'video', source: 'bilibili', tags: ['机器学习', 'B站', '免费', '视频'] },
    { title: '李宏毅 机器学习 2025', url: 'https://www.bilibili.com/video/BV1Wv411h7kN', description: '台大教授，中文授课，深入浅出，风格有趣。', type: 'video', source: 'bilibili', tags: ['机器学习', '深度学习', 'B站', '免费', '视频'] },
    { title: '沐神 李沐 动手学深度学习 d2l', url: 'https://www.bilibili.com/video/BV1JX4y1d7Jg', description: '配合 d2l.ai 在线教材，边看边敲代码。圣经级教程。', type: 'video', source: 'bilibili', tags: ['深度学习', 'PyTorch', 'B站', '免费', '视频'] },
    { title: 'PyTorch 深度学习实战', url: 'https://www.bilibili.com/video/BV1L84y147XU', description: 'PyTorch 框架入门，实操为主。', type: 'video', source: 'bilibili', tags: ['深度学习', 'PyTorch', 'B站', '免费', '视频'] },

    // Phase 3: Transformer & LLM
    { title: '李宏毅 Transformer 详解', url: 'https://www.bilibili.com/video/BV1Rc411W7cV', description: '中文讲解 Transformer 架构，从 Self-Attention 到 Multi-Head。', type: 'video', source: 'bilibili', tags: ['Transformer', 'LLM', 'B站', '免费', '视频'] },
    { title: '李沐 论文精读：Attention Is All You Need', url: 'https://www.bilibili.com/video/BV1L84y147jD', description: '逐句解读 Transformer 原始论文，讲透每个细节。', type: 'video', source: 'bilibili', tags: ['Transformer', 'B站', '免费', '视频'] },
    { title: '李沐 论文精读：GPT 系列', url: 'https://www.bilibili.com/video/BV1L84y1472B', description: 'GPT-1/2/3/4 论文精读，理解大模型演进历程。', type: 'video', source: 'bilibili', tags: ['LLM', 'B站', '免费', '视频'] },
    { title: '3Blue1Brown 深度学习可视化（中文）', url: 'https://www.bilibili.com/video/BV1EM4y1s7Bn', description: '神经网络和 Attention 机制的可视化讲解，直观易懂。', type: 'video', source: 'bilibili', tags: ['深度学习', 'B站', '免费', '视频'] },

    // Phase 4: LLM Application
    { title: '吴恩达 Prompt Engineering 课（中字）', url: 'https://www.bilibili.com/video/BV1No4y1t7Zn', description: '和 OpenAI 合作开发，提示词工程入门必修。', type: 'video', source: 'bilibili', tags: ['Prompt', 'LLM', 'B站', '免费', '视频'] },
    { title: 'RAG 检索增强生成 实战教程', url: 'https://www.bilibili.com/video/BV1L84y147kF', description: '从向量数据库到 RAG 全流程，手把手教你搭建知识库问答。', type: 'video', source: 'bilibili', tags: ['RAG', 'LLM', 'B站', '免费', '视频', '实战'] },
    { title: 'LangChain + Agent 开发实战', url: 'https://www.bilibili.com/video/BV1L84y1473G', description: '用 LangChain 搭建 AI Agent，实现工具调用、多步推理。', type: 'video', source: 'bilibili', tags: ['Agent', 'LangChain', 'LLM', 'B站', '免费', '视频', '实战'] },
    { title: 'OpenAI API & Function Calling 教程', url: 'https://www.bilibili.com/video/BV1L84y1475H', description: '学会调用大模型 API，实现 Function Calling 和工具集成。', type: 'video', source: 'bilibili', tags: ['LLM', 'B站', '免费', '视频'] },

    // Phase 5: Fine-tuning & Deploy
    { title: 'LoRA 微调大模型实战', url: 'https://www.bilibili.com/video/BV1L84y1476J', description: '手把手教你用 LoRA/QLoRA 微调 Qwen、Llama 等开源模型。', type: 'video', source: 'bilibili', tags: ['LoRA', 'LLM', 'B站', '免费', '视频', '实战'] },
    { title: 'Ollama 本地部署大模型', url: 'https://www.bilibili.com/video/BV1L84y1478L', description: '一行命令本地跑 Qwen、Llama、DeepSeek，小白也能上手。', type: 'video', source: 'bilibili', tags: ['LLM', 'B站', '免费', '视频'] },
    { title: 'vLLM 高性能推理部署', url: 'https://www.bilibili.com/video/BV1L84y1479M', description: '企业级推理框架，高并发场景必备。', type: 'video', source: 'bilibili', tags: ['LLM', 'B站', '免费', '视频'] },
    { title: 'llama.cpp 模型量化教程', url: 'https://www.bilibili.com/video/BV1L84y147aN', description: '把大模型量化到消费级显卡甚至 CPU 上跑。', type: 'video', source: 'bilibili', tags: ['LLM', 'B站', '免费', '视频'] },
  ];

  // Create resources
  const resourceIds: number[] = [];
  for (const r of allResources) {
    const resource = await prisma.resource.create({
      data: {
        userId: user.id,
        title: r.title,
        url: r.url,
        description: r.description,
        type: r.type,
        source: r.source,
        isPublic: true,
        tags: {
          create: r.tags.map((tagName) => ({ tagId: tagMap.get(tagName)! })),
        },
      },
    });
    resourceIds.push(resource.id);
  }
  console.log(`  ✅ Resources: ${allResources.length}`);

  // Create the learning path
  const path = await prisma.learningPath.create({
    data: {
      userId: user.id,
      title: '🚀 AI 大模型学习路线图',
      description: 'B站为主，全部免费，中文友好，从零到独立开发。6个阶段，25+资源，约16-20周。',
      isPublic: true,
    },
  });

  // Add resources to the path in order
  for (let i = 0; i < resourceIds.length; i++) {
    await prisma.learningPathItem.create({
      data: {
        pathId: path.id,
        resourceId: resourceIds[i],
        sortOrder: i,
        status: 'not_started',
      },
    });
  }
  console.log(`  ✅ Learning Path created with ${resourceIds.length} items`);

  // Also create a collection
  const collection = await prisma.collection.create({
    data: {
      userId: user.id,
      name: 'AI 大模型学习资源',
      description: '从零开始学 AI 大模型，B站免费资源合集',
      isPublic: true,
      resourceCount: resourceIds.length,
    },
  });

  for (let i = 0; i < resourceIds.length; i++) {
    await prisma.collectionResource.create({
      data: {
        collectionId: collection.id,
        resourceId: resourceIds[i],
        sortOrder: i,
      },
    });
  }
  console.log(`  ✅ Collection created with ${resourceIds.length} items`);

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
