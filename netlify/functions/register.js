const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, homebase, solarSystem, password } = JSON.parse(event.body);

  try {
    const player = await prisma.player.create({
      data: {
        name,
        homebase,
        solarSystem,
        password, // In production, use bcrypt to hash the password before storing it
      },
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ id: player.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error creating player' }),
    };
  } finally {
    await prisma.$disconnect();
  }
};