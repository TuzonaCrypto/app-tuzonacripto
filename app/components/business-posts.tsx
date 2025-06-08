"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Calendar, Megaphone, Star, Newspaper } from "lucide-react"
import { useAuth } from "@/app/lib/auth"
import { db } from "@/app/lib/database"
import OptimizedImage from "./optimized-image"

interface BusinessPost {
  id: string
  business_id: string
  title: string
  content: string
  image_url?: string
  post_type: "update" | "promotion" | "event" | "news"
  likes_count: number
  comments_count: number
  created_at: string
  author: {
    id: string
    name: string
    avatar_url?: string
  }
  business: {
    id: string
    name: string
  }
}

interface BusinessPostsProps {
  businessId: string
  showCreatePost?: boolean
}

export default function BusinessPosts({ businessId, showCreatePost = false }: BusinessPostsProps) {
  const [posts, setPosts] = useState<BusinessPost[]>([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  useEffect(() => {
    loadPosts()
  }, [businessId])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = await db.getBusinessPosts(businessId)
      setPosts(data)

      // Cargar likes del usuario si está autenticado
      if (user) {
        const userLikes = new Set<string>()
        for (const post of data) {
          const hasLiked = await db.hasLiked(post.id, user.id)
          if (hasLiked) {
            userLikes.add(post.id)
          }
        }
        setLikedPosts(userLikes)
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) return

    try {
      const success = await db.toggleLike(postId, user.id)
      if (success) {
        // Actualizar estado local
        setLikedPosts((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(postId)) {
            newSet.delete(postId)
          } else {
            newSet.add(postId)
          }
          return newSet
        })

        // Actualizar contador en el post
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              const isLiked = likedPosts.has(postId)
              return {
                ...post,
                likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
              }
            }
            return post
          }),
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "promotion":
        return <Megaphone className="w-4 h-4" />
      case "event":
        return <Calendar className="w-4 h-4" />
      case "news":
        return <Newspaper className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "promotion":
        return "bg-orange-100 text-orange-800"
      case "event":
        return "bg-blue-100 text-blue-800"
      case "news":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "promotion":
        return "Promoción"
      case "event":
        return "Evento"
      case "news":
        return "Noticia"
      default:
        return "Actualización"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <MessageCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay publicaciones</h3>
        <p className="text-gray-600">Este negocio aún no ha publicado actualizaciones.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{post.author.name}</p>
                  <p className="text-xs text-gray-500">{post.business.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                </div>
              </div>
              <Badge className={`${getPostTypeColor(post.post_type)} flex items-center gap-1`}>
                {getPostTypeIcon(post.post_type)}
                {getPostTypeLabel(post.post_type)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.image_url && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <OptimizedImage
                  src={post.image_url}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${
                    likedPosts.has(post.id) ? "text-red-600" : "text-gray-600"
                  }`}
                  disabled={!user}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                  <span>{post.likes_count}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count}</span>
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="text-gray-600">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
