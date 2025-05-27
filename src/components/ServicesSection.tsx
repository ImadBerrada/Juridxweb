"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Shield, 
  Scale, 
  Users, 
  Award, 
  CheckCircle,
  Brain,
  Globe,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { servicesApi, Service } from "@/lib/api";

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

// Icon mapping for services
const iconMap: Record<string, any> = {
  Building2,
  Shield,
  Scale,
  Users,
  Award,
  CheckCircle,
  Brain,
  Globe,
  DollarSign,
  TrendingUp,
  Building: Building2,
};

// Fallback services data
const fallbackServices = [
  {
    id: "1",
    title: "Droit des Affaires International",
    description: "Conseil juridique complet pour les entreprises opérant à l'international, structuration multi-juridictionnelle.",
    icon: "Building2",
    featured: true,
    order: 1,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "2",
    title: "Structuration Juridique",
    description: "Optimisation des structures juridiques et fiscales pour les investisseurs et entreprises internationales.",
    icon: "Shield",
    featured: true,
    order: 2,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "3",
    title: "Stratégie d'Entreprise",
    description: "Accompagnement stratégique alliant expertise juridique et vision technologique pour vos projets.",
    icon: "TrendingUp",
    featured: true,
    order: 3,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "4",
    title: "Intelligence Artificielle & Data",
    description: "Conseil spécialisé en IA et science des données, réglementation technologique et protection des données.",
    icon: "Brain",
    featured: false,
    order: 4,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "5",
    title: "Relations Internationales",
    description: "Expertise en relations internationales et négociations complexes multi-juridictionnelles.",
    icon: "Globe",
    featured: false,
    order: 5,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "6",
    title: "Accompagnement Investisseurs",
    description: "Conseil juridique et stratégique pour investisseurs dans leurs projets internationaux.",
    icon: "DollarSign",
    featured: false,
    order: 6,
    createdAt: "",
    updatedAt: ""
  }
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        if (response.data && response.data.services.length > 0) {
          setServices(response.data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Keep fallback services
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
    
    // Set up polling to refresh services every 30 seconds for real-time updates
    const interval = setInterval(fetchServices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="services" className="py-16 px-6">
      <div className="container mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
            Nos <span className="text-gradient">Services Juridiques</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solutions juridiques internationales adaptées à vos besoins d&apos;entreprise
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Building2;
            
            return (
              <motion.div key={service.id} variants={fadeInUp}>
                <Card className="card-hover bg-card border-border h-full">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-gold mb-4" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            <p className="mt-2 text-muted-foreground">Chargement des services...</p>
          </div>
        )}
      </div>
    </section>
  );
} 