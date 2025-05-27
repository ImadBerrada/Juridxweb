import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const contactSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  company: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactSchema.parse(body);
    
    // Save contact to database
    const contact = await prisma.contact.create({
      data: validatedData,
    });
    
    // Check if Resend is configured
    if (!resend) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { 
          message: 'Contact sauvegardé avec succès',
          contact: { id: contact.id },
          warning: 'Email service not configured'
        },
        { status: 200 }
      );
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'JuridX - Abderrahman Adel <noreply@juridx.com>',
      to: ['contact@juridx.com'],
      subject: `Nouvelle demande de contact de ${validatedData.firstName} ${validatedData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            Nouvelle Demande de Contact - JuridX
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Informations de Contact</h3>
            <p><strong>ID:</strong> ${contact.id}</p>
            <p><strong>Nom:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.company ? `<p><strong>Entreprise:</strong> ${validatedData.company}</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${validatedData.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #d4af37; color: #000; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: bold;">
              Veuillez répondre à cette demande dans les 24 heures pour un service client optimal.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { 
          message: 'Contact sauvegardé avec succès',
          contact: { id: contact.id },
          warning: 'Failed to send email notification'
        },
        { status: 200 }
      );
    }

    // Send confirmation email to the client
    await resend.emails.send({
      from: 'JuridX - Abderrahman Adel <noreply@juridx.com>',
      to: [validatedData.email],
      subject: 'Merci de votre contact - JuridX',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background-color: #0a0a0a; color: #f5f5f5;">
            <h1 style="color: #d4af37; margin: 0;">JuridX</h1>
            <p style="margin: 10px 0 0 0; color: #a1a1aa;">Cabinet de Conseil Juridique International</p>
          </div>
          
          <div style="padding: 30px; background-color: #fff; color: #333;">
            <h2 style="color: #d4af37; margin-top: 0;">Merci pour votre demande</h2>
            
            <p>Cher/Chère ${validatedData.firstName},</p>
            
            <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et apprécions votre intérêt pour nos services juridiques.</p>
            
            <p>Notre équipe examinera votre demande et vous répondra dans les 24 heures. En attendant, si vous avez des questions juridiques urgentes, n'hésitez pas à nous appeler au <strong>+44 (0) 20 7123 4567</strong>.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Résumé de votre message</h3>
              <p><strong>Référence:</strong> ${contact.id}</p>
              <p><strong>Nom:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              ${validatedData.company ? `<p><strong>Entreprise:</strong> ${validatedData.company}</p>` : ''}
              <p><strong>Message:</strong> ${validatedData.message}</p>
            </div>
            
            <p>Nous nous réjouissons de l'opportunité de vous accompagner dans vos besoins juridiques.</p>
            
            <p>Cordialement,<br>
            <strong>Abderrahman Adel<br>
            Fondateur - JuridX</strong></p>
          </div>
          
          <div style="padding: 20px; background-color: #0a0a0a; color: #a1a1aa; text-align: center;">
            <p style="margin: 0;">JuridX - Abderrahman Adel | London Business District, Londres, Royaume-Uni</p>
            <p style="margin: 5px 0 0 0;">Téléphone: +44 (0) 20 7123 4567 | Email: contact@juridx.com</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { 
        message: 'Email sent successfully', 
        contact: { id: contact.id },
        emailId: data?.id 
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where = status ? { status: status as any } : {};

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.contact.count({ where });

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Contacts fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 