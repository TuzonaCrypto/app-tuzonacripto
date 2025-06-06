"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadBusinessImage } from "../actions/upload-image"

interface ImageUploadProps {
  businessId: string
  onImageUploaded: (imageUrl: string) => void
  className?: string
}

export default function ImageUpload({ businessId, onImageUploaded, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor selecciona una imagen válida")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("La imagen no debe superar los 5MB")
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Iniciar upload
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("businessId", businessId)

      const imageUrl = await uploadBusinessImage(formData)
      onImageUploaded(imageUrl)
      setShowInfo(true)
    } catch (error) {
      console.error("Error al subir imagen:", error)
      setUploadError("Error al subir la imagen. Intenta nuevamente.")
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setPreviewUrl(null)
    setUploadError(null)
    setShowInfo(false)
  }

  return (
    <div className={className}>
      {showInfo && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Modo demo: Las imágenes se simulan con placeholders. Para usar imágenes reales, configura
            BLOB_READ_WRITE_TOKEN en las variables de entorno.
          </AlertDescription>
        </Alert>
      )}

      {!previewUrl ? (
        <Card className="border-dashed border-2 p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
          <label className="cursor-pointer flex flex-col items-center justify-center">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Haz clic para subir una imagen</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 5MB</p>
          </label>
        </Card>
      ) : (
        <div className="relative">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto rounded-md object-cover aspect-video"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
            {isUploading ? (
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                <p className="text-sm">Subiendo imagen...</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={resetUpload}>
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
    </div>
  )
}
