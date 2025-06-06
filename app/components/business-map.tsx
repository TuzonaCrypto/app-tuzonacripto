"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Star, Shield, Bitcoin, MapPin, Phone, Globe, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

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

interface BusinessMapProps {
  businesses: Business[]
  selectedBusiness: Business | null
  onBusinessSelect: (business: Business | null) => void
}

// Custom icon for crypto businesses
const cryptoIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f97316" width="24" height="24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12.5 6.5h-1v2h-1v1h1v1h-1v1h1v2h1v-2h1v-1h-1v-1h1v-1h-1v-2z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

function MapUpdater({ businesses }: { businesses: Business[] }) {
  const map = useMap()

  useEffect(() => {
    if (businesses.length > 0) {
      const group = new L.FeatureGroup(businesses.map((business) => L.marker([business.lat, business.lng])))
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }, [businesses, map])

  return null
}

export default function BusinessMap({ businesses, selectedBusiness, onBusinessSelect }: BusinessMapProps) {
  const getCryptoIcon = (crypto: string) => {
    switch (crypto) {
      case "Bitcoin":
        return <Bitcoin className="w-3 h-3" />
      default:
        return (
          <span className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">
            ₿
          </span>
        )
    }
  }

  return (
    <MapContainer
      center={[19.4326, -99.1332]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater businesses={businesses} />

      {businesses.map((business) => (
        <Marker
          key={business.id}
          position={[business.lat, business.lng]}
          icon={cryptoIcon}
          eventHandlers={{
            click: () => onBusinessSelect(business),
          }}
        >
          <Popup className="custom-popup" minWidth={300}>
            <div className="p-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{business.name}</h3>
                {business.verified && (
                  <Badge variant="secondary" className="ml-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>

              <Badge variant="outline" className="mb-2">
                {business.category}
              </Badge>

              <p className="text-sm text-gray-600 mb-3">{business.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{business.address}</span>
                </div>

                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-gray-500 ml-1">({business.reviews} reseñas)</span>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{business.phone}</span>
                </div>

                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{business.website}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{business.hours}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3 mb-3">
                {business.cryptoAccepted.map((crypto) => (
                  <Badge key={crypto} variant="outline" className="text-xs">
                    {getCryptoIcon(crypto)}
                    <span className="ml-1">{crypto}</span>
                  </Badge>
                ))}
              </div>

              <Button size="sm" className="w-full">
                Ver Detalles
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
