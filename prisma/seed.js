import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      discordId: '123456',
      name: 'John',
      phobias: {
        create: [
          {
            name: 'Fear of the dark',
            description: 'A fear of darkness',
            preference: 'Unaffected',
          },
          {
            name: 'Fear of spiders',
            description: 'A fear of spiders',
            preference: 'Neutral',
          },
          {
            name: 'Fear of heights',
            description: 'A fear of heights',
            preference: 'Warning',
          },
          {
            name: 'Fear of the ocean',
            description: 'A fear of the ocean',
            preference: 'Ban',
          },
        ],
      },
      topic_responses: {
        create: [
          {
            label: 'Fantasy',
            question: 'What is your favourite fantasy book?',
            options: ['The Hobbit', 'The Lord of the Rings', 'Harry Potter'],
            response: 'Fantasy',
          },
          {
            label: 'Adventure',
            question: 'What is your favourite adventure book?',
            options: ['The Hobbit', 'The Lord of the Rings', 'Harry Potter'],
            response: 'Adventure',
          },
          {
            label: 'Struggle',
            question: 'What is your favourite book that deals with struggle?',
            options: ['The Hobbit', 'The Lord of the Rings', 'Harry Potter'],
            response: 'Struggle',
          },
          {
            label: 'Tragedy',
            question: 'What is your favourite tragedy book?',
            options: ['The Hobbit', 'The Lord of the Rings', 'Harry Potter'],
            response: 'Tragedy',
          },
        ],
      },
      groups: {
        create: [
          {
            name: 'Group 1',
            inviteCode: '123456',
            intensity: 'Fantasy',
          },
          {
            name: 'Group 2',
            inviteCode: '123457',
            intensity: 'Adventure',
          },
          {
            name: 'Group 3',
            inviteCode: '123458',
            intensity: 'Struggle',
          },
          {
            name: 'Group 4',
            inviteCode: '123459',
            intensity: 'Tragedy',
          },
        ],
      },
    },
  });
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
