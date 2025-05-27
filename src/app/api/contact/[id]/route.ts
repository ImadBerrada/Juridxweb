import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const updateContactSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(['pending', 'contacted', 'resolved', 'archived']).optional().transform((val) => {
    if (!val) return undefined;
    return val.toUpperCase() as 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED';
  }),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateContactSchema.parse(body)

    const updatedContact = await prisma.contact.update({
      where: { id: id },
      data: validatedData,
    })

    return NextResponse.json({
      message: 'Contact mis à jour avec succès',
      contact: updatedContact,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact update error:', error)
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
    const { id } = await params;
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    await prisma.contact.delete({
      where: { id: id },
    })

    return NextResponse.json({
      message: 'Contact supprimé avec succès',
    })
  } catch (error) {
    console.error('Contact deletion error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 