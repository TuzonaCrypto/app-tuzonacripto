// Configuración de Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// Función para enviar eventos a GA
export const gtag = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag(...args)
  }
}

// Función para rastrear páginas vistas
export const pageview = (url: string) => {
  if (GA_TRACKING_ID) {
    gtag("config", GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// Función para rastrear eventos personalizados
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (GA_TRACKING_ID) {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Eventos específicos para TuZonaCripto
export const trackBusinessView = (businessId: string, businessName: string) => {
  event({
    action: "view_business",
    category: "Business",
    label: `${businessId}-${businessName}`,
  })
}

export const trackBusinessSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: "search_business",
    category: "Search",
    label: searchTerm,
    value: resultsCount,
  })
}

export const trackCategoryFilter = (category: string) => {
  event({
    action: "filter_category",
    category: "Filter",
    label: category,
  })
}

export const trackBusinessContact = (businessId: string, contactMethod: string) => {
  event({
    action: "contact_business",
    category: "Business",
    label: `${businessId}-${contactMethod}`,
  })
}

export const trackNewsView = (articleId: string, category: string) => {
  event({
    action: "view_news",
    category: "News",
    label: `${articleId}-${category}`,
  })
}

export const trackPriceTickerClick = (cryptocurrency: string) => {
  event({
    action: "click_price_ticker",
    category: "PriceTicker",
    label: cryptocurrency,
  })
}

export const trackBusinessRegistration = (step: string) => {
  event({
    action: "business_registration",
    category: "Registration",
    label: step,
  })
}

export const trackMapInteraction = (action: string, businessId?: string) => {
  event({
    action: "map_interaction",
    category: "Map",
    label: `${action}-${businessId || "general"}`,
  })
}
