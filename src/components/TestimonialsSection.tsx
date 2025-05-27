"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialsApi, Testimonial } from "@/lib/api";

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

// Fallback testimonials data
const fallbackTestimonials = [
  {
    id: "1",
    name: "Sophie Laurent",
    role: "Directrice",
    company: "InvestEurope",
    content: "Conseil juridique exceptionnel qui nous a aidés à naviguer les exigences réglementaires complexes lors de notre expansion en Europe.",
    rating: 5,
    featured: true,
    status: "approved",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "2",
    name: "Ahmed Ben Ali",
    role: "Fondateur",
    company: "TechMENA",
    content: "L'expertise d'Abderrahman en structuration multi-juridictionnelle est inégalée. Il a livré des résultats au-delà de nos attentes.",
    rating: 5,
    featured: true,
    status: "approved",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "CEO",
    company: "DataFlow International",
    content: "Professionnel, réactif et incroyablement compétent. JuridX est notre partenaire juridique de référence pour tous nos projets internationaux.",
    rating: 5,
    featured: true,
    status: "approved",
    createdAt: "",
    updatedAt: ""
  }
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsApi.getAll();
        if (response.data && response.data.testimonials.length > 0) {
          // Only show approved testimonials on the public website
          const approvedTestimonials = response.data.testimonials.filter(t => t.status === 'approved');
          if (approvedTestimonials.length > 0) {
            setTestimonials(approvedTestimonials);
          }
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Keep fallback testimonials
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
    
    // Set up polling to refresh testimonials every 30 seconds for real-time updates
    const interval = setInterval(fetchTestimonials, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-16 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Témoignages <span className="text-gradient">Clients</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ce que nos clients disent de nos services juridiques
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.slice(0, 3).map((testimonial) => (
            <motion.div key={testimonial.id} variants={fadeInUp}>
              <Card className="card-hover bg-card border-border h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && `, ${testimonial.company}`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            <p className="mt-2 text-muted-foreground">Chargement des témoignages...</p>
          </div>
        )}
      </div>
    </section>
  );
} 