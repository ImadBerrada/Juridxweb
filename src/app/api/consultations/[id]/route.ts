import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const updateConsultationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceId: z.string().optional(),
  description: z.string().optional(),
  preferredDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled']).optional().transform((val) => {
    if (!val) return undefined;
    return val.toUpperCase() as 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  }),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    const { id } = await params;
    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
      },
    })

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation non trouvée' },
        { status: 404 }
      )
    }

    // Check if user can access this consultation
    if (user.role !== 'ADMIN' && consultation.clientId !== user.userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({ consultation })
  } catch (error) {
    console.error('Consultation fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { id } = await params;
    const body = await request.json()
    const validatedData = updateConsultationSchema.parse(body)

    const consultation = await prisma.consultation.update({
      where: { id },
      data: validatedData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
      },
    })

    return NextResponse.json({
      message: 'Consultation mise à jour avec succès',
      consultation,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Consultation update error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { id } = await params;
    await prisma.consultation.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Consultation supprimée avec succès',
    })
  } catch (error) {
    console.error('Consultation deletion error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 