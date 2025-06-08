"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Phone, Globe, Clock, Shield, ThumbsUp, Edit } from "lucide-react"
import BusinessImageGallery from "./business-image-gallery"
import OptimizedImage from "./optimized-image"
import ProtectedAction from "./protected-action"
import { useAuth } from "@/app/lib/auth"

interface Business {
  id: string
  name: string
  category: string
  description: string
  address: string
  lat: number
  lng: number
  rating: number
  reviews: number
  verified: boolean
  cryptoAccepted: string[]
  phone: string
  website: string
  hours: string
  images: string[]
}

interface BusinessDetailProps {
  business: Business
  isOpen: boolean
  onClose: () => void
  onImageAdded: (businessId: string, imageUrl: string) => void
}

export default function BusinessDetail({ business, isOpen, onClose, onImageAdded }: BusinessDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "photos">("info")
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const { canEditBusiness } = useAuth()

  const formatWebsite = (website: string) => {
    if (!website.startsWith("http")) {
      return `https://${website}`
    }
    return website
  }

  const handleImageError = (imageIndex: number) => {
    setImageError((prev) => ({
      ...prev,
      [imageIndex]: true,
    }))
  }

  const isOwner = canEditBusiness(business.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold">{business.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{business.rating.toFixed(1)}</span>
                <span>({business.reviews} reseñas)</span>
                {business.verified && (
                  <Badge variant="secondary" className="ml-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Galería de imágenes */}
          <ProtectedAction action="edit" businessId={business.id} requireAuth={false} fallbackMessage="">
            <BusinessImageGallery
              businessId={business.id}
              images={business.images}
              onImageAdded={(url) => onImageAdded(business.id, url)}
              canEdit={isOwner}
            />
          </ProtectedAction>

          {/* Información sobre modo demo */}
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
            💡 Modo demo: Las imágenes se cargan desde Unsplash y se almacenan en caché para mejorar el rendimiento.
            {!isOwner && " Solo el dueño del negocio puede agregar imágenes."}
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "info" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Información
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reseñas ({business.reviews})
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "photos"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("photos")}
            >
              Fotos ({business.images.length})
            </button>
          </div>

          {/* Contenido según tab activo */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Descripción</h3>
                <p className="text-gray-700">{business.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium">Información de contacto</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{business.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{business.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a
                          href={formatWebsite(business.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {business.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{business.hours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium">Criptomonedas aceptadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {business.cryptoAccepted.map((crypto) => (
                        <Badge key={crypto} variant="outline">
                          {crypto}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("reviews")}>
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Ver reseñas
                </Button>

                <ProtectedAction
                  action="edit"
                  businessId={business.id}
                  fallbackMessage="Solo el dueño puede editar este negocio"
                >
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar información
                  </Button>
                </ProtectedAction>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center py-8">
              <p className="text-gray-500">Contenido de reseñas aquí</p>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {business.images.length > 0 ? (
                business.images.map((image, index) => (
                  <div key={index} className="aspect-video rounded-md overflow-hidden bg-gray-200">
                    <OptimizedImage
                      src={image || "/placeholder.svg"}
                      alt={`${business.name} - Imagen ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No hay fotos disponibles</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
