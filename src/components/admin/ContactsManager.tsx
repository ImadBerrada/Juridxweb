"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
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
  Calendar,
  CheckSquare,
  Square,
  MoreHorizontal,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contactsApi, Contact } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

export default function ContactsManager() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchContacts = async (page = 1, status = statusFilter) => {
    try {
      setLoading(true);
      const response = await contactsApi.getAll(page, pagination.limit, status === "all" ? undefined : status || undefined);
      if (response.data) {
        setContacts(response.data.contacts);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      const response = await contactsApi.updateStatus(contactId, newStatus);
      if (response.data) {
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ));
        toast({
          title: "Statut mis à jour",
          description: "Le statut du contact a été modifié avec succès.",
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

  const handleDelete = async (contactId: string) => {
    try {
      const response = await contactsApi.delete(contactId);
      if (response.data) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        toast({
          title: "Contact supprimé",
          description: "Le contact a été supprimé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contact.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setContactToDelete(null);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      const promises = selectedContacts.map(id => contactsApi.updateStatus(id, newStatus));
      await Promise.all(promises);
      
      setContacts(contacts.map(contact => 
        selectedContacts.includes(contact.id)
          ? { ...contact, status: newStatus }
          : contact
      ));
      
      setSelectedContacts([]);
      toast({
        title: "Statuts mis à jour",
        description: `${selectedContacts.length} contacts ont été mis à jour.`,
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
      const promises = selectedContacts.map(id => contactsApi.delete(id));
      await Promise.all(promises);
      
      setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
      toast({
        title: "Contacts supprimés",
        description: `${selectedContacts.length} contacts ont été supprimés.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les contacts.",
        variant: "destructive",
      });
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === contacts.length ? [] : contacts.map(c => c.id)
    );
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <Badge className={statusOption?.color || 'bg-gray-100 text-gray-800'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contacted', label: 'Contacté', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Résolu', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archivé', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Mail className="h-5 w-5 text-[#D4AF37]" />
                <span>Gestion des Contacts</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gérez les demandes de contact et leur suivi
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                onClick={() => fetchContacts(pagination.page)}
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
                placeholder="Rechercher par nom, email ou entreprise..."
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
          </div>

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4">
              <span className="text-sm font-medium text-white">
                {selectedContacts.length} contact(s) sélectionné(s)
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

          {/* Contacts Table */}
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
                        {selectedContacts.length === contacts.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 text-left font-medium text-white">Contact</th>
                    <th className="p-4 text-left font-medium text-white">Entreprise</th>
                    <th className="p-4 text-left font-medium text-white">Statut</th>
                    <th className="p-4 text-left font-medium text-white">Date</th>
                    <th className="p-4 text-left font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                        <p className="text-white">Chargement des contacts...</p>
                      </td>
                    </tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Aucun contact trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="p-4">
                          <button
                            onClick={() => toggleContactSelection(contact.id)}
                            className="flex items-center text-white"
                          >
                            {selectedContacts.includes(contact.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 mr-1" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {contact.company ? (
                            <div className="flex items-center text-white">
                              <Building className="h-4 w-4 mr-2 text-gray-400" />
                              {contact.company}
                            </div>
                          ) : (
                            <span className="text-gray-400">Particulier</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Select
                            value={contact.status}
                            onValueChange={(value) => handleStatusChange(contact.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedContact(contact)
                                setShowDetailModal(true)
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setContactToDelete(contact.id)
                                setShowDeleteDialog(true)
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
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
                Page {pagination.page} sur {pagination.pages} ({pagination.total} contacts)
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => fetchContacts(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Précédent
                </Button>
                <Button
                  onClick={() => fetchContacts(pagination.page + 1)}
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

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du contact</DialogTitle>
            <DialogDescription>
              Informations complètes du contact
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-lg font-medium">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedContact.status)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p>{selectedContact.phone || 'Non renseigné'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Entreprise</label>
                <p>{selectedContact.company || 'Particulier'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <label className="font-medium">Date de création</label>
                  <p>{new Date(selectedContact.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="font-medium">Dernière modification</label>
                  <p>{new Date(selectedContact.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailModal(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              onClick={() => contactToDelete && handleDelete(contactToDelete)}
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