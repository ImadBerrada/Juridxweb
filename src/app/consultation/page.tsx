"use client";

import { motion } from "framer-motion";
import { Scale, Calendar, CheckCircle, Clock, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import ConsultationForm from "@/components/ConsultationForm";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">Consultation Juridique</span>
              <span className="block">Personnalisée</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bénéficiez de l&apos;expertise d&apos;Abderrahman Adel pour vos projets juridiques internationaux. 
              Une consultation sur mesure pour répondre à vos besoins spécifiques.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation Flexible</h3>
              <p className="text-muted-foreground">
                Planifiez votre consultation selon vos disponibilités. Présentiel ou visioconférence.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expertise Reconnue</h3>
              <p className="text-muted-foreground">
                Plus de 10 ans d&apos;expérience en droit international et stratégie d&apos;entreprise.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Solutions Concrètes</h3>
              <p className="text-muted-foreground">
                Conseils pratiques et stratégies adaptées à votre contexte juridique.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section className="py-16 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Planifiez Votre <span className="text-gradient">Consultation</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Remplissez le formulaire ci-contre pour demander une consultation personnalisée. 
                Nous vous recontacterons dans les 24 heures pour confirmer les détails.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gold font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Demande de Consultation</h3>
                    <p className="text-muted-foreground text-sm">
                      Remplissez le formulaire avec vos informations et besoins juridiques.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gold font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Confirmation & Planification</h3>
                    <p className="text-muted-foreground text-sm">
                      Notre équipe vous contacte pour confirmer les détails et planifier la consultation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gold font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Consultation Personnalisée</h3>
                    <p className="text-muted-foreground text-sm">
                      Rencontrez Abderrahman Adel pour discuter de vos besoins juridiques.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gold/10 border border-gold/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-5 w-5 text-gold" />
                  <h4 className="font-semibold">Première Consultation Gratuite</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Profitez d&apos;une première consultation de 30 minutes offerte pour évaluer 
                  vos besoins et discuter de nos services.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ConsultationForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-6 w-6 text-gold" />
                <span className="text-xl font-bold text-gradient">JuridX</span>
              </div>
              <p className="text-muted-foreground">
                Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales. 
                Fondé par Abderrahman Adel.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Droit des Affaires International</li>
                <li>Structuration Juridique</li>
                <li>Stratégie d&apos;Entreprise</li>
                <li>IA & Data Science</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cabinet</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>À Propos</li>
                <li>Abderrahman Adel</li>
                <li>Expertise</li>
                <li>Actualités</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>+44 (0) 20 7123 4567</li>
                <li>contact@juridx.com</li>
                <li>London Business District</li>
                <li>Londres, Royaume-Uni</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 JuridX - Abderrahman Adel. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 