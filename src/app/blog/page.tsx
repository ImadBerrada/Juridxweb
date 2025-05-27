"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, User, Tag, ArrowRight, Filter, Clock, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { blogApi, BlogPost } from "@/lib/api";
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll(1, 50, true); // Only published posts
      if (response.data && response.data.posts) {
        const publishedPosts = response.data.posts;
        setPosts(publishedPosts);
        
        // Extract featured posts
        const featured = publishedPosts.filter(post => post.featured);
        setFeaturedPosts(featured);
        
        // Extract all unique tags
        const tags = new Set<string>();
        publishedPosts.forEach(post => {
          if (post.tags) {
            post.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === "all" || (post.tags && post.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">Blog Juridique</span>
              <span className="block">JuridX</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Découvrez nos analyses juridiques, conseils d'experts et actualités du droit international. 
              Restez informé des dernières évolutions juridiques avec Abderrahman Adel.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-4 mb-12 max-w-4xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full lg:w-48 bg-card border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-6 bg-secondary/50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Articles <span className="text-gradient">En Vedette</span>
              </h2>
              <p className="text-muted-foreground">
                Nos articles les plus importants et analyses approfondies
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredPosts.slice(0, 3).map((post, index) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-card border-border group">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          <Globe className="h-3 w-3 mr-1" />
                          En vedette
                        </Badge>
                        {post.tags && post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="group-hover:text-gold transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {post.excerpt || truncateContent(post.content)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author?.name || 'Abderrahman Adel'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-gold group-hover:text-black transition-colors">
                          Lire l'article
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Tous les <span className="text-gradient">Articles</span>
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 animate-spin text-gold" />
                <span className="text-lg font-medium">Chargement des articles...</span>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Aucun article trouvé pour votre recherche.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-card border-border group">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        {post.featured && (
                          <Badge className="bg-gold/20 text-gold border-gold/30">
                            <Globe className="h-3 w-3 mr-1" />
                            En vedette
                          </Badge>
                        )}
                        {post.tags && post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="group-hover:text-gold transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {post.excerpt || truncateContent(post.content)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author?.name || 'Abderrahman Adel'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-gold group-hover:text-black transition-colors">
                          Lire l'article
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-6 bg-secondary/50">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Restez <span className="text-gradient">Informé</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Abonnez-vous à notre newsletter pour recevoir nos derniers articles juridiques 
              et analyses directement dans votre boîte mail.
            </p>
            <Link href="/#newsletter">
              <Button size="lg" className="btn-gold">
                S'abonner à la Newsletter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 