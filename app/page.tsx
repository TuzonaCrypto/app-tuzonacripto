"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Shield, Bitcoin, Filter, Grid, Map, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Importar el mapa dinámicamente para evitar problemas de SSR
const BusinessMap = dynamic(() => import("./components/business-map"), { ssr: false })

// Importar componentes
import ReviewModal from "./components/review-modal"
import BusinessDetail from "./components/business-detail"
import Header from "./components/header"
import RegisterPage from "./components/register-page"
import AboutPage from "./components/about-page"
import NewsPage from "./components/news-page"
import PriceTicker from "./components/price-ticker"
import OptimizedImage from "./components/optimized-image"
import { useAnalytics } from "./hooks/use-analytics"
import SocialMediaLinks from "./components/social-media-links"

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
  business_social?: { platform: string; username?: string; url?: string }[]
}

const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Café Bitcoin",
    category: "Restaurante",
    description: "Café especializado que acepta Bitcoin y otras criptomonedas. Ambiente acogedor para trabajar.",
    address: "Av. Reforma 123, CDMX",
    lat: 19.4326,
    lng: -99.1332,
    rating: 4.8,
    reviews: 127,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDT"],
    phone: "+52 55 1234 5678",
    website: "cafebitcoin.mx",
    hours: "7:00 - 22:00",
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop", // Café interior moderno
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop", // Café con laptop
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop", // Barista preparando café
    ],
  },
  {
    id: "2",
    name: "TechCrypto Solutions",
    category: "Tecnología",
    description: "Consultoría en blockchain y desarrollo de aplicaciones descentralizadas.",
    address: "Polanco, CDMX",
    lat: 19.4284,
    lng: -99.1276,
    rating: 4.9,
    reviews: 89,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Polygon"],
    phone: "+52 55 9876 5432",
    website: "techcrypto.com",
    hours: "9:00 - 18:00",
    images: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop", // Oficina tech moderna
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop", // Equipo trabajando
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop", // Código blockchain
    ],
  },
  {
    id: "3",
    name: "Crypto Dental",
    category: "Salud",
    description: "Clínica dental moderna que acepta pagos en criptomonedas.",
    address: "Roma Norte, CDMX",
    lat: 19.415,
    lng: -99.162,
    rating: 4.6,
    reviews: 203,
    verified: true,
    cryptoAccepted: ["Bitcoin", "USDC"],
    phone: "+52 55 5555 1234",
    website: "cryptodental.mx",
    hours: "8:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop", // Clínica dental moderna
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop", // Consultorio dental
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop", // Dentista trabajando
    ],
  },
  {
    id: "4",
    name: "Blockchain Legal",
    category: "Profesionales",
    description: "Despacho jurídico especializado en regulación de criptomonedas y blockchain.",
    address: "Santa Fe, CDMX",
    lat: 19.3598,
    lng: -99.2674,
    rating: 4.7,
    reviews: 156,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum"],
    phone: "+52 55 7777 8888",
    website: "blockchainlegal.mx",
    hours: "9:00 - 19:00",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", // Oficina legal moderna
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", // Libros de derecho
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop", // Reunión legal
    ],
  },
  {
    id: "5",
    name: "Crypto Gym",
    category: "Fitness",
    description: "Gimnasio moderno con membresías pagables en criptomonedas.",
    address: "Condesa, CDMX",
    lat: 19.4067,
    lng: -99.1817,
    rating: 4.5,
    reviews: 342,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Litecoin"],
    phone: "+52 55 3333 4444",
    website: "cryptogym.mx",
    hours: "5:00 - 23:00",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", // Gimnasio moderno
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", // Equipos de gym
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop", // Personas ejercitándose
    ],
  },
  {
    id: "6",
    name: "Pizzería Blockchain",
    category: "Restaurante",
    description: "Pizzería artesanal que acepta pagos en Bitcoin y Ethereum. Especialidad en pizzas gourmet.",
    address: "Coyoacán, CDMX",
    lat: 19.3467,
    lng: -99.1618,
    rating: 4.4,
    reviews: 89,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Litecoin"],
    phone: "+52 55 2222 3333",
    website: "pizzeriablockchain.mx",
    hours: "12:00 - 23:00",
    images: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop", // Pizza artesanal
      "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=400&fit=crop", // Pizzería interior
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop", // Chef haciendo pizza
    ],
  },
  {
    id: "7",
    name: "CryptoBarber Shop",
    category: "Servicios Profesionales",
    description: "Barbería moderna con estilo vintage que acepta criptomonedas. Cortes tradicionales y modernos.",
    address: "Doctores, CDMX",
    lat: 19.4167,
    lng: -99.1439,
    rating: 4.7,
    reviews: 156,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Dogecoin"],
    phone: "+52 55 4444 5555",
    website: "cryptobarber.mx",
    hours: "9:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", // Barbería vintage
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", // Barbero trabajando
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop", // Interior barbería
    ],
  },
  {
    id: "8",
    name: "Digital Pharmacy",
    category: "Salud",
    description: "Farmacia moderna con sistema de pagos digitales incluyendo criptomonedas.",
    address: "Del Valle, CDMX",
    lat: 19.3895,
    lng: -99.1582,
    rating: 4.3,
    reviews: 234,
    verified: true,
    cryptoAccepted: ["Bitcoin", "USDC", "Ethereum"],
    phone: "+52 55 6666 7777",
    website: "digitalpharmacy.mx",
    hours: "8:00 - 22:00",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop", // Farmacia moderna
      "https://images.unsplash.com/photo-1585435557343-3b092031d8c3?w=600&h=400&fit=crop", // Medicamentos
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop", // Farmacéutico
    ],
  },
  {
    id: "9",
    name: "Crypto Coworking",
    category: "Tecnología",
    description: "Espacio de coworking especializado para emprendedores crypto y desarrolladores blockchain.",
    address: "Juárez, CDMX",
    lat: 19.4326,
    lng: -99.158,
    rating: 4.8,
    reviews: 92,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Polygon", "Solana"],
    phone: "+52 55 8888 9999",
    website: "cryptocoworking.mx",
    hours: "24/7",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", // Coworking moderno
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop", // Espacio colaborativo
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop", // Personas trabajando
    ],
  },
  {
    id: "10",
    name: "Boutique Crypto Fashion",
    category: "Retail",
    description: "Boutique de moda que acepta criptomonedas. Ropa exclusiva y accesorios de diseñador.",
    address: "Zona Rosa, CDMX",
    lat: 19.4284,
    lng: -99.1677,
    rating: 4.5,
    reviews: 67,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Ethereum", "BNB"],
    phone: "+52 55 1111 2222",
    website: "cryptofashion.mx",
    hours: "10:00 - 21:00",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop", // Boutique elegante
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop", // Ropa de diseñador
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop", // Interior tienda moda
    ],
  },
  {
    id: "11",
    name: "Crypto Hotel & Suites",
    category: "Hoteles",
    description: "Hotel boutique de lujo que acepta pagos en criptomonedas. Habitaciones modernas y servicio premium.",
    address: "Polanco, CDMX",
    lat: 19.432,
    lng: -99.195,
    rating: 4.9,
    reviews: 183,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDT", "USDC"],
    phone: "+52 55 9876 1234",
    website: "cryptohotel.mx",
    hours: "24/7",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", // Hotel lobby de lujo
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop", // Suite de hotel
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop", // Habitación moderna
    ],
  },
  {
    id: "12",
    name: "Blockchain Hostel",
    category: "Hoteles",
    description: "Hostel para viajeros amantes de las criptomonedas. Ambiente internacional y eventos crypto.",
    address: "Roma Norte, CDMX",
    lat: 19.418,
    lng: -99.168,
    rating: 4.6,
    reviews: 215,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Litecoin"],
    phone: "+52 55 3333 5555",
    website: "blockchainhostel.mx",
    hours: "24/7",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop", // Hostel moderno
      "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=600&h=400&fit=crop", // Área común hostel
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop", // Recepción hostel
    ],
  },
  {
    id: "13",
    name: "Crypto Tours México",
    category: "Turismo",
    description: "Tours especializados por la ciudad con guías expertos. Paga con tus criptomonedas favoritas.",
    address: "Centro Histórico, CDMX",
    lat: 19.4326,
    lng: -99.1332,
    rating: 4.8,
    reviews: 97,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Dogecoin"],
    phone: "+52 55 2222 4444",
    website: "cryptotours.mx",
    hours: "9:00 - 18:00",
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&h=400&fit=crop", // Tour grupo CDMX
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&h=400&fit=crop", // Centro histórico
      "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&h=400&fit=crop", // Guía turístico
    ],
  },
  {
    id: "14",
    name: "Aventuras Blockchain",
    category: "Turismo",
    description: "Experiencias de aventura y ecoturismo. Acepta múltiples criptomonedas para todas tus aventuras.",
    address: "Xochimilco, CDMX",
    lat: 19.2571,
    lng: -99.1286,
    rating: 4.7,
    reviews: 124,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Solana"],
    phone: "+52 55 7777 9999",
    website: "aventurasblockchain.mx",
    hours: "8:00 - 17:00",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", // Aventura al aire libre
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", // Ecoturismo
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", // Actividades naturaleza
    ],
  },
  {
    id: "15",
    name: "Crypto Arquitectos",
    category: "Profesionales",
    description: "Estudio de arquitectura que acepta pagos en criptomonedas. Diseños modernos y sustentables.",
    address: "Condesa, CDMX",
    lat: 19.413,
    lng: -99.178,
    rating: 4.9,
    reviews: 76,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDC"],
    phone: "+52 55 5555 7777",
    website: "cryptoarquitectos.mx",
    hours: "9:00 - 18:00",
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop", // Estudio arquitectura
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop", // Planos arquitectónicos
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop", // Arquitectos trabajando
    ],
  },
  {
    id: "16",
    name: "Consultoría Blockchain",
    category: "Profesionales",
    description: "Servicios de consultoría empresarial especializada en implementación de blockchain y criptomonedas.",
    address: "Reforma, CDMX",
    lat: 19.428,
    lng: -99.168,
    rating: 4.8,
    reviews: 112,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Polygon", "Solana"],
    phone: "+52 55 8888 1111",
    website: "consultoriablockchain.mx",
    hours: "9:00 - 19:00",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop", // Consultoría empresarial
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", // Reunión de negocios
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", // Oficina ejecutiva
    ],
  },
  {
    id: "17",
    name: "CryptoVet",
    category: "Salud",
    description:
      "Clínica veterinaria que acepta pagos en criptomonedas. Atención especializada para mascotas con servicios premium.",
    address: "Narvarte, CDMX",
    lat: 19.3895,
    lng: -99.1482,
    rating: 4.7,
    reviews: 98,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Dogecoin"],
    phone: "+52 55 2345 6789",
    website: "cryptovet.mx",
    hours: "9:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=400&fit=crop", // Clínica veterinaria
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop", // Veterinario con mascota
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop", // Perro en consulta
    ],
  },
  {
    id: "18",
    name: "Crypto Bakery",
    category: "Restaurante",
    description:
      "Panadería artesanal con productos orgánicos. Acepta diversas criptomonedas y ofrece descuentos por pagar con cripto.",
    address: "Escandón, CDMX",
    lat: 19.4031,
    lng: -99.1823,
    rating: 4.9,
    reviews: 156,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Litecoin", "USDC"],
    phone: "+52 55 3456 7890",
    website: "cryptobakery.mx",
    hours: "7:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop", // Panadería artesanal
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop", // Pan fresco
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=400&fit=crop", // Panadero trabajando
    ],
  },
  {
    id: "19",
    name: "NFT Gallery",
    category: "Retail",
    description:
      "Galería de arte digital y NFTs con exposiciones físicas. Compra y venta de arte digital con criptomonedas.",
    address: "San Rafael, CDMX",
    lat: 19.4378,
    lng: -99.1545,
    rating: 4.6,
    reviews: 87,
    verified: true,
    cryptoAccepted: ["Ethereum", "Solana", "Polygon"],
    phone: "+52 55 4567 8901",
    website: "nftgallery.mx",
    hours: "11:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop", // Galería de arte moderna
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop", // Arte digital
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop", // Exposición arte
    ],
  },
  {
    id: "20",
    name: "Crypto Spa & Wellness",
    category: "Salud",
    description: "Centro de bienestar y spa que acepta criptomonedas. Tratamientos holísticos y terapias alternativas.",
    address: "Polanco, CDMX",
    lat: 19.432,
    lng: -99.1937,
    rating: 4.8,
    reviews: 203,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDT"],
    phone: "+52 55 5678 9012",
    website: "cryptospa.mx",
    hours: "10:00 - 21:00",
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", // Spa moderno
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", // Tratamiento spa
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=400&fit=crop", // Ambiente relajante
    ],
  },
  {
    id: "21",
    name: "Crypto Auto Shop",
    category: "Servicios Profesionales",
    description:
      "Taller mecánico especializado que acepta pagos en criptomonedas. Servicio premium para todo tipo de vehículos.",
    address: "Anáhuac, CDMX",
    lat: 19.4478,
    lng: -99.1745,
    rating: 4.5,
    reviews: 124,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Litecoin", "Dogecoin"],
    phone: "+52 55 6789 0123",
    website: "cryptoauto.mx",
    hours: "8:00 - 19:00",
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", // Taller mecánico
      "https://images.unsplash.com/photo-1632823471565-1ecdf5c0a9e1?w=600&h=400&fit=crop", // Mecánico trabajando
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop", // Auto en taller
    ],
  },
  {
    id: "22",
    name: "Crypto Language School",
    category: "Educación",
    description:
      "Academia de idiomas que acepta pagos en criptomonedas. Cursos presenciales y online de múltiples idiomas.",
    address: "Del Valle, CDMX",
    lat: 19.3795,
    lng: -99.1682,
    rating: 4.7,
    reviews: 178,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDC"],
    phone: "+52 55 7890 1234",
    website: "cryptolanguage.mx",
    hours: "9:00 - 21:00",
    images: [
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop", // Aula de idiomas
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", // Estudiantes aprendiendo
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop", // Profesor enseñando
    ],
  },
  {
    id: "23",
    name: "Crypto Real Estate",
    category: "Profesionales",
    description: "Agencia inmobiliaria especializada en propiedades que pueden ser adquiridas con criptomonedas.",
    address: "Lomas de Chapultepec, CDMX",
    lat: 19.4278,
    lng: -99.2033,
    rating: 4.9,
    reviews: 92,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDT", "USDC"],
    phone: "+52 55 8901 2345",
    website: "cryptorealestate.mx",
    hours: "10:00 - 19:00",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", // Casa moderna
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop", // Agente inmobiliario
      "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&h=400&fit=crop", // Oficina inmobiliaria
    ],
  },
  {
    id: "24",
    name: "Crypto Bookstore",
    category: "Retail",
    description:
      "Librería especializada en tecnología, blockchain y finanzas. Acepta múltiples criptomonedas y organiza eventos.",
    address: "Roma Sur, CDMX",
    lat: 19.4067,
    lng: -99.1617,
    rating: 4.6,
    reviews: 145,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Solana"],
    phone: "+52 55 9012 3456",
    website: "cryptobooks.mx",
    hours: "10:00 - 21:00",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop", // Librería moderna
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", // Libros de tecnología
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop", // Persona leyendo
    ],
  },
  {
    id: "25",
    name: "Crypto Gaming Center",
    category: "Tecnología",
    description:
      "Centro de videojuegos y eSports que acepta criptomonedas. Torneos, alquiler de equipos y venta de accesorios.",
    address: "Doctores, CDMX",
    lat: 19.4167,
    lng: -99.1339,
    rating: 4.8,
    reviews: 213,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Solana", "Polygon"],
    phone: "+52 55 0123 4567",
    website: "cryptogaming.mx",
    hours: "12:00 - 00:00",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop", // Gaming center
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop", // Gamers jugando
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop", // Setup gaming
    ],
  },
  {
    id: "26",
    name: "Crypto Flower Shop",
    category: "Retail",
    description:
      "Florería que acepta pagos en criptomonedas. Arreglos florales, plantas y servicios de decoración para eventos.",
    address: "Condesa, CDMX",
    lat: 19.4117,
    lng: -99.1717,
    rating: 4.7,
    reviews: 89,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Litecoin", "Dogecoin"],
    phone: "+52 55 1234 5678",
    website: "cryptoflowers.mx",
    hours: "9:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&h=400&fit=crop", // Florería
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop", // Arreglos florales
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=400&fit=crop", // Floristería interior
    ],
  },
  {
    id: "27",
    name: "Crypto Yoga Studio",
    category: "Fitness",
    description:
      "Estudio de yoga y meditación que acepta criptomonedas. Clases grupales e individuales para todos los niveles.",
    address: "Coyoacán, CDMX",
    lat: 19.3467,
    lng: -99.1718,
    rating: 4.9,
    reviews: 156,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "USDC"],
    phone: "+52 55 2345 6789",
    website: "cryptoyoga.mx",
    hours: "6:00 - 21:00",
    images: [
      "https://images.unsplash.com/photo-1506629905607-d9b1e5b6e5a7?w=600&h=400&fit=crop", // Estudio de yoga
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop", // Clase de yoga
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", // Meditación
    ],
  },
  {
    id: "28",
    name: "Crypto Music Store",
    category: "Retail",
    description:
      "Tienda de instrumentos musicales y accesorios que acepta criptomonedas. Clases de música y estudio de grabación.",
    address: "Juárez, CDMX",
    lat: 19.4226,
    lng: -99.168,
    rating: 4.6,
    reviews: 112,
    verified: false,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Solana"],
    phone: "+52 55 3456 7890",
    website: "cryptomusic.mx",
    hours: "10:00 - 20:00",
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop", // Tienda de música
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop", // Instrumentos musicales
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop", // Estudio de grabación
    ],
  },
  {
    id: "29",
    name: "Crypto Brewery",
    category: "Restaurante",
    description:
      "Cervecería artesanal que acepta pagos en criptomonedas. Cervezas exclusivas y menú de comida gourmet.",
    address: "Roma Norte, CDMX",
    lat: 19.4195,
    lng: -99.158,
    rating: 4.8,
    reviews: 234,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Dogecoin"],
    phone: "+52 55 4567 8901",
    website: "cryptobrewery.mx",
    hours: "13:00 - 01:00",
    images: [
      "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop", // Cervecería artesanal
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=400&fit=crop", // Cervezas artesanales
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop", // Bar cervecería
    ],
  },
  {
    id: "30",
    name: "Crypto Adventure Park",
    category: "Turismo",
    description:
      "Parque de aventuras y actividades al aire libre que acepta criptomonedas. Tirolesas, senderismo y más.",
    address: "Ajusco, CDMX",
    lat: 19.2097,
    lng: -99.2064,
    rating: 4.7,
    reviews: 187,
    verified: true,
    cryptoAccepted: ["Bitcoin", "Ethereum", "Litecoin"],
    phone: "+52 55 5678 9012",
    website: "cryptoadventure.mx",
    hours: "9:00 - 18:00",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", // Parque aventuras
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", // Tirolesa
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", // Actividades outdoor
    ],
  },
]

