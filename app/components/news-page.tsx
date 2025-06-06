"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, ExternalLink, TrendingUp, Bitcoin, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "./header"
import OptimizedImage from "./optimized-image"

interface NewsPageProps {
  onNavigate: (page: "home" | "register" | "about" | "news") => void
}

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  category: string
  date: string
  author: string
  readTime: string
  image: string
  source: string
  trending: boolean
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Bitcoin alcanza nuevo máximo histórico superando los $45,000",
    summary:
      "La criptomoneda líder continúa su tendencia alcista impulsada por la adopción institucional y el optimismo del mercado.",
    content:
      "Bitcoin ha alcanzado un nuevo máximo histórico al superar la marca de $45,000, marcando un hito importante en su evolución como activo digital. Este incremento se debe principalmente a la creciente adopción por parte de instituciones financieras y el renovado interés de inversores minoristas.",
    category: "Bitcoin",
    date: "2024-01-15",
    author: "María González",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop", // Bitcoin físico
    source: "CryptoNews",
    trending: true,
  },
  {
    id: "2",
    title: "Ethereum 2.0: La actualización que revolucionará las finanzas descentralizadas",
    summary: "La red Ethereum continúa mejorando su escalabilidad y eficiencia energética con nuevas actualizaciones.",
    content:
      "La implementación completa de Ethereum 2.0 promete resolver los problemas de escalabilidad que han limitado el crecimiento de las aplicaciones descentralizadas. Con el nuevo mecanismo de consenso Proof of Stake, la red será más eficiente y sostenible.",
    category: "Ethereum",
    date: "2024-01-14",
    author: "Carlos Ruiz",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop", // Ethereum logo
    source: "DeFi Today",
    trending: true,
  },
  {
    id: "3",
    title: "México avanza en la regulación de criptomonedas para 2024",
    summary: "El gobierno mexicano presenta un marco regulatorio claro para el uso de criptomonedas en el país.",
    content:
      "Las autoridades mexicanas han anunciado un marco regulatorio integral para las criptomonedas que entrará en vigor en 2024. Esta regulación busca proteger a los inversores mientras fomenta la innovación en el sector fintech.",
    category: "Regulación",
    date: "2024-01-13",
    author: "Ana Martínez",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&h=400&fit=crop", // Bandera México
    source: "Fintech México",
    trending: false,
  },
  {
    id: "4",
    title: "NFTs en el arte: Galerías mexicanas adoptan tecnología blockchain",
    summary: "Las galerías de arte en México están integrando NFTs para democratizar el acceso al arte digital.",
    content:
      "Varias galerías de arte en Ciudad de México han comenzado a exhibir y vender NFTs, creando nuevas oportunidades para artistas digitales locales. Esta tendencia está transformando el mercado del arte en el país.",
    category: "NFTs",
    date: "2024-01-12",
    author: "Roberto Silva",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop", // Arte digital NFT
    source: "Arte Digital",
    trending: false,
  },
  {
    id: "5",
    title: "Solana experimenta un crecimiento del 300% en aplicaciones DeFi",
    summary: "La blockchain de Solana continúa atrayendo desarrolladores con sus bajas comisiones y alta velocidad.",
    content:
      "Solana ha experimentado un crecimiento exponencial en el número de aplicaciones DeFi construidas en su red. La combinación de bajas comisiones y alta velocidad de transacción la convierte en una alternativa atractiva a Ethereum.",
    category: "DeFi",
    date: "2024-01-11",
    author: "Luis Hernández",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&h=400&fit=crop", // DeFi gráficos
    source: "Blockchain News",
    trending: true,
  },
  {
    id: "6",
    title: "Adopción empresarial: Más de 100 empresas mexicanas aceptan cripto",
    summary: "El ecosistema empresarial mexicano abraza las criptomonedas como método de pago alternativo.",
    content:
      "Un estudio reciente revela que más de 100 empresas mexicanas han comenzado a aceptar criptomonedas como forma de pago. Esta tendencia refleja la creciente confianza en los activos digitales como medio de intercambio.",
    category: "Adopción",
    date: "2024-01-10",
    author: "Patricia López",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop", // Negocios aceptando crypto
    source: "Business Crypto",
    trending: false,
  },
]

const categories = ["Todas", "Bitcoin", "Ethereum", "DeFi", "NFTs", "Regulación", "Adopción"]

export default function NewsPage({ onNavigate }: NewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [filteredNews, setFilteredNews] = useState(mockNews)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === "Todas") {
      setFilteredNews(mockNews)
    } else {
      setFilteredNews(mockNews.filter((article) => article.category === category))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Bitcoin":
        return <Bitcoin className="w-4 h-4" />
      case "DeFi":
        return <TrendingUp className="w-4 h-4" />
      case "Regulación":
        return <Globe className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Bitcoin":
        return "bg-orange-100 text-orange-800"
      case "Ethereum":
        return "bg-blue-100 text-blue-800"
      case "DeFi":
        return "bg-green-100 text-green-800"
      case "NFTs":
        return "bg-purple-100 text-purple-800"
      case "Regulación":
        return "bg-red-100 text-red-800"
      case "Adopción":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="news" onNavigate={onNavigate} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate("home")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Noticias Cripto</h1>
          <p className="text-gray-600">
            Mantente al día con las últimas noticias del mundo de las criptomonedas y blockchain
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="flex items-center gap-2"
              >
                {category !== "Todas" && getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Noticias destacadas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
            Tendencias
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews
              .filter((article) => article.trending)
              .slice(0, 2)
              .map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <OptimizedImage
                      src={article.image}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(article.category)}>
                        {getCategoryIcon(article.category)}
                        <span className="ml-1">{article.category}</span>
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.date)}
                      </span>
                      <span>Por {article.author}</span>
                      <span>{article.readTime} lectura</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{article.summary}</p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Leer más
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Todas las noticias */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Últimas Noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <OptimizedImage
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(article.category)}>
                      {getCategoryIcon(article.category)}
                      <span className="ml-1">{article.category}</span>
                    </Badge>
                  </div>
                  {article.trending && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.date)}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Por {article.author}</span>
                    <Button variant="outline" size="sm">
                      Leer más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Globe className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay noticias en esta categoría</h3>
            <p className="text-gray-600">Intenta seleccionar otra categoría</p>
          </div>
        )}
      </div>
    </div>
  )
}
