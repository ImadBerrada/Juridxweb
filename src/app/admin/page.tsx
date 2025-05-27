"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  Mail, 
  FileText,
  TrendingUp,
  Activity,
  Settings,
  BarChart3,
  Shield,
  Database,
  PieChart as RechartsPieChart,
  RefreshCw,
  Download,
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import ContactsManager from "@/components/admin/ContactsManager";
import ConsultationsManager from "@/components/admin/ConsultationsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import UsersManager from "@/components/admin/UsersManager";
import NewsletterManager from "@/components/admin/NewsletterManager";
import BlogManager from "@/components/admin/BlogManager";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Cell, Pie } from 'recharts'

interface DashboardData {
  statistics: {
    contacts: { total: number; pending: number };
    consultations: { total: number; pending: number };
    users: { total: number };
    testimonials: { total: number; pending: number };
    newsletter: { subscribers: number };
    blog: { total: number; published: number };
  };
  recentActivity: {
    contacts: any[];
    consultations: any[];
  };
  monthlyStats: Array<{
    month: string;
    contacts: number;
    consultations: number;
  }>;
}

const COLORS = ['#D4AF37', '#B8860B', '#DAA520', '#FFD700', '#F4E4BC'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      const response = await adminApi.getDashboard();
      if (response.data) {
        setData(response.data);
        if (showRefreshToast) {
          toast({
            title: "Données actualisées",
            description: "Le tableau de bord a été mis à jour avec succès.",
            variant: "success",
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const exportData = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation...",
      variant: "default",
    });
    // TODO: Implement actual export functionality
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être administrateur pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#D4AF37]" />
          <span className="text-lg font-medium text-white">Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  const pieData = data ? [
    { name: 'Contacts en attente', value: data.statistics.contacts.pending, color: COLORS[0] },
    { name: 'Consultations en attente', value: data.statistics.consultations.pending, color: COLORS[1] },
    { name: 'Témoignages en attente', value: data.statistics.testimonials.pending, color: COLORS[2] },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Tableau de bord administrateur
            </h1>
            <p className="text-gray-300">
              Bienvenue, {user.name}. Gérez votre plateforme juridique.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Consultations</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Témoignages</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-shadow cursor-pointer" onClick={() => setActiveTab("contacts")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Contacts</CardTitle>
                    <MessageSquare className="h-4 w-4 text-[#D4AF37]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{data?.statistics.contacts.total || 0}</div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Badge variant="secondary" className="text-xs bg-[#D4AF37] text-black">
                        {data?.statistics.contacts.pending || 0} en attente
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-shadow cursor-pointer" onClick={() => setActiveTab("consultations")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Consultations</CardTitle>
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{data?.statistics.consultations.total || 0}</div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Badge variant="secondary" className="text-xs bg-[#D4AF37] text-black">
                        {data?.statistics.consultations.pending || 0} en attente
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-shadow cursor-pointer" onClick={() => setActiveTab("users")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Utilisateurs</CardTitle>
                    <Users className="h-4 w-4 text-[#D4AF37]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{data?.statistics.users.total || 0}</div>
                    <p className="text-xs text-gray-400">
                      Comptes enregistrés
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-shadow cursor-pointer" onClick={() => setActiveTab("newsletter")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Newsletter</CardTitle>
                    <Mail className="h-4 w-4 text-[#D4AF37]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{data?.statistics.newsletter.subscribers || 0}</div>
                    <p className="text-xs text-gray-400">
                      Abonnés actifs
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-shadow cursor-pointer" onClick={() => setActiveTab("blog")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Blog</CardTitle>
                    <FileText className="h-4 w-4 text-[#D4AF37]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{data?.statistics.blog.total || 0}</div>
                    <p className="text-xs text-gray-400">
                      {data?.statistics.blog.published || 0} publiés
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                    <span>Tendances mensuelles</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Évolution des contacts et consultations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data?.monthlyStats || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="contacts" 
                        stroke="#D4AF37" 
                        strokeWidth={2}
                        name="Contacts"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="consultations" 
                        stroke="#B8860B" 
                        strokeWidth={2}
                        name="Consultations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pending Items Distribution */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <RechartsPieChart className="h-5 w-5 text-[#D4AF37]" />
                    <span>Éléments en attente</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Répartition des tâches à traiter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="h-5 w-5 text-[#D4AF37]" />
                  <span>Activité récente</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Derniers contacts et consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-white">Derniers contacts</h4>
                    <div className="space-y-2">
                      {data?.recentActivity.contacts.slice(0, 5).map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                          <div>
                            <p className="font-medium text-sm text-white">{contact.firstName} {contact.lastName}</p>
                            <p className="text-xs text-gray-400">{contact.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs border-[#D4AF37] text-[#D4AF37]">
                            {contact.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-white">Dernières consultations</h4>
                    <div className="space-y-2">
                      {data?.recentActivity.consultations.slice(0, 5).map((consultation) => (
                        <div key={consultation.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                          <div>
                            <p className="font-medium text-sm text-white">{consultation.firstName} {consultation.lastName}</p>
                            <p className="text-xs text-gray-400">{consultation.service?.title || 'Service général'}</p>
                          </div>
                          <Badge variant="outline" className="text-xs border-[#D4AF37] text-[#D4AF37]">
                            {consultation.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsManager />
          </TabsContent>

          <TabsContent value="consultations">
            <ConsultationsManager />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterManager />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
} 