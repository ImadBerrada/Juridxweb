"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Tag, ArrowLeft, Share2, Clock, Globe, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { blogApi, BlogPost } from "@/lib/api";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get all published posts to find the one with matching slug
      const response = await blogApi.getAll(1, 100, true);
      if (response.data && response.data.posts) {
        const foundPost = response.data.posts.find(p => p.slug === slug);
        
        if (!foundPost) {
          setError('Article non trouvé');
          return;
        }
        
        setPost(foundPost);
        
        // Get related posts (same tags, excluding current post)
        const related = response.data.posts
          .filter(p => p.id !== foundPost.id && p.tags && foundPost.tags && 
                      p.tags.some(tag => foundPost.tags!.includes(tag)))
          .slice(0, 3);
        
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 animate-spin text-gold" />
            <span className="text-lg font-medium">Chargement de l'article...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Article Header */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-gold transition-colors mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Link>

            <div className="flex items-center gap-2 mb-6">
              {post.featured && (
                <Badge className="bg-gold/20 text-gold border-gold/30">
                  <Globe className="h-3 w-3 mr-1" />
                  En vedette
                </Badge>
              )}
              {post.tags && post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-b border-border py-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">{post.author?.name || 'Abderrahman Adel'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={sharePost}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-8 lg:p-12">
                <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-gold hover:prose-a:text-gold/80">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Articles <span className="text-gradient">Connexes</span>
              </h2>
              <p className="text-muted-foreground">
                Découvrez d'autres articles qui pourraient vous intéresser
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="h-full hover:shadow-lg transition-shadow duration-300 bg-card border-border group">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      {relatedPost.featured && (
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          <Globe className="h-3 w-3 mr-1" />
                          En vedette
                        </Badge>
                      )}
                      {relatedPost.tags && relatedPost.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="group-hover:text-gold transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {relatedPost.excerpt || relatedPost.content.substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {relatedPost.author?.name || 'Abderrahman Adel'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(relatedPost.createdAt)}
                      </div>
                    </div>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-gold group-hover:text-black transition-colors">
                        Lire l'article
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-gold/10 to-gold-dark/10 border-gold/20">
              <CardContent className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Restez <span className="text-gradient">Informé</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Abonnez-vous à notre newsletter pour recevoir nos derniers articles juridiques 
                  et analyses directement dans votre boîte mail.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/#newsletter">
                    <Button size="lg" className="btn-gold">
                      S'abonner à la Newsletter
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/consultation">
                    <Button size="lg" variant="outline" className="btn-outline-gold">
                      Consultation Gratuite
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 