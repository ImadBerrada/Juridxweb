import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const updateTestimonialSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
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
    
    // Handle status field mapping
    if (body.status) {
      body.approved = body.status === 'approved';
      delete body.status;
    }
    
    const validatedData = updateTestimonialSchema.parse(body)

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: id },
      data: validatedData,
    })

    // Map approved back to status for frontend
    const testimonialWithStatus = {
      ...updatedTestimonial,
      status: updatedTestimonial.approved ? 'approved' : 'pending'
    };

    return NextResponse.json({
      message: 'Témoignage mis à jour avec succès',
      testimonial: testimonialWithStatus,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Testimonial update error:', error)
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
    const { id } = await params;
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Handle status field mapping
    if (body.status) {
      body.approved = body.status === 'approved';
      delete body.status;
    }
    
    const validatedData = updateTestimonialSchema.parse(body)

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: id },
      data: validatedData,
    })

    // Map approved back to status for frontend
    const testimonialWithStatus = {
      ...updatedTestimonial,
      status: updatedTestimonial.approved ? 'approved' : 'pending'
    };

    return NextResponse.json({
      message: 'Témoignage mis à jour avec succès',
      testimonial: testimonialWithStatus,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Testimonial update error:', error)
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

    await prisma.testimonial.delete({
      where: { id: id },
    })

    return NextResponse.json({
      message: 'Témoignage supprimé avec succès',
    })
  } catch (error) {
    console.error('Testimonial deletion error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 