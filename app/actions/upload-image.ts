"use server"

import { revalidatePath } from "next/cache"

export async function uploadBusinessImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File
  const businessId = formData.get("businessId") as string

  if (!file || !businessId) {
    throw new Error("Archivo o ID de negocio no proporcionado")
  }

  // Simular delay de upload
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Por ahora, generar una URL de placeholder que represente la imagen subida
  // En producción, aquí iría la lógica de Vercel Blob
  const mockImageUrl = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(file.name.replace(/\.[^/.]+$/, ""))}`

  // En el futuro, cuando se configure BLOB_READ_WRITE_TOKEN, usar este código:
  /*
  try {
    const { put } = await import("@vercel/blob")
    const fileName = `${businessId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`
    
    const blob = await put(fileName, file, {
      access: "public",
    })
    
    revalidatePath("/")
    return blob.url
  } catch (error) {
    console.error("Error al subir imagen:", error)
    throw new Error("Error al subir la imagen")
  }
  */

  revalidatePath("/")
  return mockImageUrl
}
