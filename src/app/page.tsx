"use client";

import { motion } from "framer-motion";
import { 
  Scale, 
  Phone, 
  Mail, 
  MapPin,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                JuridX
                <span className="text-gradient block">Conseil Juridique</span>
                <span className="text-gradient block">International</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales, 
                structuration juridique multi-juridictionnelle, et accompagnement stratégique des 
                entreprises et investisseurs. Fondé par Abderrahman Adel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/consultation">
                  <Button size="lg" className="btn-gold">
                    Consultation Gratuite
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="btn-outline-gold">
                  Nos Services
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gold/20 to-gold-dark/20 rounded-2xl p-8 gold-glow">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">10+</div>
                    <div className="text-sm text-muted-foreground">Années d&apos;Expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">3</div>
                    <div className="text-sm text-muted-foreground">Diplômes Avancés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">Multi</div>
                    <div className="text-sm text-muted-foreground">Juridictionnel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">Londres</div>
                    <div className="text-sm text-muted-foreground">Université</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Pourquoi Choisir <span className="text-gradient">JuridX</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Abderrahman Adel, fondateur de JuridX, est un juriste international diplômé de l&apos;Université de Londres. 
                Avec plus de 10 ans d&apos;expérience académique et professionnelle, il incarne un profil rare à la croisée 
                du juridique, de la technologie et de la stratégie d&apos;entreprise.
              </p>
              <div className="space-y-4">
                {[
                  "LL.M. en droit international des affaires (Université de Londres)",
                  "MSc en Intelligence Artificielle & Data Science",
                  "Honours Bachelor of Engineering",
                  "Certificat d'études supérieures en relations internationales"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-gold" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gold/10 to-gold-dark/10 rounded-2xl p-8 border border-gold/20">
                <blockquote className="text-lg italic mb-4">
                  &ldquo;Abderrahman Adel et JuridX ont fourni un accompagnement exceptionnel lors de notre expansion internationale. 
                  Son expertise multi-juridictionnelle et sa vision technologique ont été déterminantes pour le succès de notre projet.&rdquo;
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-black-rich font-bold">MC</span>
                  </div>
                  <div>
                    <div className="font-semibold">Marie Dubois</div>
                    <div className="text-sm text-muted-foreground">CEO, TechGlobal Solutions</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Prenez <span className="text-gradient">Contact</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Prêt à discuter de vos besoins juridiques? Contactez-nous dès aujourd&apos;hui pour une consultation confidentielle.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-gold" />
                  <div>
                    <div className="font-semibold">Téléphone</div>
                    <div className="text-muted-foreground">+44 (0) 20 7123 4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-gold" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">contact@juridx.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-gold" />
                  <div>
                    <div className="font-semibold">Adresse</div>
                    <div className="text-muted-foreground">
                      London Business District<br />
                      Londres, Royaume-Uni
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ContactForm />
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
