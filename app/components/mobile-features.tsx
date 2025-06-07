import type { Business } from "./path-to-business" // Assuming Business is imported from another file

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
