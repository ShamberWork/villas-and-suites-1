import {countryFromSlide} from "./sub-scipts/hotels-list/countryFromSlide.js"
import {createContext, stateKey} from "./sub-scipts/hotels-list/keys.js"
import {markerParts} from "./sub-scipts/hotels-list/markerParts.js"
import {schedule} from "./sub-scipts/hotels-list/schedule.js"
import {selectHotel, visibleHotelNodes} from "./sub-scipts/hotels-list/selectHotel.js"
import {syncContent} from "./sub-scipts/hotels-list/syncContent.js"

export default function init(container = document) {
    return schedule(() => {
        const context = createContext(container)
        if (!context) return

        const {
            root,
            state,
            countryItems,
            regionButtons,
            videosContainer,
            descriptionsContainer,
            logoContainer
        } = context
        if (!countryItems.length || !videosContainer || !descriptionsContainer || !logoContainer) return

        root[stateKey]?.destroy?.()

        const disposers = []
        const listen = (target, type, handler, options) => {
            if (!target) return
            target.addEventListener(type, handler, options)
            disposers.push(() => target.removeEventListener(type, handler, options))
        }

        const countryObserver = new MutationObserver(() => {
            const activeSlide = countryItems.find((slide) => slide.classList.contains("is-active"))
            const country = activeSlide ? countryFromSlide(activeSlide) : ""
            if (!country || country === state.country) return

            const firstRegion = regionButtons.find((button) => button.dataset.contentControl.startsWith(`${country}.`))
            state.country = country
            state.region = firstRegion?.dataset.contentControl.split(".")[1] || ""
            syncContent(context)
        })

        countryItems.forEach((item) => countryObserver.observe(item, {attributes: true, attributeFilter: ["class"]}))

        regionButtons.forEach((button) => {
            listen(button, "click", () => {
                const {country, region} = markerParts(button.dataset.contentControl)
                state.country = country
                state.region = region
                syncContent(context)
            })
        })

        listen(logoContainer, "click", (event) => {
            const logo = event.target instanceof Element ? event.target.closest(".logo-slide.shown") : null
            if (!logo) return
            const {logos} = visibleHotelNodes(context)
            selectHotel(context, logos.indexOf(logo))
        })

        logoContainer.querySelectorAll(".logo-slide").forEach((logo) => {
            logo.setAttribute("role", "button")
            logo.setAttribute("tabindex", "0")
        })

        listen(logoContainer, "keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return
            const logo = event.target instanceof Element ? event.target.closest(".logo-slide.shown") : null
            if (!logo) return
            event.preventDefault()
            const {logos} = visibleHotelNodes(context)
            selectHotel(context, logos.indexOf(logo))
        })

        const selectAdjacentHotel = (direction) => {
            const {cards} = visibleHotelNodes(context)
            if (!cards.length) return
            const selectedIndex = Math.max(0, cards.findIndex((card) => card.dataset.hotelKey === state.hotelKey))
            selectHotel(context, (selectedIndex + direction + cards.length) % cards.length)
        }

        listen(root.querySelector(".hotel-carousel-button--prev"), "click", () => selectAdjacentHotel(-1))
        listen(root.querySelector(".hotel-carousel-button--next"), "click", () => selectAdjacentHotel(1))

        let descriptionsScrollTimer
        let videosScrollTimer
        const selectFromScroll = (source, horizontal) => {
            const timer = source === videosContainer ? videosScrollTimer : descriptionsScrollTimer
            window.clearTimeout(timer)
            const nextTimer = window.setTimeout(() => {
                const position = horizontal ? source.scrollLeft : source.scrollTop
                const dimension = horizontal ? source.clientWidth : source.clientHeight
                if (dimension) selectHotel(context, Math.round(position / dimension), {source})
            }, 120)

            if (source === videosContainer) {
                videosScrollTimer = nextTimer
            } else {
                descriptionsScrollTimer = nextTimer
            }
        }

        listen(descriptionsContainer, "scroll", () => {
            selectFromScroll(descriptionsContainer, window.matchMedia("(max-width: 768px)").matches)
        }, {passive: true})
        listen(videosContainer, "scroll", () => selectFromScroll(videosContainer, true), {passive: true})

        let resizeTimer
        listen(window, "resize", () => {
            window.clearTimeout(resizeTimer)
            resizeTimer = window.setTimeout(() => {
                const {cards} = visibleHotelNodes(context)
                const selectedIndex = Math.max(0, cards.findIndex((card) => card.dataset.hotelKey === state.hotelKey))
                selectHotel(context, selectedIndex, {behavior: "auto"})
            }, 120)
        })

        listen(root, "click", (event) => {
            const mapButton = event.target instanceof Element ? event.target.closest("[data-action='ymap-toggle']") : null
            if (!mapButton) return
            const card = mapButton.closest(".hotel-card")
            const hotelName = card?.querySelector(".name")?.textContent?.trim() || ""
            const location = card?.querySelector(".location")?.childNodes[0]?.textContent?.trim() || ""
            const query = encodeURIComponent([hotelName, location].filter(Boolean).join(" "))
            window.open(`https://yandex.ru/maps/?text=${query}`, "_blank", "noopener,noreferrer")
        })

        let controller
        const destroy = () => {
            countryObserver.disconnect()
            disposers.splice(0).forEach((dispose) => dispose())
            window.clearTimeout(descriptionsScrollTimer)
            window.clearTimeout(videosScrollTimer)
            window.clearTimeout(resizeTimer)
            if (root[stateKey] === controller) {
                delete root[stateKey]
                delete root.dataset.priceHotelsInitialized
            }
        }

        controller = {state, destroy}
        root[stateKey] = controller
        root.dataset.priceHotelsInitialized = "true"
        syncContent(context, false, true, "auto")

        return destroy
    })
}
