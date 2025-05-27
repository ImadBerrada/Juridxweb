"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building,
  User,
  FileText,
  Check,
  X,
  CheckSquare,
  Square,
  RefreshCw,
  AlertTriangle,
  Star,
  MessageSquare,
  CalendarPlus,
  Edit3,
  Send,
  Archive,
  UserCheck,
  Zap,
  Flag
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consultationsApi, servicesApi } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Consultation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceId?: string;
  service?: {
    id: string;
    title: string;
  };
  description: string;
  preferredDate?: string;
  status: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  assignedTo?: string;
  scheduledDate?: string;
  estimatedDuration?: number;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
}

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'scheduled', label: 'Planifiée', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  { value: 'in_progress', label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: Zap },
  { value: 'completed', label: 'Terminée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800', icon: X },
  { value: 'rescheduled', label: 'Reportée', color: 'bg-orange-100 text-orange-800', icon: CalendarPlus },
  { value: 'follow_up', label: 'Suivi requis', color: 'bg-indigo-100 text-indigo-800', icon: MessageSquare },
];

const priorityOptions = [
  { value: 'low', label: 'Faible', color: 'bg-gray-100 text-gray-800', icon: Flag },
  { value: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-800', icon: Flag },
  { value: 'high', label: 'Élevée', color: 'bg-orange-100 text-orange-800', icon: Flag },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
];

export default function ConsultationsManager() {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedConsultations, setSelectedConsultations] = useState<string[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null);
  const [consultationToSchedule, setConsultationToSchedule] = useState<Consultation | null>(null);
  const [consultationForNotes, setConsultationForNotes] = useState<Consultation | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: '',
    estimatedDuration: 60,
    notes: ''
  });
  const [notesForm, setNotesForm] = useState({
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    followUpDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchConsultations = async (page = 1, status = statusFilter) => {
    try {
      setLoading(true);
      const response = await consultationsApi.getAll(page, pagination.limit, status === "all" ? undefined : status || undefined);
      if (response.data) {
        // Ensure all consultations have a status (default to 'pending' if undefined)
        const consultationsWithStatus = response.data.consultations.map(consultation => ({
          ...consultation,
          status: consultation.status || 'pending'
        }));
        setConsultations(consultationsWithStatus);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les consultations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll();
      if (response.data) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchConsultations();
    fetchServices();
  }, [statusFilter]);

  const handleStatusChange = async (consultationId: string, newStatus: string) => {
    try {
      const response = await consultationsApi.updateStatus(consultationId, newStatus);
      if (response.data) {
        setConsultations(consultations.map(consultation => 
          consultation.id === consultationId 
            ? { ...consultation, status: newStatus }
            : consultation
        ));
        
        const statusLabel = statusOptions.find(s => s.value === newStatus)?.label || newStatus;
        const consultation = consultations.find(c => c.id === consultationId);
        const clientName = consultation ? `${consultation.firstName} ${consultation.lastName}` : 'Client';
        const oldStatus = consultation?.status;
        
        // Provide appropriate feedback based on whether this was an initial status or a change
        const description = !oldStatus 
          ? `${clientName}: Statut défini sur "${statusLabel}"`
          : `${clientName}: ${statusLabel.toLowerCase()}`;
        
        toast({
          title: "Statut mis à jour",
          description,
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

  const handlePriorityChange = async (consultationId: string, newPriority: string) => {
    try {
      // This would need to be implemented in the API
      setConsultations(consultations.map(consultation => 
        consultation.id === consultationId 
          ? { ...consultation, priority: newPriority as any }
          : consultation
      ));
      
      const priorityLabel = priorityOptions.find(p => p.value === newPriority)?.label || newPriority;
      const consultation = consultations.find(c => c.id === consultationId);
      const clientName = consultation ? `${consultation.firstName} ${consultation.lastName}` : 'Client';
      
      toast({
        title: "Priorité mise à jour",
        description: `${clientName}: Priorité ${priorityLabel.toLowerCase()}`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la priorité.",
        variant: "destructive",
      });
    }
  };

  // Quick status change helper
  const quickStatusChange = (consultationId: string, newStatus: string) => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) return;

    // Handle undefined or empty status - default to 'pending'
    const currentStatus = consultation.status || 'pending';

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'pending': ['scheduled', 'cancelled'],
      'scheduled': ['in_progress', 'completed', 'cancelled', 'rescheduled'],
      'in_progress': ['completed', 'rescheduled'],
      'completed': ['follow_up'],
      'cancelled': ['pending', 'scheduled'],
      'rescheduled': ['scheduled', 'cancelled'],
      'follow_up': ['completed', 'scheduled']
    };

    const allowedTransitions = validTransitions[currentStatus] || Object.keys(validTransitions);
    
    // Allow any transition if current status is undefined/empty or if it's the same status
    if (!consultation.status || allowedTransitions.includes(newStatus) || currentStatus === newStatus) {
      handleStatusChange(consultationId, newStatus);
    } else {
      const currentStatusLabel = statusOptions.find(s => s.value === currentStatus)?.label || currentStatus;
      const newStatusLabel = statusOptions.find(s => s.value === newStatus)?.label || newStatus;
      
      toast({
        title: "Transition non autorisée",
        description: `Impossible de passer de "${currentStatusLabel}" à "${newStatusLabel}"`,
        variant: "destructive",
      });
    }
  };

  const handleScheduleConsultation = async () => {
    if (!consultationToSchedule) return;
    
    try {
      // This would need to be implemented in the API
      setConsultations(consultations.map(consultation => 
        consultation.id === consultationToSchedule.id 
          ? { 
              ...consultation, 
              status: 'scheduled',
              scheduledDate: scheduleForm.scheduledDate,
              estimatedDuration: scheduleForm.estimatedDuration,
              notes: scheduleForm.notes
            }
          : consultation
      ));
      
      toast({
        title: "Consultation planifiée",
        description: "La consultation a été planifiée avec succès.",
        variant: "success",
      });
      
      setShowScheduleModal(false);
      setConsultationToSchedule(null);
      setScheduleForm({ scheduledDate: '', estimatedDuration: 60, notes: '' });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de planifier la consultation.",
        variant: "destructive",
      });
    }
  };

  const handleAddNotes = async () => {
    if (!consultationForNotes) return;
    
    try {
      // This would need to be implemented in the API
      setConsultations(consultations.map(consultation => 
        consultation.id === consultationForNotes.id 
          ? { 
              ...consultation, 
              notes: notesForm.notes,
              priority: notesForm.priority,
              followUpDate: notesForm.followUpDate || undefined
            }
          : consultation
      ));
      
      toast({
        title: "Notes ajoutées",
        description: "Les notes ont été ajoutées avec succès.",
        variant: "success",
      });
      
      setShowNotesModal(false);
      setConsultationForNotes(null);
      setNotesForm({ notes: '', priority: 'medium', followUpDate: '' });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les notes.",
        variant: "destructive",
      });
    }
  };

  const handleAccept = async (consultationId: string) => {
    await handleStatusChange(consultationId, 'scheduled');
  };

  const handleDecline = async (consultationId: string) => {
    await handleStatusChange(consultationId, 'cancelled');
  };

  const handleDelete = async (consultationId: string) => {
    try {
      const response = await consultationsApi.delete(consultationId);
      if (response.data) {
        setConsultations(consultations.filter(consultation => consultation.id !== consultationId));
        toast({
          title: "Consultation supprimée",
          description: "La consultation a été supprimée avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la consultation.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setConsultationToDelete(null);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      const promises = selectedConsultations.map(id => consultationsApi.updateStatus(id, newStatus));
      await Promise.all(promises);
      
      setConsultations(consultations.map(consultation => 
        selectedConsultations.includes(consultation.id)
          ? { ...consultation, status: newStatus }
          : consultation
      ));
      
      setSelectedConsultations([]);
      const statusLabel = statusOptions.find(s => s.value === newStatus)?.label || newStatus;
      toast({
        title: "Statuts mis à jour",
        description: `${selectedConsultations.length} consultations ont été ${statusLabel.toLowerCase()}.`,
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
      const promises = selectedConsultations.map(id => consultationsApi.delete(id));
      await Promise.all(promises);
      
      setConsultations(consultations.filter(consultation => !selectedConsultations.includes(consultation.id)));
      setSelectedConsultations([]);
      toast({
        title: "Consultations supprimées",
        description: `${selectedConsultations.length} consultations ont été supprimées.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les consultations.",
        variant: "destructive",
      });
    }
  };

  const toggleConsultationSelection = (consultationId: string) => {
    setSelectedConsultations(prev => 
      prev.includes(consultationId)
        ? prev.filter(id => id !== consultationId)
        : [...prev, consultationId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedConsultations(
      selectedConsultations.length === consultations.length ? [] : consultations.map(c => c.id)
    );
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = `${consultation.firstName} ${consultation.lastName} ${consultation.email} ${consultation.company || ''} ${consultation.service?.title || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesService = serviceFilter === "all" || !serviceFilter || consultation.serviceId === serviceFilter;
    const matchesPriority = priorityFilter === "all" || !priorityFilter || consultation.priority === priorityFilter;
    
    return matchesSearch && matchesService && matchesPriority;
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

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const priorityOption = priorityOptions.find(option => option.value === priority);
    const IconComponent = priorityOption?.icon || Flag;
    return (
      <Badge className={priorityOption?.color || 'bg-gray-100 text-gray-800'} variant="outline">
        <IconComponent className="h-3 w-3 mr-1" />
        {priorityOption?.label || priority}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Entreprise', 'Service', 'Statut', 'Priorité', 'Date création'];
    const csvData = filteredConsultations.map(consultation => [
      `${consultation.firstName} ${consultation.lastName}`,
      consultation.email,
      consultation.phone || '',
      consultation.company || '',
      consultation.service?.title || '',
      consultation.status,
      consultation.priority || '',
      new Date(consultation.createdAt).toLocaleDateString('fr-FR')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `consultations_${new Date().toISOString().split('T')[0]}.csv`;
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
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <span>Gestion des Consultations</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gérez les demandes de consultation et leur planification
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                onClick={() => fetchConsultations(pagination.page)}
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email, entreprise ou service..."
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
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filtrer par service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">Toutes les priorités</SelectItem>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">En attente</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredConsultations.filter(c => c.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-400">Planifiées</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredConsultations.filter(c => c.status === 'scheduled').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-400">Urgentes</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredConsultations.filter(c => c.priority === 'urgent').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-400">Terminées</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredConsultations.filter(c => c.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedConsultations.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4">
              <span className="text-sm font-medium text-white">
                {selectedConsultations.length} consultation(s) sélectionnée(s)
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

          {/* Consultations Table */}
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
                        {selectedConsultations.length === consultations.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 text-left font-medium text-white">Client</th>
                    <th className="p-4 text-left font-medium text-white">Service</th>
                    <th className="p-4 text-left font-medium text-white">Date souhaitée</th>
                    <th className="p-4 text-left font-medium text-white">Statut</th>
                    <th className="p-4 text-left font-medium text-white">Priorité</th>
                    <th className="p-4 text-left font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                        <p className="text-white">Chargement des consultations...</p>
                      </td>
                    </tr>
                  ) : filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        Aucune consultation trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <tr key={consultation.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="p-4">
                          <button
                            onClick={() => toggleConsultationSelection(consultation.id)}
                            className="flex items-center text-white"
                          >
                            {selectedConsultations.includes(consultation.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">
                              {consultation.firstName} {consultation.lastName}
                            </p>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {consultation.email}
                            </div>
                            {consultation.phone && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 mr-1" />
                                {consultation.phone}
                              </div>
                            )}
                            {consultation.company && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Building className="h-3 w-3 mr-1" />
                                {consultation.company}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-white">
                            {consultation.service?.title || 'Service général'}
                          </span>
                        </td>
                        <td className="p-4">
                          {consultation.preferredDate ? (
                            <div className="flex items-center text-sm text-gray-400">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              {new Date(consultation.preferredDate).toLocaleString('fr-FR')}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Non spécifiée</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Select
                            value={consultation.status}
                            onValueChange={(value) => quickStatusChange(consultation.id, value)}
                          >
                            <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  {(() => {
                                    const statusOption = statusOptions.find(option => option.value === consultation.status);
                                    const IconComponent = statusOption?.icon || Clock;
                                    return (
                                      <>
                                        <IconComponent className="h-3 w-3" />
                                        <span className="text-xs">{statusOption?.label || consultation.status}</span>
                                      </>
                                    );
                                  })()}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {statusOptions.map(option => {
                                // Show only valid transitions
                                const currentStatus = consultation.status;
                                const validTransitions: Record<string, string[]> = {
                                  'pending': ['pending', 'scheduled', 'cancelled'],
                                  'scheduled': ['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
                                  'in_progress': ['in_progress', 'completed', 'rescheduled'],
                                  'completed': ['completed', 'follow_up'],
                                  'cancelled': ['cancelled', 'pending', 'scheduled'],
                                  'rescheduled': ['rescheduled', 'scheduled', 'cancelled'],
                                  'follow_up': ['follow_up', 'completed', 'scheduled']
                                };
                                
                                const allowedTransitions = validTransitions[currentStatus] || statusOptions.map(s => s.value);
                                const isDisabled = !allowedTransitions.includes(option.value);
                                
                                return (
                                  <SelectItem 
                                    key={option.value} 
                                    value={option.value} 
                                    className={`text-white hover:bg-gray-700 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isDisabled}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <option.icon className="h-4 w-4" />
                                      <span>{option.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <Select
                            value={consultation.priority || 'medium'}
                            onValueChange={(value) => handlePriorityChange(consultation.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  {(() => {
                                    const priorityOption = priorityOptions.find(option => option.value === (consultation.priority || 'medium'));
                                    const IconComponent = priorityOption?.icon || Flag;
                                    return (
                                      <>
                                        <IconComponent className="h-3 w-3" />
                                        <span className="text-xs">{priorityOption?.label || 'Moyenne'}</span>
                                      </>
                                    );
                                  })()}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {priorityOptions.map(option => (
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
                                setSelectedConsultation(consultation);
                                setShowDetailModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {consultation.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => {
                                    setConsultationToSchedule(consultation);
                                    setShowDetailModal(false);
                                    setShowScheduleModal(true);
                                  }}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  title="Planifier"
                                >
                                  <CalendarPlus className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDecline(consultation.id)}
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 w-8 p-0"
                                  title="Refuser"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            
                            {(consultation.status === 'scheduled' || consultation.status === 'in_progress') && (
                              <Button
                                onClick={() => handleStatusChange(consultation.id, 'completed')}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                title="Marquer comme terminée"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              onClick={() => {
                                setConsultationForNotes(consultation);
                                setNotesForm({
                                  notes: consultation.notes || '',
                                  priority: consultation.priority || 'medium',
                                  followUpDate: consultation.followUpDate || ''
                                });
                                setShowNotesModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800"
                              title="Ajouter des notes"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              onClick={() => {
                                setConsultationToDelete(consultation.id);
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-400">
                Page {pagination.page} sur {pagination.pages} ({pagination.total} consultations)
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => fetchConsultations(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Précédent
                </Button>
                <Button
                  onClick={() => fetchConsultations(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Détails de la consultation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informations complètes de la demande de consultation
            </DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Client</label>
                  <p className="text-lg font-medium text-white">
                    {selectedConsultation.firstName} {selectedConsultation.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Statut</label>
                  <Select
                    value={selectedConsultation.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedConsultation.id, value);
                      setSelectedConsultation({...selectedConsultation, status: value});
                    }}
                  >
                    <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                      <SelectValue>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const statusOption = statusOptions.find(option => option.value === selectedConsultation.status);
                            const IconComponent = statusOption?.icon || Clock;
                            return (
                              <>
                                <IconComponent className="h-4 w-4" />
                                <span>{statusOption?.label || selectedConsultation.status}</span>
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
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Priorité</label>
                  <Select
                    value={selectedConsultation.priority || 'medium'}
                    onValueChange={(value) => {
                      handlePriorityChange(selectedConsultation.id, value);
                      setSelectedConsultation({...selectedConsultation, priority: value as any});
                    }}
                  >
                    <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                      <SelectValue>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const priorityOption = priorityOptions.find(option => option.value === (selectedConsultation.priority || 'medium'));
                            const IconComponent = priorityOption?.icon || Flag;
                            return (
                              <>
                                <IconComponent className="h-4 w-4" />
                                <span>{priorityOption?.label || 'Moyenne'}</span>
                              </>
                            );
                          })()}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {priorityOptions.map(option => (
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <p className="text-white">{selectedConsultation.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Téléphone</label>
                  <p className="text-white">{selectedConsultation.phone || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Entreprise</label>
                  <p className="text-white">{selectedConsultation.company || 'Particulier'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Service demandé</label>
                  <p className="text-white">{selectedConsultation.service?.title || 'Service général'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedConsultation.preferredDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Date souhaitée</label>
                    <p className="text-white">{new Date(selectedConsultation.preferredDate).toLocaleString('fr-FR')}</p>
                  </div>
                )}
                {selectedConsultation.scheduledDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Date planifiée</label>
                    <p className="text-white">{new Date(selectedConsultation.scheduledDate).toLocaleString('fr-FR')}</p>
                  </div>
                )}
              </div>

              {selectedConsultation.estimatedDuration && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Durée estimée</label>
                  <p className="text-white">{selectedConsultation.estimatedDuration} minutes</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-400">Description de la demande</label>
                <div className="mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="whitespace-pre-wrap text-white">{selectedConsultation.description}</p>
                </div>
              </div>

              {selectedConsultation.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Notes internes</label>
                  <div className="mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="whitespace-pre-wrap text-white">{selectedConsultation.notes}</p>
                  </div>
                </div>
              )}

              {selectedConsultation.followUpDate && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Date de suivi</label>
                  <p className="text-white">{new Date(selectedConsultation.followUpDate).toLocaleDateString('fr-FR')}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <label className="font-medium">Date de création</label>
                  <p>{new Date(selectedConsultation.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="font-medium">Dernière modification</label>
                  <p>{new Date(selectedConsultation.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>

              {/* Quick Actions in modal */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                {selectedConsultation.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        setConsultationToSchedule(selectedConsultation);
                        setShowDetailModal(false);
                        setShowScheduleModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Planifier la consultation
                    </Button>
                    <Button
                      onClick={() => {
                        handleDecline(selectedConsultation.id);
                        setShowDetailModal(false);
                      }}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Refuser la consultation
                    </Button>
                  </>
                )}
                
                {(selectedConsultation.status === 'scheduled' || selectedConsultation.status === 'in_progress') && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedConsultation.id, 'completed');
                      setShowDetailModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marquer comme terminée
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setConsultationForNotes(selectedConsultation);
                    setNotesForm({
                      notes: selectedConsultation.notes || '',
                      priority: selectedConsultation.priority || 'medium',
                      followUpDate: selectedConsultation.followUpDate || ''
                    });
                    setShowNotesModal(true);
                  }}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier les notes
                </Button>
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

      {/* Schedule Consultation Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Planifier la consultation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Définir la date et l'heure de la consultation
            </DialogDescription>
          </DialogHeader>
          {consultationToSchedule && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Client</label>
                <p className="text-white font-medium">
                  {consultationToSchedule.firstName} {consultationToSchedule.lastName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Date et heure</label>
                <Input
                  type="datetime-local"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({...scheduleForm, scheduledDate: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Durée estimée (minutes)</label>
                <Input
                  type="number"
                  value={scheduleForm.estimatedDuration}
                  onChange={(e) => setScheduleForm({...scheduleForm, estimatedDuration: parseInt(e.target.value)})}
                  className="bg-gray-800 border-gray-600 text-white"
                  min="15"
                  step="15"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Notes de planification</label>
                <Textarea
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Instructions spéciales, préparation requise..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => setShowScheduleModal(false)} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleScheduleConsultation}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Planifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes and Priority Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Gestion des notes et priorité</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajouter des notes internes et définir la priorité
            </DialogDescription>
          </DialogHeader>
          {consultationForNotes && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Client</label>
                <p className="text-white font-medium">
                  {consultationForNotes.firstName} {consultationForNotes.lastName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Priorité</label>
                <Select value={notesForm.priority} onValueChange={(value) => setNotesForm({...notesForm, priority: value as any})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {priorityOptions.map(option => (
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
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Notes internes</label>
                <Textarea
                  value={notesForm.notes}
                  onChange={(e) => setNotesForm({...notesForm, notes: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Notes sur le client, préparation nécessaire, points importants..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Date de suivi (optionnel)</label>
                <Input
                  type="date"
                  value={notesForm.followUpDate}
                  onChange={(e) => setNotesForm({...notesForm, followUpDate: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => setShowNotesModal(false)} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddNotes}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Enregistrer
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
              Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action est irréversible.
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
              onClick={() => consultationToDelete && handleDelete(consultationToDelete)}
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