import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Get dashboard statistics
    const [
      totalContacts,
      pendingContacts,
      totalConsultations,
      pendingConsultations,
      totalUsers,
      totalTestimonials,
      pendingTestimonials,
      totalNewsletterSubscribers,
      totalBlogPosts,
      publishedBlogPosts,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'PENDING' } }),
      prisma.consultation.count(),
      prisma.consultation.count({ where: { status: 'PENDING' } }),
      prisma.user.count(),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { approved: false } }),
      prisma.newsletter.count({ where: { active: true } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ])

    // Get recent contacts
    const recentContacts = await prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        status: true,
        createdAt: true,
      },
    })

    // Get recent consultations
    const recentConsultations = await prisma.consultation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        service: {
          select: {
            title: true,
          },
        },
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get monthly contact statistics for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyContacts = await prisma.contact.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        id: true,
      },
    })

    // Process monthly data
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const count = monthlyContacts.filter(contact => {
        const contactDate = new Date(contact.createdAt)
        const contactMonthKey = `${contactDate.getFullYear()}-${String(contactDate.getMonth() + 1).padStart(2, '0')}`
        return contactMonthKey === monthKey
      }).reduce((sum, item) => sum + item._count.id, 0)

      monthlyStats.push({
        month: monthKey,
        contacts: count,
      })
    }

    return NextResponse.json({
      statistics: {
        contacts: {
          total: totalContacts,
          pending: pendingContacts,
        },
        consultations: {
          total: totalConsultations,
          pending: pendingConsultations,
        },
        users: {
          total: totalUsers,
        },
        testimonials: {
          total: totalTestimonials,
          pending: pendingTestimonials,
        },
        newsletter: {
          subscribers: totalNewsletterSubscribers,
        },
        blog: {
          total: totalBlogPosts,
          published: publishedBlogPosts,
        },
      },
      recentActivity: {
        contacts: recentContacts,
        consultations: recentConsultations,
      },
      monthlyStats,
    })
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 