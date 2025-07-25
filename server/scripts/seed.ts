import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Vérifier si un admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (existingAdmin) {
    console.log('✅ Un administrateur existe déjà dans la base de données');
    return;
  }

  // Créer un admin par défaut
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fusion.dev',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log('👑 Administrateur créé avec succès:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Mot de passe: Admin123!`);
  console.log(`   ⚠️  Changez ce mot de passe en production !`);

  // Créer quelques utilisateurs de test
  const testUsers = [
    {
      email: 'user@test.com',
      username: 'testuser',
      password: await bcrypt.hash('User123!', 12),
      firstName: 'Test',
      lastName: 'User',
      role: 'USER' as const
    },
    {
      email: 'moderator@test.com',
      username: 'testmod',
      password: await bcrypt.hash('Mod123!', 12),
      firstName: 'Test',
      lastName: 'Moderator',
      role: 'MODERATOR' as const
    }
  ];

  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: userData
    });
    console.log(`👤 Utilisateur créé: ${user.email} (${user.role})`);
  }

  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
