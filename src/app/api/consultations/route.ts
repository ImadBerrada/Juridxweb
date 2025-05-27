import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const consultationSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceId: z.string().optional(),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  preferredDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = consultationSchema.parse(body)

    // Get user if authenticated
    const user = getUserFromRequest(request)

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        ...validatedData,
        clientId: user?.userId || null,
      },
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Demande de consultation créée avec succès',
      consultation,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Consultation creation error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where = user.role === 'ADMIN' 
      ? (status ? { status: status as any } : {})
      : { clientId: user.userId }

    const consultations = await prisma.consultation.findMany({
      where,
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.consultation.count({ where })

    return NextResponse.json({
      consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Consultations fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 