// Definir la interfaz Business directamente en este archivo
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

// Geolocalización
const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    // Filtrar negocios cercanos
  })
}

// Compartir negocio
const shareBusinesses = async (business: Business) => {
  if (navigator.share) {
    await navigator.share({
      title: business.name,
      text: business.description,
      url: `${window.location.origin}/business/${business.id}`,
    })
  }
}

// Notificaciones
const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }
}
