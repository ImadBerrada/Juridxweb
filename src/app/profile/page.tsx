"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  Edit, 
  Save, 
  X, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  Bell,
  Shield,
  History,
  Plus,
  Download,
  Filter,
  Search,
  Globe,
  Star,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { consultationsApi, servicesApi, blogApi, newsletterApi, usersApi, Consultation, Service, BlogPost } from "@/lib/api";
import Link from "next/link";

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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ConsultationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceId?: string;
  description: string;
  preferredDate?: string;
}

const statusOptions = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'SCHEDULED', label: 'Planifiée', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  { value: 'COMPLETED', label: 'Terminée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'CANCELLED', label: 'Annulée', color: 'bg-red-100 text-red-800', icon: X },
];

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [showConsultationDetail, setShowConsultationDetail] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const [consultationForm, setConsultationForm] = useState<ConsultationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceId: '',
    description: '',
    preferredDate: ''
  });

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch user consultations
      const consultationsResponse = await consultationsApi.getAll(1, 50);
      if (consultationsResponse.data) {
        setConsultations(consultationsResponse.data.consultations);
      }

      // Fetch services
      const servicesResponse = await servicesApi.getAll();
      if (servicesResponse.data) {
        setServices(servicesResponse.data.services);
      }

      // Fetch recent blog posts
      const blogResponse = await blogApi.getAll(1, 6, true);
      if (blogResponse.data) {
        setRecentPosts(blogResponse.data.posts);
      }

      // Set profile data from user context
      setProfile({
        id: user.id,
        name: user.name || '',
        email: user.email,
        phone: '',
        company: '',
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });

      setProfileForm({
        name: user.name || '',
        email: user.email,
        phone: '',
        company: ''
      });

      setConsultationForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        phone: '',
        company: '',
        serviceId: '',
        description: '',
        preferredDate: ''
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const handleProfileUpdate = async () => {
    if (!profile) return;

    try {
      const response = await usersApi.update(profile.id, {
        name: profileForm.name,
        email: profileForm.email
      });

      if (response.data) {
        setProfile(prev => prev ? { ...prev, ...profileForm } : null);
        setEditingProfile(false);
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    }
  };

  const handleNewConsultation = async () => {
    try {
      const response = await consultationsApi.create(consultationForm);
      
      if (response.data) {
        setConsultations([response.data.consultation, ...consultations]);
        setShowNewConsultation(false);
        setConsultationForm({
          firstName: user?.name?.split(' ')[0] || '',
          lastName: user?.name?.split(' ').slice(1).join(' ') || '',
          email: user?.email || '',
          phone: '',
          company: '',
          serviceId: '',
          description: '',
          preferredDate: ''
        });
        toast({
          title: "Consultation demandée",
          description: "Votre demande de consultation a été envoyée avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande de consultation.",
        variant: "destructive",
      });
    }
  };

  const handleNewsletterToggle = async (subscribed: boolean) => {
    try {
      if (subscribed) {
        await newsletterApi.subscribe(user?.email || '', user?.name);
      } else {
        await newsletterApi.unsubscribe(user?.email || '');
      }
      
      setNewsletterSubscribed(subscribed);
      toast({
        title: subscribed ? "Abonnement confirmé" : "Désabonnement confirmé",
        description: subscribed 
          ? "Vous recevrez nos dernières actualités juridiques."
          : "Vous ne recevrez plus nos newsletters.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier votre abonnement.",
        variant: "destructive",
      });
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = `${consultation.firstName} ${consultation.lastName} ${consultation.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    const IconComponent = statusOption?.icon || Clock;
    return (
      <Badge className={statusOption?.color || 'bg-gray-100 text-gray-800'}>
        <IconComponent className="h-3 w-3 mr-1" />
        {statusOption?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-gold" />
            <span className="text-lg font-medium">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Accès refusé</CardTitle>
              <CardDescription>
                Vous devez être connecté pour accéder à votre profil.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button className="btn-gold">
                  Retour à l'accueil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">Mon Profil</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Gérez votre profil, consultez vos demandes de consultation et restez informé 
              de nos dernières actualités juridiques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Consultations</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Paramètres</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                {/* Welcome Card */}
                <motion.div variants={fadeInUp}>
                  <Card className="bg-gradient-to-br from-gold/10 to-gold-dark/10 border-gold/20">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gold/20 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gold" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            Bienvenue, {profile?.name || user.email}
                          </h2>
                          <p className="text-muted-foreground">
                            Membre depuis {formatDate(profile?.createdAt || user.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div variants={fadeInUp}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium text-muted-foreground">Consultations</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {consultations.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {consultations.filter(c => c.status === 'PENDING').length} en attente
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium text-muted-foreground">Terminées</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {consultations.filter(c => c.status === 'COMPLETED').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Consultations réalisées
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-purple-500" />
                          <span className="text-sm font-medium text-muted-foreground">Articles</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {recentPosts.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Articles récents disponibles
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={fadeInUp}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Consultations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <History className="h-5 w-5 text-gold" />
                          <span>Consultations récentes</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {consultations.slice(0, 3).map((consultation) => (
                            <div key={consultation.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                              <div>
                                <p className="font-medium">{consultation.description.substring(0, 50)}...</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(consultation.createdAt)}
                                </p>
                              </div>
                              {getStatusBadge(consultation.status)}
                            </div>
                          ))}
                          {consultations.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">
                              Aucune consultation pour le moment
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <Button
                            onClick={() => setShowNewConsultation(true)}
                            className="w-full btn-gold"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle consultation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Blog Posts */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-gold" />
                          <span>Articles récents</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentPosts.slice(0, 3).map((post) => (
                            <div key={post.id} className="p-3 bg-secondary/50 rounded-lg">
                              <h4 className="font-medium mb-1">{post.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {post.excerpt || post.content.substring(0, 80) + '...'}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(post.createdAt)}
                                </span>
                                <Link href={`/blog/${post.slug}`}>
                                  <Button variant="outline" size="sm">
                                    Lire
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Link href="/blog">
                            <Button variant="outline" className="w-full">
                              Voir tous les articles
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-gold" />
                          <span>Informations personnelles</span>
                        </CardTitle>
                        <CardDescription>
                          Gérez vos informations de profil
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setEditingProfile(!editingProfile)}
                        variant="outline"
                      >
                        {editingProfile ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        {editingProfile ? (
                          <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 p-2 bg-secondary/50 rounded">{profile?.name || 'Non renseigné'}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        {editingProfile ? (
                          <Input
                            id="email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 p-2 bg-secondary/50 rounded">{profile?.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        {editingProfile ? (
                          <Input
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            className="mt-1"
                            placeholder="Votre numéro de téléphone"
                          />
                        ) : (
                          <p className="mt-1 p-2 bg-secondary/50 rounded">{profile?.phone || 'Non renseigné'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="company">Entreprise</Label>
                        {editingProfile ? (
                          <Input
                            id="company"
                            value={profileForm.company}
                            onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                            className="mt-1"
                            placeholder="Nom de votre entreprise"
                          />
                        ) : (
                          <p className="mt-1 p-2 bg-secondary/50 rounded">{profile?.company || 'Non renseigné'}</p>
                        )}
                      </div>

                      <div>
                        <Label>Rôle</Label>
                        <p className="mt-1 p-2 bg-secondary/50 rounded">
                          <Badge variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            {profile?.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                          </Badge>
                        </p>
                      </div>

                      <div>
                        <Label>Membre depuis</Label>
                        <p className="mt-1 p-2 bg-secondary/50 rounded">
                          {formatDate(profile?.createdAt || user.createdAt)}
                        </p>
                      </div>
                    </div>

                    {editingProfile && (
                      <div className="mt-6 flex justify-end space-x-2">
                        <Button
                          onClick={() => setEditingProfile(false)}
                          variant="outline"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handleProfileUpdate}
                          className="btn-gold"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Consultations Tab */}
            <TabsContent value="consultations">
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gold" />
                          <span>Mes consultations</span>
                        </CardTitle>
                        <CardDescription>
                          Gérez vos demandes de consultation
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowNewConsultation(true)}
                        className="btn-gold mt-4 lg:mt-0"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle consultation
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Rechercher dans vos consultations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full lg:w-48">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Consultations List */}
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gold" />
                          <p>Chargement de vos consultations...</p>
                        </div>
                      ) : filteredConsultations.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {consultations.length === 0 
                              ? "Vous n'avez pas encore de consultation."
                              : "Aucune consultation trouvée pour votre recherche."
                            }
                          </p>
                        </div>
                      ) : (
                        filteredConsultations.map((consultation) => (
                          <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {getStatusBadge(consultation.status)}
                                    {consultation.service && (
                                      <Badge variant="outline">
                                        {consultation.service.title}
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold mb-2">
                                    Consultation - {formatDate(consultation.createdAt)}
                                  </h3>
                                  <p className="text-muted-foreground mb-3">
                                    {consultation.description.length > 150 
                                      ? consultation.description.substring(0, 150) + '...'
                                      : consultation.description
                                    }
                                  </p>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    {consultation.preferredDate && (
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Date souhaitée: {formatDate(consultation.preferredDate)}
                                      </div>
                                    )}
                                    {consultation.phone && (
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        {consultation.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => {
                                    setSelectedConsultation(consultation);
                                    setShowConsultationDetail(true);
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gold" />
                      <span>Articles recommandés</span>
                    </CardTitle>
                    <CardDescription>
                      Découvrez nos derniers articles juridiques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recentPosts.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                              {post.featured && (
                                <Badge className="bg-gold/20 text-gold border-gold/30">
                                  <Star className="h-3 w-3 mr-1" />
                                  En vedette
                                </Badge>
                              )}
                              {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="font-semibold mb-2">{post.title}</h3>
                            <p className="text-muted-foreground mb-4">
                              {post.excerpt || post.content.substring(0, 120) + '...'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(post.createdAt)}
                              </span>
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="outline" size="sm">
                                  Lire l'article
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Link href="/blog">
                        <Button className="btn-gold">
                          Voir tous les articles
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-gold" />
                      <span>Paramètres de notification</span>
                    </CardTitle>
                    <CardDescription>
                      Gérez vos préférences de communication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newsletter">Newsletter juridique</Label>
                          <p className="text-sm text-muted-foreground">
                            Recevez nos derniers articles et actualités juridiques
                          </p>
                        </div>
                        <Switch
                          id="newsletter"
                          checked={newsletterSubscribed}
                          onCheckedChange={handleNewsletterToggle}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="consultation-updates">Mises à jour des consultations</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications sur l'état de vos consultations
                          </p>
                        </div>
                        <Switch
                          id="consultation-updates"
                          defaultChecked={true}
                          disabled
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketing">Communications marketing</Label>
                          <p className="text-sm text-muted-foreground">
                            Offres spéciales et nouveaux services
                          </p>
                        </div>
                        <Switch
                          id="marketing"
                          defaultChecked={false}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* New Consultation Modal */}
      <Dialog open={showNewConsultation} onOpenChange={setShowNewConsultation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle demande de consultation</DialogTitle>
            <DialogDescription>
              Remplissez ce formulaire pour demander une consultation juridique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={consultationForm.firstName}
                  onChange={(e) => setConsultationForm({...consultationForm, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={consultationForm.lastName}
                  onChange={(e) => setConsultationForm({...consultationForm, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={consultationForm.email}
                  onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                  id="phone"
                  value={consultationForm.phone}
                  onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Entreprise (optionnel)</Label>
                <Input
                  id="company"
                  value={consultationForm.company}
                  onChange={(e) => setConsultationForm({...consultationForm, company: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="service">Service</Label>
                <Select value={consultationForm.serviceId} onValueChange={(value) => setConsultationForm({...consultationForm, serviceId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="preferredDate">Date souhaitée (optionnel)</Label>
              <Input
                id="preferredDate"
                type="datetime-local"
                value={consultationForm.preferredDate}
                onChange={(e) => setConsultationForm({...consultationForm, preferredDate: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="description">Description de votre demande</Label>
              <Textarea
                id="description"
                value={consultationForm.description}
                onChange={(e) => setConsultationForm({...consultationForm, description: e.target.value})}
                placeholder="Décrivez votre situation juridique et vos besoins..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowNewConsultation(false)} 
              variant="outline"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleNewConsultation}
              className="btn-gold"
              disabled={!consultationForm.firstName || !consultationForm.lastName || !consultationForm.email || !consultationForm.description}
            >
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consultation Detail Modal */}
      <Dialog open={showConsultationDetail} onOpenChange={setShowConsultationDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la consultation</DialogTitle>
            <DialogDescription>
              Informations complètes de votre demande de consultation
            </DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getStatusBadge(selectedConsultation.status)}
                {selectedConsultation.service && (
                  <Badge variant="outline">
                    {selectedConsultation.service.title}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom complet</Label>
                  <p className="mt-1 p-2 bg-secondary/50 rounded">
                    {selectedConsultation.firstName} {selectedConsultation.lastName}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="mt-1 p-2 bg-secondary/50 rounded">
                    {selectedConsultation.email}
                  </p>
                </div>
              </div>

              {(selectedConsultation.phone || selectedConsultation.company) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedConsultation.phone && (
                    <div>
                      <Label>Téléphone</Label>
                      <p className="mt-1 p-2 bg-secondary/50 rounded">
                        {selectedConsultation.phone}
                      </p>
                    </div>
                  )}
                  {selectedConsultation.company && (
                    <div>
                      <Label>Entreprise</Label>
                      <p className="mt-1 p-2 bg-secondary/50 rounded">
                        {selectedConsultation.company}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedConsultation.preferredDate && (
                <div>
                  <Label>Date souhaitée</Label>
                  <p className="mt-1 p-2 bg-secondary/50 rounded">
                    {new Date(selectedConsultation.preferredDate).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}

              <div>
                <Label>Description</Label>
                <div className="mt-1 p-3 bg-secondary/50 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedConsultation.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label>Date de création</Label>
                  <p className="mt-1">{new Date(selectedConsultation.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <Label>Dernière modification</Label>
                  <p className="mt-1">{new Date(selectedConsultation.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowConsultationDetail(false)} variant="outline">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
} 