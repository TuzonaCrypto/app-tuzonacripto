"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Building, Shield } from "lucide-react"
import { useAuth } from "@/app/lib/auth"
import AuthModal from "./auth-modal"

export default function UserMenu() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <>
        <Button onClick={() => setShowAuthModal(true)} variant="outline">
          <User className="w-4 h-4 mr-2" />
          Iniciar Sesión
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />
      case "business_owner":
        return <Building className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "business_owner":
        return "Dueño de Negocio"
      default:
        return "Usuario"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user?.name} />
            <AvatarFallback>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getRoleIcon(user?.role || "")}
              <span>{getRoleLabel(user?.role || "")}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        {user?.role === "business_owner" && (
          <DropdownMenuItem>
            <Building className="mr-2 h-4 w-4" />
            <span>Mis Negocios</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
