import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Le contenu est requis'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const tag = searchParams.get('tag')

    const where: any = {}
    
    if (published === 'true') {
      where.published = true
    }
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (tag) {
      where.tags = {
        contains: tag
      }
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.blogPost.count({ where })

    // Parse tags from JSON string
    const postsWithParsedTags = posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
    }))

    return NextResponse.json({
      posts: postsWithParsedTags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Blog posts fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { tags, ...validatedData } = blogPostSchema.parse(body)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Un article avec ce slug existe déjà' },
        { status: 409 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        tags: JSON.stringify(tags),
        authorId: user.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Article créé avec succès',
      post: {
        ...post,
        tags: JSON.parse(post.tags || '[]'),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Blog post creation error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 