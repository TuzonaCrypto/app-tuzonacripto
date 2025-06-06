"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Calendar, ThumbsUp, Flag, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  image: string
}

interface Review {
  id: string
  businessId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  cryptoUsed?: string
  verified: boolean
}

interface ReviewModalProps {
  business: Business
  isOpen: boolean
  onClose: () => void
  onReviewSubmitted: (review: { rating: number }) => void
}

const mockReviews: Review[] = [
  {
    id: "1",
    businessId: "1",
    userName: "María González",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Excelente experiencia pagando con Bitcoin",
    comment:
      "El proceso de pago con Bitcoin fue súper fácil y rápido. El café está delicioso y el ambiente es perfecto para trabajar. El personal es muy amable y conoce bien sobre criptomonedas.",
    date: "2024-01-15",
    helpful: 12,
    cryptoUsed: "Bitcoin",
    verified: true,
  },
  {
    id: "2",
    businessId: "1",
    userName: "Carlos Ruiz",
    rating: 4,
    title: "Buen lugar, pero el WiFi podría mejorar",
    comment:
      "Me gusta que acepten Ethereum. El café es bueno y los precios son justos. Solo mejoraría la velocidad del WiFi para trabajar mejor.",
    date: "2024-01-10",
    helpful: 8,
    cryptoUsed: "Ethereum",
    verified: false,
  },
  {
    id: "3",
    businessId: "2",
    userName: "Ana Martínez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Consultoría blockchain excepcional",
    comment:
      "Excelente servicio de consultoría. Me ayudaron a implementar smart contracts para mi proyecto. Muy profesionales y aceptan pagos en múltiples criptomonedas.",
    date: "2024-01-12",
    helpful: 15,
    cryptoUsed: "Ethereum",
    verified: true,
  },
]

export default function ReviewModal({ business, isOpen, onClose, onReviewSubmitted }: ReviewModalProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    cryptoUsed: "",
    userName: "",
  })
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    // Filtrar reseñas para este negocio
    const businessReviews = mockReviews.filter((review) => review.businessId === business.id)
    setReviews(businessReviews)
  }, [business.id])

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.title || !newReview.comment || !newReview.userName) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const review: Review = {
      id: Date.now().toString(),
      businessId: business.id,
      userName: newReview.userName,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
      cryptoUsed: newReview.cryptoUsed,
      verified: false,
    }

    setReviews([review, ...reviews])
    onReviewSubmitted({ rating: newReview.rating })
    setNewReview({ rating: 0, title: "", comment: "", cryptoUsed: "", userName: "" })
    setShowReviewForm(false)
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? hoveredRating || rating : rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img
              src={business.image || "/placeholder.svg"}
              alt={business.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{business.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{business.rating.toFixed(1)}</span>
                <span>({business.reviews} reseñas)</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botón para agregar reseña */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Reseñas de usuarios</h3>
            <Button onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? "Cancelar" : "Escribir Reseña"}
            </Button>
          </div>

          {/* Formulario de nueva reseña */}
          {showReviewForm && (
            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Comparte tu experiencia</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tu nombre *</label>
                    <Input
                      placeholder="Ingresa tu nombre"
                      value={newReview.userName}
                      onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Calificación *</label>
                    {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Título de tu reseña *</label>
                    <Input
                      placeholder="Resumen de tu experiencia"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tu experiencia *</label>
                    <Textarea
                      placeholder="Cuéntanos sobre tu experiencia con este negocio..."
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Criptomoneda utilizada</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newReview.cryptoUsed}
                      onChange={(e) => setNewReview({ ...newReview, cryptoUsed: e.target.value })}
                    >
                      <option value="">Selecciona (opcional)</option>
                      {business.cryptoAccepted.map((crypto) => (
                        <option key={crypto} value={crypto}>
                          {crypto}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button onClick={handleSubmitReview} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Publicar Reseña
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de reseñas */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aún no hay reseñas para este negocio.</p>
                <p className="text-sm">¡Sé el primero en compartir tu experiencia!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {review.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(review.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        {review.cryptoUsed && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Pagó con {review.cryptoUsed}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        Útil ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-600">
                        <Flag className="w-4 h-4" />
                        Reportar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Estadísticas de reseñas */}
          {reviews.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Resumen de calificaciones</h4>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter((r) => r.rating === stars).length
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          {stars} <Star className="w-3 h-3 text-yellow-400" />
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
