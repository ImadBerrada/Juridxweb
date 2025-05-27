"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  Clock,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CheckSquare,
  Square,
  X,
  User,
  Building,
  MessageSquare,
  Calendar,
  Award
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
import { testimonialsApi, Testimonial } from "@/lib/api";

interface TestimonialFormData {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  featured: boolean;
  status: string;
}

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'approved', label: 'Approuvé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'rejected', label: 'Rejeté', color: 'bg-red-100 text-red-800', icon: X },
];

export default function TestimonialsManager() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    featured: false,
    status: 'pending'
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsApi.getAll();
      if (response.data && response.data.testimonials) {
        setTestimonials(response.data.testimonials);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await testimonialsApi.create(formData);
      if (response.data && response.data.testimonial) {
        setTestimonials([...testimonials, response.data.testimonial]);
        setShowCreateModal(false);
        setFormData({ name: '', role: '', company: '', content: '', rating: 5, featured: false, status: 'pending' });
        toast({
          title: "Témoignage créé",
          description: "Le témoignage a été créé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le témoignage.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedTestimonial) return;
    
    try {
      const response = await testimonialsApi.update(selectedTestimonial.id, formData);
      if (response.data && response.data.testimonial) {
        setTestimonials(testimonials.map(testimonial => 
          testimonial.id === selectedTestimonial.id ? response.data!.testimonial : testimonial
        ));
        setShowEditModal(false);
        setSelectedTestimonial(null);
        toast({
          title: "Témoignage modifié",
          description: "Le témoignage a été modifié avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le témoignage.",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (testimonialId: string, status: string) => {
    try {
      const response = await testimonialsApi.updateStatus(testimonialId, status);
      if (response.data) {
        setTestimonials(testimonials.map(testimonial => 
          testimonial.id === testimonialId ? { ...testimonial, status } : testimonial
        ));
        
        const statusLabel = statusOptions.find(s => s.value === status)?.label || status;
        const testimonial = testimonials.find(t => t.id === testimonialId);
        const clientName = testimonial ? testimonial.name : 'Client';
        
        toast({
          title: "Statut mis à jour",
          description: `${clientName}: ${statusLabel}`,
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (testimonialId: string) => {
    try {
      const response = await testimonialsApi.delete(testimonialId);
      if (response.data) {
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== testimonialId));
        toast({
          title: "Témoignage supprimé",
          description: "Le témoignage a été supprimé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le témoignage.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setTestimonialToDelete(null);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      const promises = selectedTestimonials.map(id => testimonialsApi.updateStatus(id, newStatus));
      await Promise.all(promises);
      
      setTestimonials(testimonials.map(testimonial => 
        selectedTestimonials.includes(testimonial.id)
          ? { ...testimonial, status: newStatus }
          : testimonial
      ));
      
      setSelectedTestimonials([]);
      const statusLabel = statusOptions.find(s => s.value === newStatus)?.label || newStatus;
      toast({
        title: "Statuts mis à jour",
        description: `${selectedTestimonials.length} témoignages ont été ${statusLabel.toLowerCase()}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les statuts.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const promises = selectedTestimonials.map(id => testimonialsApi.delete(id));
      await Promise.all(promises);
      
      setTestimonials(testimonials.filter(testimonial => !selectedTestimonials.includes(testimonial.id)));
      setSelectedTestimonials([]);
      toast({
        title: "Témoignages supprimés",
        description: `${selectedTestimonials.length} témoignages ont été supprimés.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les témoignages.",
        variant: "destructive",
      });
    }
  };

  const toggleTestimonialSelection = (testimonialId: string) => {
    setSelectedTestimonials(prev => 
      prev.includes(testimonialId)
        ? prev.filter(id => id !== testimonialId)
        : [...prev, testimonialId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTestimonials(
      selectedTestimonials.length === testimonials.length ? [] : testimonials.map(t => t.id)
    );
  };

  const openCreateModal = () => {
    setFormData({ name: '', role: '', company: '', content: '', rating: 5, featured: false, status: 'pending' });
    setShowCreateModal(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      status: testimonial.status
    });
    setShowEditModal(true);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (testimonial.company && testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || testimonial.status === statusFilter;
    const matchesRating = ratingFilter === "all" || testimonial.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
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

  const exportToCSV = () => {
    const headers = ['Nom', 'Rôle', 'Entreprise', 'Contenu', 'Note', 'Statut', 'Mis en avant', 'Date création'];
    const csvData = filteredTestimonials.map(testimonial => [
      testimonial.name,
      testimonial.role,
      testimonial.company || '',
      testimonial.content,
      testimonial.rating.toString(),
      testimonial.status,
      testimonial.featured ? 'Oui' : 'Non',
      new Date(testimonial.createdAt).toLocaleDateString('fr-FR')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `testimonials_${new Date().toISOString().split('T')[0]}.csv`;
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
                <Star className="h-5 w-5 text-[#D4AF37]" />
                <span>Gestion des Témoignages</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gérez les témoignages clients et leur publication
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                onClick={fetchTestimonials}
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
                Nouveau Témoignage
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
                placeholder="Rechercher par nom, entreprise ou contenu..."
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
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filtrer par note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les notes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles</SelectItem>
                <SelectItem value="3">3 étoiles</SelectItem>
                <SelectItem value="2">2 étoiles</SelectItem>
                <SelectItem value="1">1 étoile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-400">Total</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {testimonials.length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">En attente</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {testimonials.filter(t => t.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-400">Approuvés</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {testimonials.filter(t => t.status === 'approved').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-400">Mis en avant</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {testimonials.filter(t => t.featured).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedTestimonials.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4">
              <span className="text-sm font-medium text-white">
                {selectedTestimonials.length} témoignage(s) sélectionné(s)
              </span>
              <div className="flex items-center space-x-2">
                <Select onValueChange={handleBulkStatusChange}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Changer statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          {/* Testimonials Table */}
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
                        {selectedTestimonials.length === testimonials.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 text-left font-medium text-white">Client</th>
                    <th className="p-4 text-left font-medium text-white">Contenu</th>
                    <th className="p-4 text-left font-medium text-white">Note</th>
                    <th className="p-4 text-left font-medium text-white">Statut</th>
                    <th className="p-4 text-left font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                        <p className="text-white">Chargement des témoignages...</p>
                      </td>
                    </tr>
                  ) : filteredTestimonials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Aucun témoignage trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredTestimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="p-4">
                          <button
                            onClick={() => toggleTestimonialSelection(testimonial.id)}
                            className="flex items-center text-white"
                          >
                            {selectedTestimonials.includes(testimonial.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">{testimonial.name}</p>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                            {testimonial.company && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Building className="h-3 w-3 mr-1" />
                                {testimonial.company}
                              </div>
                            )}
                            {testimonial.featured && (
                              <Badge variant="outline" className="mt-1 border-yellow-500 text-yellow-500">
                                <Award className="h-3 w-3 mr-1" />
                                Mis en avant
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-300 max-w-xs truncate">
                            "{testimonial.content}"
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating ? "text-[#D4AF37] fill-current" : "text-gray-600"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-400">
                              {testimonial.rating}/5
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Select
                            value={testimonial.status}
                            onValueChange={(value) => handleStatusUpdate(testimonial.id, value)}
                          >
                            <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  {(() => {
                                    const statusOption = statusOptions.find(option => option.value === testimonial.status);
                                    const IconComponent = statusOption?.icon || Clock;
                                    return (
                                      <>
                                        <IconComponent className="h-3 w-3" />
                                        <span className="text-xs">{statusOption?.label || testimonial.status}</span>
                                      </>
                                    );
                                  })()}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                                  <div className="flex items-center space-x-2">
                                    <option.icon className="h-4 w-4" />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedTestimonial(testimonial);
                                setShowDetailModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => openEditModal(testimonial)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setTestimonialToDelete(testimonial.id);
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
                    ))
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
            <DialogTitle className="text-white">Détails du témoignage</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informations complètes du témoignage client
            </DialogDescription>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedTestimonial.name}</h3>
                  <p className="text-gray-400">{selectedTestimonial.role}</p>
                  {selectedTestimonial.company && (
                    <p className="text-gray-400">{selectedTestimonial.company}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400">Note</label>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < selectedTestimonial.rating ? "text-[#D4AF37] fill-current" : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-white">{selectedTestimonial.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400">Contenu du témoignage</label>
                <div className="mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-white italic">"{selectedTestimonial.content}"</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTestimonial.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Mis en avant</label>
                  <p className="text-white mt-1">
                    {selectedTestimonial.featured ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <label className="font-medium">Date de création</label>
                  <p>{new Date(selectedTestimonial.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="font-medium">Dernière modification</label>
                  <p>{new Date(selectedTestimonial.updatedAt).toLocaleString('fr-FR')}</p>
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
            <DialogTitle className="text-white">Créer un nouveau témoignage</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajoutez un nouveau témoignage client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-400">Nom du client</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Ex: Marie Dubois"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-gray-400">Rôle/Poste</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Ex: CEO"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="company" className="text-gray-400">Entreprise (optionnel)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Ex: TechGlobal Solutions"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-400">Contenu du témoignage</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Le témoignage du client..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating" className="text-gray-400">Note (1-5)</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <SelectItem key={rating} value={rating.toString()} className="text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <span>{rating}</span>
                          <div className="flex">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-[#D4AF37] fill-current" />
                            ))}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-gray-400">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {statusOptions.map(option => (
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
            <DialogTitle className="text-white">Modifier le témoignage</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez les informations du témoignage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-gray-400">Nom du client</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-role" className="text-gray-400">Rôle/Poste</Label>
                <Input
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-company" className="text-gray-400">Entreprise</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-content" className="text-gray-400">Contenu du témoignage</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-rating" className="text-gray-400">Note (1-5)</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <SelectItem key={rating} value={rating.toString()} className="text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <span>{rating}</span>
                          <div className="flex">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-[#D4AF37] fill-current" />
                            ))}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-gray-400">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {statusOptions.map(option => (
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
              Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.
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
              onClick={() => testimonialToDelete && handleDelete(testimonialToDelete)}
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