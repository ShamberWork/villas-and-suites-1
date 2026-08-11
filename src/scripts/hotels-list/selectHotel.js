import {scrollToIndex} from "./scrollToIndex.js"
import {updateProgress} from "./updateProgress.js"

function activeMarker(context) {
    return context.state.region ? `${context.state.country}.${context.state.region}` : context.state.country
}

export function visibleHotelNodes(context) {
    const marker = activeMarker(context)
    return {
        cards: [...context.root.querySelectorAll(`.hotel-card[data-content-marker="${marker}"]`)],
        logos: [...context.root.querySelectorAll(`.logo-slide[data-content-marker="${marker}"]`)],
        videos: [...context.root.querySelectorAll(`.videos-comp > .vimeo-video-box[data-content-marker="${marker}"]`)]
    }
}

export function selectHotel(context, index, options = {}) {
    const {root, state, videosContainer, descriptionsContainer, logoContainer} = context
    const {cards, logos, videos} = visibleHotelNodes(context)
    if (!cards.length) return

    const {source = null, scroll = true, behavior = "smooth"} = options
    const normalizedIndex = Math.max(0, Math.min(index, cards.length - 1))
    state.hotelKey = cards[normalizedIndex].dataset.hotelKey || ""

    root.querySelectorAll(".hotel-card.in-view").forEach((card) => card.classList.remove("in-view"))
    root.querySelectorAll(".logo-slide").forEach((logo) => {
        logo.classList.remove("is-selected")
        logo.setAttribute("aria-current", "false")
    })
    root.querySelectorAll(".videos-comp > .vimeo-video-box.is-active").forEach((video) => video.classList.remove("is-active"))
    cards[normalizedIndex].classList.add("in-view")
    logos[normalizedIndex]?.classList.add("is-selected")
    logos[normalizedIndex]?.setAttribute("aria-current", "true")
    videos[normalizedIndex]?.classList.add("is-active")
    updateProgress(context, normalizedIndex, cards.length)

    if (!scroll) return

    const descriptionsAreHorizontal = window.matchMedia("(max-width: 768px)").matches
    if (source !== videosContainer) scrollToIndex(videosContainer, normalizedIndex, true, behavior)
    if (source !== descriptionsContainer) scrollToIndex(descriptionsContainer, normalizedIndex, descriptionsAreHorizontal, behavior)

    const activeLogo = logos[normalizedIndex]
    if (activeLogo && logoContainer) {
        const targetLeft = activeLogo.offsetLeft - (logoContainer.clientWidth - activeLogo.clientWidth) / 2
        if (Math.abs(logoContainer.scrollLeft - targetLeft) >= 1) {
            logoContainer.scrollTo({left: Math.max(0, targetLeft), behavior})
        }
    }
}
