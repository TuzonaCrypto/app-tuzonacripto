"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Users } from "lucide-react"
import { useAuth } from "@/app/lib/auth"
import { db } from "@/app/lib/database"

interface FollowButtonProps {
  businessId: string
  showCount?: boolean
}

export default function FollowButton({ businessId, showCount = true }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    loadFollowStatus()
  }, [businessId, user])

  const loadFollowStatus = async () => {
    try {
      // Cargar conteo de seguidores
      const count = await db.getFollowersCount(businessId)
      setFollowersCount(count)

      // Verificar si el usuario actual sigue este negocio
      if (user) {
        const following = await db.isFollowing(businessId, user.id)
        setIsFollowing(following)
      }
    } catch (error) {
      console.error("Error loading follow status:", error)
    }
  }

  const handleToggleFollow = async () => {
    if (!user) return

    setLoading(true)
    try {
      const success = await db.toggleFollow(businessId, user.id)
      if (success) {
        setIsFollowing(!isFollowing)
        setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return showCount ? (
      <div className="flex items-center space-x-2 text-gray-500">
        <Users className="w-4 h-4" />
        <span className="text-sm">{followersCount} seguidores</span>
      </div>
    ) : null
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isFollowing ? "default" : "outline"}
        size="sm"
        onClick={handleToggleFollow}
        disabled={loading}
        className={`flex items-center space-x-2 ${isFollowing ? "bg-red-600 hover:bg-red-700" : ""}`}
      >
        <Heart className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`} />
        <span>{isFollowing ? "Siguiendo" : "Seguir"}</span>
      </Button>

      {showCount && (
        <div className="flex items-center space-x-1 text-gray-500">
          <Users className="w-4 h-4" />
          <span className="text-sm">{followersCount}</span>
        </div>
      )}
    </div>
  )
}
