"use client"

import { useCallback } from "react"
import {
  trackBusinessView,
  trackBusinessSearch,
  trackCategoryFilter,
  trackBusinessContact,
  trackNewsView,
  trackPriceTickerClick,
  trackBusinessRegistration,
  trackMapInteraction,
} from "@/app/lib/analytics"

export const useAnalytics = () => {
  const trackBusinessViewEvent = useCallback((businessId: string, businessName: string) => {
    trackBusinessView(businessId, businessName)
  }, [])

  const trackSearchEvent = useCallback((searchTerm: string, resultsCount: number) => {
    trackBusinessSearch(searchTerm, resultsCount)
  }, [])

  const trackFilterEvent = useCallback((category: string) => {
    trackCategoryFilter(category)
  }, [])

  const trackContactEvent = useCallback((businessId: string, contactMethod: string) => {
    trackBusinessContact(businessId, contactMethod)
  }, [])

  const trackNewsEvent = useCallback((articleId: string, category: string) => {
    trackNewsView(articleId, category)
  }, [])

  const trackPriceEvent = useCallback((cryptocurrency: string) => {
    trackPriceTickerClick(cryptocurrency)
  }, [])

  const trackRegistrationEvent = useCallback((step: string) => {
    trackBusinessRegistration(step)
  }, [])

  const trackMapEvent = useCallback((action: string, businessId?: string) => {
    trackMapInteraction(action, businessId)
  }, [])

  return {
    trackBusinessView: trackBusinessViewEvent,
    trackSearch: trackSearchEvent,
    trackFilter: trackFilterEvent,
    trackContact: trackContactEvent,
    trackNews: trackNewsEvent,
    trackPrice: trackPriceEvent,
    trackRegistration: trackRegistrationEvent,
    trackMap: trackMapEvent,
  }
}
