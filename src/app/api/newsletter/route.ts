import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const newsletterSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = newsletterSchema.parse(body)

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      if (existingSubscription.active) {
        return NextResponse.json(
          { error: 'Cet email est déjà abonné à notre newsletter' },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { active: true, name },
        })
        
        return NextResponse.json({
          message: 'Abonnement réactivé avec succès'
        })
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email, name },
    })

    return NextResponse.json({
      message: 'Abonnement à la newsletter réussi'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    await prisma.newsletter.update({
      where: { email },
      data: { active: false },
    })

    return NextResponse.json({
      message: 'Désabonnement réussi'
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.newsletter.count({
      where: { active: true },
    })

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Newsletter subscribers fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 