const categories = [
  "Todos",
  "Restaurante",
  "Tecnología",
  "Salud",
  "Servicios Profesionales",
  "Fitness",
  "Retail",
  "Hoteles",
  "Turismo",
  "Profesionales",
  "Educación",
]

export default function CryptoBusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses)
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(mockBusinesses)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [currentPage, setCurrentPage] = useState<"home" | "register" | "about" | "news">("home")
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  // Estados para modales
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewBusiness, setReviewBusiness] = useState<Business | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailBusiness, setDetailBusiness] = useState<Business | null>(null)

  // Hook de analytics
  const analytics = useAnalytics()

  useEffect(() => {
    let filtered = businesses

    if (searchTerm) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      // Rastrear búsquedas
      analytics.trackSearch(searchTerm, filtered.length)
    }

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((business) => business.category === selectedCategory)

      // Rastrear filtros de categoría
      analytics.trackFilter(selectedCategory)
    }

    setFilteredBusinesses(filtered)
  }, [searchTerm, selectedCategory, businesses, analytics])

  const getCryptoIcon = (crypto: string) => {
    switch (crypto) {
      case "Bitcoin":
        return <Bitcoin className="w-4 h-4" />
      default:
        return (
          <span className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">
            ₿
          </span>
        )
    }
  }

  const handleAddImage = (businessId: string, imageUrl: string) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? {
              ...b,
              images: [...b.images, imageUrl],
            }
          : b,
      ),
    )
  }

  const handleNavigate = (page: "home" | "register" | "about" | "news") => {
    setCurrentPage(page)
  }

  const handleImageError = (businessId: string, imageIndex: number) => {
    setImageError((prev) => ({
      ...prev,
      [`${businessId}-${imageIndex}`]: true,
    }))
  }

  const handleBusinessClick = (business: Business) => {
    // Rastrear visualización de negocio
    analytics.trackBusinessView(business.id, business.name)
    setDetailBusiness(business)
    setShowDetailModal(true)
  }

  const handleViewModeChange = (mode: "grid" | "map") => {
    setViewMode(mode)
    // Rastrear cambio de vista
    analytics.trackMap(`view_mode_${mode}`)
  }

  // Renderizar página según la navegación
  if (currentPage === "register") {
    return (
      <>
        <PriceTicker />
        <RegisterPage onNavigate={handleNavigate} />
      </>
    )
  }

  if (currentPage === "about") {
    return (
      <>
        <PriceTicker />
        <AboutPage onNavigate={handleNavigate} />
      </>
    )
  }

  if (currentPage === "news") {
    return (
      <>
        <PriceTicker />
        <NewsPage onNavigate={handleNavigate} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Price Ticker */}
      <PriceTicker />

      {/* Header */}
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encuentra negocios que aceptan <span className="text-blue-600">criptomonedas</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Descubre comercios, servicios y profesionales cripto-amigables en tu zona
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar negocios, servicios o ubicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
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

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">{filteredBusinesses.length} negocios encontrados</div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewModeChange("grid")}
              >
                <Grid className="w-4 h-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewModeChange("map")}
              >
                <Map className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="aspect-video relative mb-3 group">
                    <div className="w-full h-full rounded-md bg-gray-200 overflow-hidden">
                      <OptimizedImage
                        src={business.images[0] || "/placeholder.svg"}
                        alt={business.name}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        priority={true}
                        onError={() => handleImageError(business.id, 0)}
                      />
                    </div>
                    {business.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {business.images.length}
                      </div>
                    )}
                    <div
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      onClick={() => handleBusinessClick(business)}
                    >
                      <Button size="sm" variant="secondary">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    {business.verified && (
                      <Badge variant="secondary" className="ml-2">
                        <Shield className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {business.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>

                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{business.address}</span>
                  </div>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{business.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({business.reviews} reseñas)</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {business.cryptoAccepted.map((crypto) => (
                      <Badge key={crypto} variant="outline" className="text-xs">
                        {getCryptoIcon(crypto)}
                        <span className="ml-1">{crypto}</span>
                      </Badge>
                    ))}
                  </div>
                  {business.business_social && business.business_social.length > 0 && (
                    <div className="mb-3">
                      <SocialMediaLinks
                        socialLinks={business.business_social.map((social) => ({
                          platform: social.platform,
                          username: social.username || undefined,
                          url: social.url,
                        }))}
                        size="sm"
                        showLabels={false}
                      />
                    </div>
                  )}

                  <div className="text-xs text-gray-500">Horario: {business.hours}</div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setReviewBusiness(business)
                        setShowReviewModal(true)
                      }}
                    >
                      Ver Reseñas
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleBusinessClick(business)}>
                      Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <BusinessMap
              businesses={filteredBusinesses}
              selectedBusiness={selectedBusiness}
              onBusinessSelect={setSelectedBusiness}
            />
          </div>
        )}

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron negocios</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modales */}
      {showReviewModal && reviewBusiness && (
        <ReviewModal
          business={reviewBusiness}
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false)
            setReviewBusiness(null)
          }}
          onReviewSubmitted={(newReview) => {
            // Actualizar el negocio con la nueva reseña
            setBusinesses((prev) =>
              prev.map((b) =>
                b.id === reviewBusiness.id
                  ? {
                      ...b,
                      reviews: b.reviews + 1,
                      rating: (b.rating * b.reviews + newReview.rating) / (b.reviews + 1),
                    }
                  : b,
              ),
            )
          }}
        />
      )}

      {showDetailModal && detailBusiness && (
        <BusinessDetail
          business={detailBusiness}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setDetailBusiness(null)
          }}
          onImageAdded={handleAddImage}
          isOwner={true}
        />
      )}
    </div>
  )
}
