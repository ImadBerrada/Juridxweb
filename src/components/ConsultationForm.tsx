"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, Calendar } from "lucide-react";
import { consultationsApi, servicesApi, Service } from "@/lib/api";

const consultationSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceId: z.string().optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  preferredDate: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const selectedServiceId = watch("serviceId");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        if (response.data && response.data.services) {
          setServices(response.data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await consultationsApi.create(data);
      
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
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-gold mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Demande Envoyée!</h3>
          <p className="text-muted-foreground mb-4">
            Votre demande de consultation a été envoyée avec succès. Nous vous recontacterons dans les 24 heures pour planifier votre consultation.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)} 
            variant="outline" 
            className="btn-outline-gold"
          >
            Nouvelle Demande
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gold" />
          Demander une Consultation
        </CardTitle>
        <CardDescription>
          Planifiez une consultation personnalisée avec notre expert juridique. Remplissez le formulaire ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Jean"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Dupont"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="jean@entreprise.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Votre Entreprise"
            />
          </div>

          <div>
            <Label htmlFor="serviceId">Service Souhaité</Label>
            <Select onValueChange={(value) => setValue("serviceId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Consultation générale</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preferredDate">Date Préférée</Label>
            <Input
              id="preferredDate"
              type="datetime-local"
              {...register("preferredDate")}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optionnel - Nous vous contacterons pour confirmer la disponibilité
            </p>
          </div>
          
          <div>
            <Label htmlFor="description">Description de vos besoins *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Décrivez vos besoins juridiques, le contexte de votre projet, et les questions spécifiques que vous aimeriez aborder lors de la consultation..."
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
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
                Envoi en cours...
              </>
            ) : (
              "Demander une Consultation"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            En soumettant ce formulaire, vous acceptez d&apos;être contacté par notre équipe pour planifier votre consultation. 
            Toutes les informations partagées restent confidentielles.
          </p>
        </form>
      </CardContent>
    </Card>
  );
} 