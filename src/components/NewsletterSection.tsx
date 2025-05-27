"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { newsletterApi } from "@/lib/api";

const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  name: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await newsletterApi.subscribe(data.email, data.name);
      
      if (response.error) {
        setError(response.error);
      } else {
        setIsSubmitted(true);
        reset();
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Merci pour votre abonnement!</h3>
                <p className="text-muted-foreground mb-4">
                  Vous recevrez bientôt nos dernières actualités juridiques et conseils d&apos;experts.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline" 
                  className="btn-outline-gold"
                >
                  S&apos;abonner avec un autre email
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-secondary/50">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
              <CardTitle className="text-3xl">
                Restez <span className="text-gradient">Informé</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Recevez nos dernières actualités juridiques, analyses de marché et conseils d&apos;experts directement dans votre boîte mail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom (optionnel)</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="votre@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full btn-gold" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Abonnement en cours...
                    </>
                  ) : (
                    "S'abonner à la Newsletter"
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                En vous abonnant, vous acceptez de recevoir nos communications. 
                Vous pouvez vous désabonner à tout moment.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
} 