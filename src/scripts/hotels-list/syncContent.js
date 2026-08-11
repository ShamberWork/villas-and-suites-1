import {countryFromSlide} from "./countryFromSlide.js"
import {selectHotel, visibleHotelNodes} from "./selectHotel.js"

export function syncContent(context, resetHotel = true, scrollHotel = true, behavior = "smooth") {
    const {countryItems, markerNodes, regionButtons, state} = context
    const marker = state.region ? `${state.country}.${state.region}` : state.country

    countryItems.forEach((item) => {
        const selected = countryFromSlide(item) === state.country
        item.setAttribute("aria-current", selected ? "true" : "false")
    })

    regionButtons.forEach((button) => {
        const selected = button.dataset.contentControl === marker
        button.classList.toggle("selected", selected)
        button.setAttribute("aria-pressed", selected ? "true" : "false")
    })

    markerNodes.forEach((node) => {
        const nodeMarker = node.dataset.contentMarker || ""
        const visible = nodeMarker.includes(".") ? nodeMarker === marker : nodeMarker === state.country
        node.classList.toggle("shown", visible)
    })

    const {cards} = visibleHotelNodes(context)
    const selectedIndex = resetHotel
        ? 0
        : Math.max(0, cards.findIndex((card) => card.dataset.hotelKey === state.hotelKey))
    selectHotel(context, selectedIndex, {scroll: scrollHotel, behavior})
}
