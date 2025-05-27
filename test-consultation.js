const { PrismaClient } = require('./src/generated/prisma');

async function testConsultations() {
  const prisma = new PrismaClient();
  
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        service: true,
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Total consultations in database: ${consultations.length}`);
    
    if (consultations.length > 0) {
      console.log('\nLatest consultation:');
      const latest = consultations[0];
      console.log(`- Name: ${latest.firstName} ${latest.lastName}`);
      console.log(`- Email: ${latest.email}`);
      console.log(`- Description: ${latest.description}`);
      console.log(`- Status: ${latest.status}`);
      console.log(`- Created: ${latest.createdAt}`);
      if (latest.service) {
        console.log(`- Service: ${latest.service.title}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConsultations(); 