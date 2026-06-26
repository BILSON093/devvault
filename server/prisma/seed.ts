import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await hashPassword('123456');
  const user = await prisma.user.upsert({
    where: { email: 'demo@devvault.com' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@devvault.com',
      passwordHash,
      bio: 'DevVault Demo User',
    },
  });
  console.log(`  ✅ User: ${user.username} (${user.email})`);

  // Create tags
  const tagData = [
    { name: 'React', color: '#61dafb' },
    { name: 'Vue', color: '#42b883' },
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Python', color: '#3776ab' },
    { name: 'Java', color: '#ed8b00' },
    { name: 'CSS', color: '#1572b6' },
    { name: 'Docker', color: '#2496ed' },
    { name: 'MySQL', color: '#4479a1' },
    { name: 'Redis', color: '#dc382d' },
    { name: 'Git', color: '#f05032' },
    { name: 'Linux', color: '#fcc624' },
    { name: '算法', color: '#ff6b6b' },
    { name: '面试', color: '#ffa94d' },
    { name: '前端', color: '#a855f7' },
    { name: '后端', color: '#14b8a6' },
    { name: '全栈', color: '#ec4899' },
    { name: 'GitHub', color: '#333333' },
    { name: '源码', color: '#6366f1' },
  ];

  for (const tag of tagData) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }
  console.log(`  ✅ Tags: ${tagData.length} created`);

  // Create demo resources
  const reactTag = await prisma.tag.findUnique({ where: { name: 'React' } });
  const jsTag = await prisma.tag.findUnique({ where: { name: 'JavaScript' } });
  const tsTag = await prisma.tag.findUnique({ where: { name: 'TypeScript' } });
  const frontTag = await prisma.tag.findUnique({ where: { name: '前端' } });

  if (reactTag && jsTag && tsTag && frontTag) {
    const resources = [
      {
        title: 'React 官方文档',
        url: 'https://react.dev',
        description: 'React 官方最新文档，包含 Hooks、Server Components 等新特性',
        type: 'documentation',
        source: 'react.dev',
        isPublic: true,
        userId: user.id,
      },
      {
        title: 'TypeScript 入门教程',
        url: 'https://ts.xcatliu.com',
        description: 'TypeScript 中文入门教程，从零开始学习 TypeScript',
        type: 'documentation',
        source: 'xcatliu',
        isPublic: true,
        userId: user.id,
      },
    ];

    for (const r of resources) {
      await prisma.resource.create({
        data: {
          ...r,
          tags: {
            create: [
              { tagId: reactTag.id },
              { tagId: jsTag.id },
              { tagId: frontTag.id },
            ],
          },
        },
      });
    }
    console.log(`  ✅ Resources: ${resources.length} created`);
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
