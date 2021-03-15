const should = require('should');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('User Actions Test: ', () => {
  it('Test user regestration', async () => {
    const userData = {
      name: 'Omar Jajah',
      email: 'omar_jajah@outlook.com',
      avatar_url: 'https://avatarUrl.com/avatar.png',
      html_url: 'https://github.com/revul93',
    };
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar_url,
        githubUrl: userData.html_url,
      },
    });
    should.ok(user, 'User should exist');
    user.should.has.property('name', 'Omar Jajah');
    console.log('Ok');
  });
  after(async () => {
    await prisma.user.delete({
      where: { email: 'omar_jajah@outlook.com' },
    });
  });
});
