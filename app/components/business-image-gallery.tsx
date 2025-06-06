"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageUpload from "./image-upload"
import Image from "next/image"
import OptimizedImage from "./optimized-image"

interface BusinessImageGalleryProps {
  businessId: string
  images: string[]
  onImageAdded: (imageUrl: string) => void
  canEdit?: boolean
}

export default function BusinessImageGallery({
  businessId,
  images,
  onImageAdded,
  canEdit = false,
}: BusinessImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const handleImageError = (index: number) => {
    setImageError((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  // Si no hay imágenes, mostrar un placeholder
  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center relative">
        <p className="text-gray-500">Sin imágenes</p>
        {canEdit && (
          <Button size="sm" className="absolute bottom-4 right-4" onClick={() => setShowUpload(true)}>
            <Plus className="h-4 w-4 mr-1" /> Agregar imagen
          </Button>
        )}
        {showUpload && (
          <div className="absolute inset-0 bg-white p-4">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Subir imagen</h3>
              <Button size="sm" variant="ghost" onClick={() => setShowUpload(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ImageUpload
              businessId={businessId}
              onImageUploaded={(url) => {
                onImageAdded(url)
                setShowUpload(false)
              }}
            />
          </div>
        )}
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="aspect-video relative rounded-md overflow-hidden group bg-gray-200">
      {imageError[currentIndex] ? (
        <Image
          src="/placeholder.svg?height=600&width=800"
          alt={`Imagen ${currentIndex + 1}`}
          width={800}
          height={600}
          className="w-full h-full object-cover"
          priority={true}
        />
      ) : (
        <OptimizedImage
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Imagen ${currentIndex + 1}`}
          width={800}
          height={600}
          className="w-full h-full object-cover"
          priority={true}
          onError={() => handleImageError(currentIndex)}
        />
      )}

      {images.length > 1 && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}

      {canEdit && (
        <Button
          size="sm"
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowUpload(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> Agregar imagen
        </Button>
      )}

      {showUpload && (
        <div className="absolute inset-0 bg-white p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium">Subir imagen</h3>
            <Button size="sm" variant="ghost" onClick={() => setShowUpload(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ImageUpload
            businessId={businessId}
            onImageUploaded={(url) => {
              onImageAdded(url)
              setShowUpload(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
