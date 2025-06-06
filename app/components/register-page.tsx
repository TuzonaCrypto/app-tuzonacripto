"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, MapPin, Phone, Globe, Clock, Bitcoin, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "./header"

interface RegisterPageProps {
  onNavigate: (page: "home" | "register" | "about") => void
}

interface BusinessForm {
  name: string
  category: string
  description: string
  address: string
  phone: string
  website: string
  hours: string
  cryptoAccepted: string[]
  ownerName: string
  ownerEmail: string
}

const categories = [
  "Restaurante",
  "Tecnología",
  "Salud",
  "Servicios Profesionales",
  "Fitness",
  "Retail",
  "Hoteles",
  "Turismo",
  "Profesionales",
]

const cryptoOptions = ["Bitcoin", "Ethereum", "USDT", "USDC", "Litecoin", "Dogecoin", "Polygon", "Solana", "BNB"]

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [formData, setFormData] = useState<BusinessForm>({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    hours: "",
    cryptoAccepted: [],
    ownerName: "",
    ownerEmail: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: keyof BusinessForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCryptoToggle = (crypto: string) => {
    setFormData((prev) => ({
      ...prev,
      cryptoAccepted: prev.cryptoAccepted.includes(crypto)
        ? prev.cryptoAccepted.filter((c) => c !== crypto)
        : [...prev.cryptoAccepted, crypto],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        name: "",
        category: "",
        description: "",
        address: "",
        phone: "",
        website: "",
        hours: "",
        cryptoAccepted: [],
        ownerName: "",
        ownerEmail: "",
      })
    }, 3000)
  }

  const isFormValid = () => {
    return (
      formData.name &&
      formData.category &&
      formData.description &&
      formData.address &&
      formData.phone &&
      formData.ownerName &&
      formData.ownerEmail &&
      formData.cryptoAccepted.length > 0
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="register" onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate("home")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registra tu negocio</h1>
          <p className="text-gray-600">
            Únete a la comunidad de negocios cripto-amigables y llega a más clientes que usan criptomonedas.
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ¡Excelente! Tu negocio ha sido registrado exitosamente. Nuestro equipo lo revisará y se pondrá en contacto
              contigo pronto.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Negocio */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Negocio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del negocio *</label>
                  <Input
                    placeholder="Ej: Café Bitcoin"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría *</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <Textarea
                  placeholder="Describe tu negocio, servicios y por qué aceptas criptomonedas..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dirección completa *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Calle, número, colonia, ciudad"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="+52 55 1234 5678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sitio web</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="www.tunegocio.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Horarios de atención</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Ej: Lun-Vie 9:00-18:00, Sáb 10:00-14:00"
                    value={formData.hours}
                    onChange={(e) => handleInputChange("hours", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Criptomonedas Aceptadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bitcoin className="w-5 h-5 mr-2" />
                Criptomonedas Aceptadas *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Selecciona las criptomonedas que acepta tu negocio. Puedes agregar más después.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cryptoOptions.map((crypto) => (
                  <button
                    key={crypto}
                    type="button"
                    onClick={() => handleCryptoToggle(crypto)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.cryptoAccepted.includes(crypto)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {formData.cryptoAccepted.includes(crypto) ? (
                        <X className="w-4 h-4 mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm font-medium">{crypto}</span>
                    </div>
                  </button>
                ))}
              </div>
              {formData.cryptoAccepted.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Criptomonedas seleccionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.cryptoAccepted.map((crypto) => (
                      <Badge key={crypto} variant="default">
                        {crypto}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Propietario */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Propietario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre completo *</label>
                  <Input
                    placeholder="Tu nombre completo"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de envío */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!isFormValid() || isSubmitting} className="min-w-[200px]">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </>
              ) : (
                "Registrar Negocio"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
