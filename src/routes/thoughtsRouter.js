const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { checkAuthentication } = require('../middleware/auth');

router.get('/thoughts/:index', async (req, res) => {
  try {
    // pagination
    // TODO: validate index - should be integer
    const { index } = req.params;
    let thoughtsCount = prisma.thought.count();
    if (index > 1 && index > Math.ceil(thoughtsCount / 10)) {
      return res.redirect(`/thoughts/${index - 1}`);
    }

    let thoughts = await prisma.thought.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
      take: 10,
      skip: (index - 1) * 10,
    });
    res.cookie('history', `/thoughts/${index}`);
    return res.json(thoughts);
  } catch (error) {
    console.error(
      chalk.red(
        `Error while querying database for thoughts\n\t${chalk.bold(error)}`,
      ),
    );
    return res.status(500).json({ message: error.message });
  }
});

router.post('/thought', checkAuthentication, async (req, res) => {
  const { subject, text } = req.body;
  if (!subject || !text) {
    return res.status(401).json({ message: 'Error. Required field is empty' });
  }
  try {
    await prisma.thought.create({
      data: {
        subject,
        text,
        authorId: req.user.id,
      },
    });
    return res.json({ message: 'SUCCESS' });
  } catch (error) {
    console.error(
      chalk.red(
        `Error while saving thought to database\n\t${chalk.bold(error)}`,
      ),
    );
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
