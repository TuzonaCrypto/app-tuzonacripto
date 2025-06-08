import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de la base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "user" | "business_owner" | "admin"
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "user" | "business_owner" | "admin"
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "user" | "business_owner" | "admin"
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          address: string
          lat: number
          lng: number
          phone: string | null
          website: string | null
          hours: string | null
          verified: boolean
          owner_id: string | null
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          address: string
          lat: number
          lng: number
          phone?: string | null
          website?: string | null
          hours?: string | null
          verified?: boolean
          owner_id?: string | null
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          address?: string
          lat?: number
          lng?: number
          phone?: string | null
          website?: string | null
          hours?: string | null
          verified?: boolean
          owner_id?: string | null
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      business_crypto: {
        Row: {
          id: string
          business_id: string
          crypto_name: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          crypto_name: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          crypto_name?: string
          created_at?: string
        }
      }
      business_images: {
        Row: {
          id: string
          business_id: string
          image_url: string
          alt_text: string | null
          is_primary: boolean
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          image_url: string
          alt_text?: string | null
          is_primary?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          image_url?: string
          alt_text?: string | null
          is_primary?: boolean
          uploaded_by?: string | null
          created_at?: string
        }
      }
      business_social: {
        Row: {
          id: string
          business_id: string
          platform: "facebook" | "instagram" | "twitter" | "linkedin" | "telegram" | "whatsapp" | "youtube" | "tiktok"
          username: string | null
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          platform: "facebook" | "instagram" | "twitter" | "linkedin" | "telegram" | "whatsapp" | "youtube" | "tiktok"
          username?: string | null
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          platform?: "facebook" | "instagram" | "twitter" | "linkedin" | "telegram" | "whatsapp" | "youtube" | "tiktok"
          username?: string | null
          url?: string
          created_at?: string
        }
      }
      business_posts: {
        Row: {
          id: string
          business_id: string
          author_id: string
          title: string
          content: string
          image_url: string | null
          post_type: "update" | "promotion" | "event" | "news"
          likes_count: number
          comments_count: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          author_id: string
          title: string
          content: string
          image_url?: string | null
          post_type?: "update" | "promotion" | "event" | "news"
          likes_count?: number
          comments_count?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          author_id?: string
          title?: string
          content?: string
          image_url?: string | null
          post_type?: "update" | "promotion" | "event" | "news"
          likes_count?: number
          comments_count?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          title: string
          comment: string
          crypto_used: string | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          title: string
          comment: string
          crypto_used?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          title?: string
          comment?: string
          crypto_used?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
