import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const testimonialSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  role: z.string().min(1, 'Le rôle est requis'),
  company: z.string().optional(),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  rating: z.number().min(1).max(5).default(5),
})

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let where = {};
    
    // If not admin, only show approved testimonials
    if (!user || user.role !== 'ADMIN') {
      where = { approved: true };
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      skip: user?.role === 'ADMIN' ? (page - 1) * limit : 0,
      take: user?.role === 'ADMIN' ? limit : undefined,
    })

    // Map approved field to status for frontend compatibility
    const mappedTestimonials = testimonials.map(testimonial => ({
      ...testimonial,
      status: testimonial.approved ? 'approved' : 'pending'
    }));

    if (user?.role === 'ADMIN') {
      const total = await prisma.testimonial.count({ where });
      return NextResponse.json({
        testimonials: mappedTestimonials,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    return NextResponse.json({ testimonials: mappedTestimonials })
  } catch (error) {
    console.error('Testimonials fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle status field mapping
    let approved = false;
    if (body.status) {
      approved = body.status === 'approved';
      delete body.status;
    }
    
    const validatedData = testimonialSchema.parse(body)

    const testimonial = await prisma.testimonial.create({
      data: {
        ...validatedData,
        approved,
        featured: body.featured || false,
      },
    })

    // Map approved back to status for frontend
    const testimonialWithStatus = {
      ...testimonial,
      status: testimonial.approved ? 'approved' : 'pending'
    };

    return NextResponse.json({
      message: 'Témoignage créé avec succès.',
      testimonial: testimonialWithStatus,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Testimonial creation error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, approved, featured } = body

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(approved !== undefined && { approved }),
        ...(featured !== undefined && { featured }),
      },
    })

    return NextResponse.json({
      message: 'Témoignage mis à jour avec succès',
      testimonial,
    })
  } catch (error) {
    console.error('Testimonial update error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 