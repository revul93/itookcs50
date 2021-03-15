const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (data) => {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      githubUrl: data.html_url,
      avatar: data.avatar_url,
    },
  });

  return user;
};

module.exports = { registerUser };
