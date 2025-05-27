"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CheckSquare,
  Square,
  Star,
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
  Flag,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { servicesApi, Service } from "@/lib/api";

// Icon mapping for services
const iconOptions = [
  { value: 'Building2', label: 'Bâtiment', icon: Building2 },
  { value: 'Shield', label: 'Bouclier', icon: Shield },
  { value: 'Scale', label: 'Balance', icon: Scale },
  { value: 'Users', label: 'Utilisateurs', icon: Users },
  { value: 'Award', label: 'Récompense', icon: Award },
  { value: 'CheckCircle', label: 'Validation', icon: CheckCircle },
  { value: 'Brain', label: 'Cerveau', icon: Brain },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'DollarSign', label: 'Dollar', icon: DollarSign },
  { value: 'TrendingUp', label: 'Tendance', icon: TrendingUp },
  { value: 'Flag', label: 'Drapeau', icon: Flag },
  { value: 'Zap', label: 'Éclair', icon: Zap },
];

const iconMap: Record<string, any> = {
  Building2, Shield, Scale, Users, Award, CheckCircle,
  Brain, Globe, DollarSign, TrendingUp, Flag, Zap
};

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
}

export default function ServicesManager() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    icon: 'Building2',
    featured: false,
    order: 0
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.getAll();
      if (response.data && response.data.services) {
        setServices(response.data.services);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les services.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await servicesApi.create(formData);
      if (response.data) {
        setServices([...services, response.data.service]);
        setShowCreateModal(false);
        setFormData({ title: '', description: '', icon: 'Building2', featured: false, order: 0 });
        toast({
          title: "Service créé",
          description: "Le service a été créé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le service.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedService) return;
    
    try {
      const response = await servicesApi.update(selectedService.id, formData);
      if (response.data) {
        setServices(services.map(service => 
          service.id === selectedService.id ? response.data.service : service
        ));
        setShowEditModal(false);
        setSelectedService(null);
        toast({
          title: "Service modifié",
          description: "Le service a été modifié avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le service.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const response = await servicesApi.delete(serviceId);
      if (response.data) {
        setServices(services.filter(service => service.id !== serviceId));
        toast({
          title: "Service supprimé",
          description: "Le service a été supprimé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le service.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setServiceToDelete(null);
  };

  const handleBulkDelete = async () => {
    try {
      const promises = selectedServices.map(id => servicesApi.delete(id));
      await Promise.all(promises);
      
      setServices(services.filter(service => !selectedServices.includes(service.id)));
      setSelectedServices([]);
      toast({
        title: "Services supprimés",
        description: `${selectedServices.length} services ont été supprimés.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les services.",
        variant: "destructive",
      });
    }
  };

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedServices(
      selectedServices.length === services.length ? [] : services.map(s => s.id)
    );
  };

  const openCreateModal = () => {
    setFormData({ title: '', description: '', icon: 'Building2', featured: false, order: services.length });
    setShowCreateModal(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      featured: service.featured,
      order: service.order
    });
    setShowEditModal(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = featuredFilter === "all" || 
                           (featuredFilter === "featured" && service.featured) ||
                           (featuredFilter === "regular" && !service.featured);
    
    return matchesSearch && matchesFeatured;
  });

  const exportToCSV = () => {
    const headers = ['Titre', 'Description', 'Icône', 'Mis en avant', 'Ordre', 'Date création'];
    const csvData = filteredServices.map(service => [
      service.title,
      service.description,
      service.icon,
      service.featured ? 'Oui' : 'Non',
      service.order.toString(),
      new Date(service.createdAt).toLocaleDateString('fr-FR')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `services_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: "Export terminé",
      description: "Les données ont été exportées avec succès.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Activity className="h-5 w-5 text-[#D4AF37]" />
                <span>Gestion des Services</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gérez les services proposés par le cabinet
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                onClick={fetchServices}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </Button>
              <Button
                onClick={openCreateModal}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Service
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                <SelectItem value="featured">Mis en avant</SelectItem>
                <SelectItem value="regular">Réguliers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-400">Total</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {services.length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">Mis en avant</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {services.filter(s => s.featured).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-400">Réguliers</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {services.filter(s => !s.featured).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedServices.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4">
              <span className="text-sm font-medium text-white">
                {selectedServices.length} service(s) sélectionné(s)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4 text-left text-white">
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center text-white"
                      >
                        {selectedServices.length === services.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 text-left font-medium text-white">Service</th>
                    <th className="p-4 text-left font-medium text-white">Description</th>
                    <th className="p-4 text-left font-medium text-white">Statut</th>
                    <th className="p-4 text-left font-medium text-white">Ordre</th>
                    <th className="p-4 text-left font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                        <p className="text-white">Chargement des services...</p>
                      </td>
                    </tr>
                  ) : filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Aucun service trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => {
                      const IconComponent = iconMap[service.icon] || Building2;
                      return (
                        <tr key={service.id} className="border-t border-gray-700 hover:bg-gray-800">
                          <td className="p-4">
                            <button
                              onClick={() => toggleServiceSelection(service.id)}
                              className="flex items-center text-white"
                            >
                              {selectedServices.includes(service.id) ? (
                                <CheckSquare className="h-4 w-4 text-blue-400" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="h-8 w-8 text-[#D4AF37]" />
                              <div>
                                <p className="font-medium text-white">{service.title}</p>
                                <p className="text-sm text-gray-400">Icône: {service.icon}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-300 max-w-xs truncate">
                              {service.description}
                            </p>
                          </td>
                          <td className="p-4">
                            {service.featured ? (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Mis en avant
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-600 text-gray-400">
                                Régulier
                              </Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-400">{service.order}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowDetailModal(true);
                                }}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-white hover:bg-gray-800"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => openEditModal(service)}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-white hover:bg-gray-800"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  setServiceToDelete(service.id);
                                  setShowDeleteDialog(true);
                                }}
                                variant="outline"
                                size="sm"
                                className="text-red-400 border-red-400 hover:bg-red-900 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Détails du service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informations complètes du service
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {(() => {
                  const IconComponent = iconMap[selectedService.icon] || Building2;
                  return <IconComponent className="h-12 w-12 text-[#D4AF37]" />;
                })()}
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedService.title}</h3>
                  <p className="text-gray-400">Icône: {selectedService.icon}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Description</label>
                <div className="mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-white">{selectedService.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Statut</label>
                  <p className="text-white">
                    {selectedService.featured ? 'Mis en avant' : 'Régulier'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Ordre d'affichage</label>
                  <p className="text-white">{selectedService.order}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <label className="font-medium">Date de création</label>
                  <p>{new Date(selectedService.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="font-medium">Dernière modification</label>
                  <p>{new Date(selectedService.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailModal(false)} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Créer un nouveau service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajoutez un nouveau service au catalogue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-400">Titre du service</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Ex: Droit des Affaires International"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-400">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Description détaillée du service..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="icon" className="text-gray-400">Icône</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order" className="text-gray-400">Ordre d'affichage</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="bg-gray-800 border-gray-600 text-white"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked: boolean) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="featured" className="text-gray-400">Mettre en avant</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowCreateModal(false)} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreate}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez les informations du service
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-gray-400">Titre du service</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description" className="text-gray-400">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-icon" className="text-gray-400">Icône</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-order" className="text-gray-400">Ordre d'affichage</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="bg-gray-800 border-gray-600 text-white"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="edit-featured"
                  checked={formData.featured}
                  onCheckedChange={(checked: boolean) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="edit-featured" className="text-gray-400">Mettre en avant</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowEditModal(false)} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleEdit}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button
              onClick={() => serviceToDelete && handleDelete(serviceToDelete)}
              variant="destructive"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 