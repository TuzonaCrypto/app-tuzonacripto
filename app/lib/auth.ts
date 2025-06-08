"use client"

import { useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "business_owner" | "admin"
  businessIds?: string[] // IDs de negocios que posee
}

// Simulación de usuarios para demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@tuzonacripto.com",
    name: "Administrador",
    role: "admin",
  },
  {
    id: "2",
    email: "owner@cafebitcoin.mx",
    name: "Dueño Café Bitcoin",
    role: "business_owner",
    businessIds: ["1"],
  },
  {
    id: "3",
    email: "usuario@email.com",
    name: "Usuario Regular",
    role: "user",
  },
]

class AuthService {
  private currentUser: User | null = null
  private listeners: ((user: User | null) => void)[] = []

  constructor() {
    // Cargar usuario desde localStorage si existe
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
    }
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "Usuario no encontrado" }
    }

    // En demo, cualquier contraseña funciona
    if (password.length < 6) {
      return { success: false, error: "Contraseña debe tener al menos 6 caracteres" }
    }

    this.currentUser = user
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    this.notify()

    return { success: true }
  }

  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    // Simular delay de registro
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (mockUsers.find((u) => u.email === email)) {
      return { success: false, error: "El email ya está registrado" }
    }

    if (password.length < 6) {
      return { success: false, error: "Contraseña debe tener al menos 6 caracteres" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "user",
    }

    mockUsers.push(newUser)
    this.currentUser = newUser

    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(newUser))
    }
    this.notify()

    return { success: true }
  }

  logout() {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
    this.notify()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  canEditBusiness(businessId: string): boolean {
    if (!this.currentUser) return false

    // Admin puede editar cualquier negocio
    if (this.currentUser.role === "admin") return true

    // Business owner puede editar sus propios negocios
    if (this.currentUser.role === "business_owner") {
      return this.currentUser.businessIds?.includes(businessId) || false
    }

    return false
  }

  canAddReview(): boolean {
    return this.isAuthenticated()
  }

  canRegisterBusiness(): boolean {
    return this.isAuthenticated()
  }
}

export const authService = new AuthService()

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser())

  useEffect(() => {
    return authService.subscribe(setUser)
  }, [])

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    canEditBusiness: authService.canEditBusiness.bind(authService),
    canAddReview: authService.canAddReview.bind(authService),
    canRegisterBusiness: authService.canRegisterBusiness.bind(authService),
  }
}
