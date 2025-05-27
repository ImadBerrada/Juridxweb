"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Filter,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
  Calendar,
  User,
  Tag,
  Globe,
  Star,
  Clock
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
import { blogApi, BlogPost } from "@/lib/api";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  tags: string[];
}

const statusOptions = [
  { value: 'published', label: 'Publié', color: 'bg-green-100 text-green-800', icon: Globe },
  { value: 'draft', label: 'Brouillon', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
];

export default function BlogManager() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    featured: false,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll(1, 100); // Get all posts for admin
      if (response.data && response.data.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreate = async () => {
    try {
      const response = await blogApi.create(formData);
      if (response.data && response.data.post) {
        setPosts([response.data.post, ...posts]);
        setShowCreateModal(false);
        resetForm();
        toast({
          title: "Article créé",
          description: "L'article a été créé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedPost) return;
    
    try {
      const response = await blogApi.update(selectedPost.id, formData);
      if (response.data && response.data.post) {
        setPosts(posts.map(post => 
          post.id === selectedPost.id ? response.data!.post : post
        ));
        setShowEditModal(false);
        setSelectedPost(null);
        toast({
          title: "Article modifié",
          description: "L'article a été modifié avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'article.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await blogApi.delete(postId);
      if (response.data) {
        setPosts(posts.filter(post => post.id !== postId));
        toast({
          title: "Article supprimé",
          description: "L'article a été supprimé avec succès.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setPostToDelete(null);
  };

  const handleBulkDelete = async () => {
    try {
      const promises = selectedPosts.map(id => blogApi.delete(id));
      await Promise.all(promises);
      
      setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
      toast({
        title: "Articles supprimés",
        description: `${selectedPosts.length} articles ont été supprimés.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les articles.",
        variant: "destructive",
      });
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === posts.length ? [] : posts.map(p => p.id)
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      published: false,
      featured: false,
      tags: []
    });
    setTagInput('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      published: post.published,
      featured: post.featured,
      tags: post.tags || []
    });
    setShowEditModal(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && post.published) ||
                         (statusFilter === "draft" && !post.published);
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Titre', 'Slug', 'Statut', 'Mis en avant', 'Tags', 'Auteur', 'Date création'];
    const csvData = filteredPosts.map(post => [
      post.title,
      post.slug,
      post.published ? 'Publié' : 'Brouillon',
      post.featured ? 'Oui' : 'Non',
      post.tags?.join(', ') || '',
      post.author?.name || 'Inconnu',
      new Date(post.createdAt).toLocaleDateString('fr-FR')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `blog_posts_${new Date().toISOString().split('T')[0]}.csv`;
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
                <FileText className="h-5 w-5 text-[#D4AF37]" />
                <span>Gestion du Blog</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gérez les articles de blog et leur publication
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                onClick={fetchPosts}
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
                Nouvel Article
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
                placeholder="Rechercher par titre, contenu ou extrait..."
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
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-400">Total</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {posts.length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-400">Publiés</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {posts.filter(p => p.published).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">Brouillons</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {posts.filter(p => !p.published).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-400">Mis en avant</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {posts.filter(p => p.featured).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4">
              <span className="text-sm font-medium text-white">
                {selectedPosts.length} article(s) sélectionné(s)
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

          {/* Posts Table */}
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
                        {selectedPosts.length === posts.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 text-left font-medium text-white">Article</th>
                    <th className="p-4 text-left font-medium text-white">Statut</th>
                    <th className="p-4 text-left font-medium text-white">Auteur</th>
                    <th className="p-4 text-left font-medium text-white">Date</th>
                    <th className="p-4 text-left font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#D4AF37]" />
                        <p className="text-white">Chargement des articles...</p>
                      </td>
                    </tr>
                  ) : filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Aucun article trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="p-4">
                          <button
                            onClick={() => togglePostSelection(post.id)}
                            className="flex items-center text-white"
                          >
                            {selectedPosts.includes(post.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">{post.title}</p>
                            <p className="text-sm text-gray-400 max-w-xs truncate">
                              {post.excerpt || post.content.substring(0, 100) + '...'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {post.featured && (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                                  <Star className="h-3 w-3 mr-1" />
                                  Mis en avant
                                </Badge>
                              )}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {post.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{post.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {post.published ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Publié
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Brouillon
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <User className="h-3 w-3 mr-1" />
                            {post.author?.name || 'Inconnu'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedPost(post);
                                setShowDetailModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => openEditModal(post)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setPostToDelete(post.id);
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
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Détails de l'article</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informations complètes de l'article de blog
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedPost.title}</h3>
                <p className="text-gray-400">Slug: {selectedPost.slug}</p>
              </div>
              
              {selectedPost.excerpt && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Extrait</label>
                  <p className="text-white mt-1">{selectedPost.excerpt}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-400">Contenu</label>
                <div className="mt-1 p-3 bg-gray-800 rounded-lg border border-gray-700 max-h-48 overflow-y-auto">
                  <div className="text-white whitespace-pre-wrap">{selectedPost.content}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Statut</label>
                  <div className="mt-1">
                    <Badge className={selectedPost.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {selectedPost.published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Mis en avant</label>
                  <p className="text-white mt-1">
                    {selectedPost.featured ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <label className="font-medium">Auteur</label>
                  <p>{selectedPost.author?.name || 'Inconnu'}</p>
                </div>
                <div>
                  <label className="font-medium">Date de création</label>
                  <p>{new Date(selectedPost.createdAt).toLocaleString('fr-FR')}</p>
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
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Créer un nouvel article</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajoutez un nouvel article de blog
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-400">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Titre de l'article"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-gray-400">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="slug-de-l-article"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="excerpt" className="text-gray-400">Extrait (optionnel)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Résumé de l'article..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-400">Contenu</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Contenu de l'article..."
                rows={8}
              />
            </div>

            <div>
              <Label className="text-gray-400">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Ajouter un tag..."
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked: boolean) => setFormData({...formData, published: checked})}
                />
                <Label htmlFor="published" className="text-gray-400">Publier</Label>
              </div>
              <div className="flex items-center space-x-2">
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
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'article</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez les informations de l'article
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title" className="text-gray-400">Titre</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-slug" className="text-gray-400">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-excerpt" className="text-gray-400">Extrait</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-content" className="text-gray-400">Contenu</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={8}
              />
            </div>

            <div>
              <Label className="text-gray-400">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Ajouter un tag..."
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-published"
                  checked={formData.published}
                  onCheckedChange={(checked: boolean) => setFormData({...formData, published: checked})}
                />
                <Label htmlFor="edit-published" className="text-gray-400">Publier</Label>
              </div>
              <div className="flex items-center space-x-2">
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
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
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
              onClick={() => postToDelete && handleDelete(postToDelete)}
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