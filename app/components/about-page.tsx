"use client"

import { ArrowLeft, Target, Shield, Zap, Heart, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "./header"

interface AboutPageProps {
  onNavigate: (page: "home" | "register" | "about") => void
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const features = [
    {
      icon: Target,
      title: "Nuestra Misión",
      description:
        "Conectar a usuarios de criptomonedas con negocios que las aceptan, creando un ecosistema próspero y accesible para todos.",
    },
    {
      icon: Shield,
      title: "Confianza y Seguridad",
      description:
        "Verificamos cada negocio registrado para garantizar que realmente aceptan criptomonedas y ofrecen servicios de calidad.",
    },
    {
      icon: Zap,
      title: "Innovación Constante",
      description:
        "Estamos siempre mejorando nuestra plataforma con nuevas funcionalidades para facilitar el uso de criptomonedas.",
    },
    {
      icon: Heart,
      title: "Comunidad Primero",
      description:
        "Construimos una comunidad donde negocios y usuarios pueden crecer juntos en el mundo de las criptomonedas.",
    },
  ]

  const team = [
    {
      name: "Ana García",
      role: "CEO & Fundadora",
      description: "Experta en blockchain con 8 años de experiencia en el ecosistema cripto.",
      image: "/placeholder.svg?height=150&width=150&text=Ana+García",
    },
    {
      name: "Carlos Ruiz",
      role: "CTO",
      description: "Desarrollador full-stack especializado en aplicaciones descentralizadas.",
      image: "/placeholder.svg?height=150&width=150&text=Carlos+Ruiz",
    },
    {
      name: "María López",
      role: "Head of Business",
      description: "Especialista en desarrollo de negocios y adopción de criptomonedas.",
      image: "/placeholder.svg?height=150&width=150&text=María+López",
    },
  ]

  const stats = [
    { number: "500+", label: "Negocios Registrados" },
    { number: "10,000+", label: "Usuarios Activos" },
    { number: "15+", label: "Criptomonedas Soportadas" },
    { number: "25+", label: "Ciudades Cubiertas" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="about" onNavigate={onNavigate} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate("home")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Quiénes Somos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos la plataforma líder que conecta el mundo de las criptomonedas con los negocios locales, facilitando la
            adopción masiva de las monedas digitales en la vida cotidiana.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Por qué TuZonaCripto?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nuestra Historia</h2>
              <div className="max-w-4xl mx-auto text-gray-700 space-y-4">
                <p>
                  TuZonaCripto nació en 2023 con una visión clara: hacer que las criptomonedas sean tan fáciles de usar
                  como el dinero tradicional. Nuestros fundadores, apasionados por la tecnología blockchain, se dieron
                  cuenta de que existía una brecha entre la adopción de criptomonedas y su uso práctico en la vida
                  diaria.
                </p>
                <p>
                  Comenzamos como un pequeño directorio local en Ciudad de México, pero rápidamente nos expandimos a
                  otras ciudades gracias al entusiasmo de la comunidad cripto y los negocios visionarios que decidieron
                  aceptar pagos digitales.
                </p>
                <p>
                  Hoy, somos la plataforma de referencia para encontrar negocios cripto-amigables en América Latina, con
                  planes de expansión global y nuevas funcionalidades que harán que usar criptomonedas sea aún más
                  sencillo y seguro.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Tienes preguntas?</h2>
          <p className="text-gray-600 mb-8">Estamos aquí para ayudarte. Contáctanos y te responderemos pronto.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>contacto@tuzonacripto.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>+52 55 1234 5678</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>Ciudad de México, México</span>
            </div>
          </div>
          <div className="mt-8">
            <Button size="lg" onClick={() => onNavigate("register")}>
              Registra tu Negocio
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
