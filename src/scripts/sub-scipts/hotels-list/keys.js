import {mainContainer} from "../utils/mainContainer.js";
import {countryFromSlide} from "./countryFromSlide.js"
import {markerParts} from "./markerParts.js"

export const stateKey = "__villasAndSuitesState"

export function createContext(container = document) {
    const root = container.matches?.(mainContainer)
        ? container
        : container.querySelector?.(mainContainer) || document.querySelector(mainContainer) || container
    if (!root?.querySelectorAll) return null

    const countryItems = [...root.querySelectorAll(".embla-carousel .embla__slide")]
    const regionButtons = [...root.querySelectorAll("section.region-select [data-content-control]")]
    const markerNodes = [...root.querySelectorAll("[data-content-marker]")]
    const videosContainer = root.querySelector(".videos-comp")
    const descriptionsContainer = root.querySelector(".descriptions")
    const logoContainer = root.querySelector(".logo-nav-flicker")
    const hotelFromQuery = new URLSearchParams(window.location.search).get("hotel")
    const queriedHotel = hotelFromQuery
        ? [...root.querySelectorAll(".hotel-card[data-hotel-key]")].find((card) => card.dataset.hotelKey === hotelFromQuery)
        : null
    const queriedMarker = queriedHotel?.dataset.contentMarker || ""
    const queriedParts = queriedMarker ? markerParts(queriedMarker) : null
    const activeCountrySlide = countryItems.find((item) => item.classList.contains("is-active")) || countryItems[0]
    const selectedCountry = activeCountrySlide ? countryFromSlide(activeCountrySlide) : ""
    const initialCountry = queriedParts?.country || selectedCountry || "turkey"
    const defaultRegion = regionButtons.find((button) => button.dataset.contentControl.startsWith(`${initialCountry}.`) && button.classList.contains("selected"))
        || regionButtons.find((button) => button.dataset.contentControl.startsWith(`${initialCountry}.`))
    const state = {
        country: initialCountry,
        region: queriedParts?.region || defaultRegion?.dataset.contentControl.split(".")[1] || "",
        hotelKey: queriedHotel?.dataset.hotelKey || ""
    }

    return {
        root,
        countryItems,
        regionButtons,
        markerNodes,
        videosContainer,
        descriptionsContainer,
        logoContainer,
        state
    }
}
