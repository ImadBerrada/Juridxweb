import { PrismaClient, SettingType } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@juridx.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Abderrahman Adel',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create services
  const services = [
    {
      title: 'Droit des Affaires International',
      description: 'Conseil juridique spécialisé pour les transactions commerciales internationales et la structuration d\'entreprises multi-juridictionnelles.',
      icon: 'Scale',
      featured: true,
      order: 1,
    },
    {
      title: 'Structuration Juridique',
      description: 'Optimisation de structures juridiques complexes pour maximiser l\'efficacité opérationnelle et la conformité réglementaire.',
      icon: 'Building',
      featured: true,
      order: 2,
    },
    {
      title: 'Stratégie d\'Entreprise',
      description: 'Conseil stratégique pour l\'expansion internationale, les fusions-acquisitions et la transformation digitale.',
      icon: 'TrendingUp',
      featured: true,
      order: 3,
    },
    {
      title: 'IA & Science des Données',
      description: 'Intégration de solutions d\'intelligence artificielle et d\'analyse de données dans les processus juridiques et commerciaux.',
      icon: 'Brain',
      featured: false,
      order: 4,
    },
    {
      title: 'Relations Internationales',
      description: 'Expertise en négociations internationales, conformité réglementaire et gestion des risques géopolitiques.',
      icon: 'Globe',
      featured: false,
      order: 5,
    },
    {
      title: 'Support aux Investisseurs',
      description: 'Accompagnement juridique pour les levées de fonds, due diligence et structuration d\'investissements.',
      icon: 'DollarSign',
      featured: false,
      order: 6,
    },
  ]

  for (const service of services) {
    // Check if service exists first
    const existingService = await prisma.service.findFirst({
      where: { title: service.title }
    })
    
    if (!existingService) {
      await prisma.service.create({
        data: service,
      })
    }
  }

  console.log('✅ Services created')

  // Create testimonials
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'CEO',
      company: 'TechGlobal Solutions',
      content: 'L\'expertise d\'Abderrahman en droit international des affaires a été cruciale pour notre expansion européenne. Son approche stratégique et sa connaissance approfondie des réglementations nous ont fait économiser des mois de négociations.',
      rating: 5,
      featured: true,
      approved: true,
    },
    {
      name: 'Dr. James Chen',
      role: 'Directeur Juridique',
      company: 'Innovation Ventures',
      content: 'La combinaison unique de compétences juridiques et technologiques d\'Abderrahman nous a permis de structurer nos investissements en IA de manière optimale. Un conseiller exceptionnel.',
      rating: 5,
      featured: true,
      approved: true,
    },
    {
      name: 'Maria Rodriguez',
      role: 'Fondatrice',
      company: 'EuroTrade Partners',
      content: 'Grâce aux conseils d\'Abderrahman, nous avons pu naviguer avec succès dans les complexités réglementaires du commerce international. Son expertise est inestimable.',
      rating: 5,
      featured: true,
      approved: true,
    },
    {
      name: 'David Thompson',
      role: 'Managing Partner',
      company: 'London Capital Group',
      content: 'L\'approche analytique et la vision stratégique d\'Abderrahman ont transformé notre approche des investissements transfrontaliers. Hautement recommandé.',
      rating: 5,
      featured: false,
      approved: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    })
  }

  console.log('✅ Testimonials created')

  // Create settings
  const settings = [
    { key: 'site_title', value: 'JuridX - Abderrahman Adel', type: SettingType.STRING },
    { key: 'site_description', value: 'Cabinet de Conseil Juridique International', type: SettingType.STRING },
    { key: 'contact_email', value: 'contact@juridx.com', type: SettingType.STRING },
    { key: 'contact_phone', value: '+44 (0) 20 7123 4567', type: SettingType.STRING },
    { key: 'office_address', value: 'London Business District, Londres, Royaume-Uni', type: SettingType.STRING },
    { key: 'linkedin_url', value: 'https://linkedin.com/in/abderrahman-adel', type: SettingType.STRING },
    { key: 'twitter_url', value: 'https://twitter.com/juridx', type: SettingType.STRING },
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ Settings created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 