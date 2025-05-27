"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Plus, Trash2, Search, Download, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterApi, NewsletterSubscriber } from "@/lib/api";

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await newsletterApi.getAll();
      if (response.data && response.data.subscribers) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (subscriberId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) {
      try {
        await newsletterApi.delete(subscriberId);
        setSubscribers(subscribers.filter(subscriber => subscriber.id !== subscriberId));
      } catch (error) {
        console.error("Error deleting subscriber:", error);
      }
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold mb-4"></div>
          <p className="text-muted-foreground">Chargement des abonnés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestion de la Newsletter</h2>
          <p className="text-muted-foreground">
            Gérez les abonnés à la newsletter et envoyez des campagnes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="btn-outline-gold">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="btn-gold">
            <Send className="h-4 w-4 mr-2" />
            Nouvelle Campagne
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abonnés</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribers.filter(s => {
                const date = new Date(s.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de croissance</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un abonné..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <div className="grid gap-4">
        {filteredSubscribers.map((subscriber, index) => (
          <motion.div
            key={subscriber.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Mail className="h-5 w-5 text-gold" />
                      <h3 className="text-lg font-semibold">{subscriber.email}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Abonné le {new Date(subscriber.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`mailto:${subscriber.email}`)}
                      className="btn-outline-gold"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredSubscribers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun abonné trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Aucun abonné ne correspond à votre recherche."
                : "Aucun abonné à la newsletter pour le moment."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 