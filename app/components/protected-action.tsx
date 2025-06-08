"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"
import { useAuth } from "@/app/lib/auth"
import AuthModal from "./auth-modal"

interface ProtectedActionProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: "user" | "business_owner" | "admin"
  businessId?: string
  action: "edit" | "review" | "register"
  fallbackMessage?: string
}

export default function ProtectedAction({
  children,
  requireAuth = true,
  requireRole,
  businessId,
  action,
  fallbackMessage,
}: ProtectedActionProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated, canEditBusiness, canAddReview, canRegisterBusiness } = useAuth()

  // Verificar autenticación
  if (requireAuth && !isAuthenticated) {
    return (
      <>
        <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <Lock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-3">
            {fallbackMessage || "Necesitas iniciar sesión para realizar esta acción"}
          </p>
          <Button onClick={() => setShowAuthModal(true)}>Iniciar Sesión</Button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
      </>
    )
  }

  // Verificar permisos específicos
  if (isAuthenticated && user) {
    let hasPermission = true

    if (requireRole && user.role !== requireRole && user.role !== "admin") {
      hasPermission = false
    }

    if (action === "edit" && businessId && !canEditBusiness(businessId)) {
      hasPermission = false
    }

    if (action === "review" && !canAddReview()) {
      hasPermission = false
    }

    if (action === "register" && !canRegisterBusiness()) {
      hasPermission = false
    }

    if (!hasPermission) {
      return (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para realizar esta acción.
            {action === "edit" && " Solo el dueño del negocio o un administrador puede editarlo."}
            {action === "review" && " Necesitas estar registrado para dejar reseñas."}
            {action === "register" && " Necesitas una cuenta para registrar un negocio."}
          </AlertDescription>
        </Alert>
      )
    }
  }

  return <>{children}</>
}
