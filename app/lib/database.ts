import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Business = Database["public"]["Tables"]["businesses"]["Row"] & {
  business_crypto: Database["public"]["Tables"]["business_crypto"]["Row"][]
  business_images: Database["public"]["Tables"]["business_images"]["Row"][]
  business_social: Database["public"]["Tables"]["business_social"]["Row"][]
  owner?: Database["public"]["Tables"]["users"]["Row"]
}

type BusinessPost = Database["public"]["Tables"]["business_posts"]["Row"] & {
  author: Database["public"]["Tables"]["users"]["Row"]
  business: Database["public"]["Tables"]["businesses"]["Row"]
}

export class DatabaseService {
  // Obtener todos los negocios con sus relaciones
  async getBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        *,
        business_crypto(*),
        business_images(*),
        business_social(*),
        owner:users(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching businesses:", error)
      return []
    }

    return data || []
  }

  // Obtener un negocio específico
  async getBusiness(id: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        *,
        business_crypto(*),
        business_images(*),
        business_social(*),
        owner:users(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching business:", error)
      return null
    }

    return data
  }

  // Crear un nuevo negocio
  async createBusiness(
    business: Database["public"]["Tables"]["businesses"]["Insert"],
    cryptos: string[],
    socialMedia: { platform: string; url: string; username?: string }[] = [],
  ): Promise<string | null> {
    const { data, error } = await supabase.from("businesses").insert(business).select("id").single()

    if (error) {
      console.error("Error creating business:", error)
      return null
    }

    const businessId = data.id

    // Insertar criptomonedas
    if (cryptos.length > 0) {
      const cryptoData = cryptos.map((crypto) => ({
        business_id: businessId,
        crypto_name: crypto,
      }))

      await supabase.from("business_crypto").insert(cryptoData)
    }

    // Insertar redes sociales
    if (socialMedia.length > 0) {
      const socialData = socialMedia.map((social) => ({
        business_id: businessId,
        platform: social.platform as any,
        url: social.url,
        username: social.username,
      }))

      await supabase.from("business_social").insert(socialData)
    }

    return businessId
  }

  // Obtener reseñas de un negocio
  async getReviews(businessId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        user:users(*)
      `)
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return []
    }

    return data || []
  }

  // Crear una reseña
  async createReview(review: Database["public"]["Tables"]["reviews"]["Insert"]) {
    const { data, error } = await supabase.from("reviews").insert(review).select().single()

    if (error) {
      console.error("Error creating review:", error)
      return null
    }

    return data
  }

  // Obtener posts de un negocio
  async getBusinessPosts(businessId: string): Promise<BusinessPost[]> {
    const { data, error } = await supabase
      .from("business_posts")
      .select(`
        *,
        author:users(*),
        business:businesses(*)
      `)
      .eq("business_id", businessId)
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
      return []
    }

    return data || []
  }

  // Crear un post
  async createPost(post: Database["public"]["Tables"]["business_posts"]["Insert"]) {
    const { data, error } = await supabase.from("business_posts").insert(post).select().single()

    if (error) {
      console.error("Error creating post:", error)
      return null
    }

    return data
  }

  // Seguir/dejar de seguir un negocio
  async toggleFollow(businessId: string, userId: string): Promise<boolean> {
    // Verificar si ya sigue
    const { data: existing } = await supabase
      .from("business_followers")
      .select("id")
      .eq("business_id", businessId)
      .eq("user_id", userId)
      .single()

    if (existing) {
      // Dejar de seguir
      const { error } = await supabase
        .from("business_followers")
        .delete()
        .eq("business_id", businessId)
        .eq("user_id", userId)

      return !error
    } else {
      // Seguir
      const { error } = await supabase.from("business_followers").insert({ business_id: businessId, user_id: userId })

      return !error
    }
  }

  // Verificar si un usuario sigue un negocio
  async isFollowing(businessId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("business_followers")
      .select("id")
      .eq("business_id", businessId)
      .eq("user_id", userId)
      .single()

    return !!data
  }

  // Obtener conteo de seguidores
  async getFollowersCount(businessId: string): Promise<number> {
    const { count } = await supabase
      .from("business_followers")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)

    return count || 0
  }

  // Like/unlike un post
  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (existing) {
      // Quitar like
      const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId)

      return !error
    } else {
      // Dar like
      const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: userId })

      return !error
    }
  }

  // Verificar si un usuario dio like a un post
  async hasLiked(postId: string, userId: string): Promise<boolean> {
    const { data } = await supabase.from("post_likes").select("id").eq("post_id", postId).eq("user_id", userId).single()

    return !!data
  }
}

export const db = new DatabaseService()
