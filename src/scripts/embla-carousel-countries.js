import EmblaCarousel from 'embla-carousel'

export default function init(container = document) {
    const root = container.matches?.('.corallium.embla-carousel')
        ? container
        : container.querySelector?.('.corallium.embla-carousel') || document.querySelector('.corallium.embla-carousel')
    if (!root || root.dataset.emblaInitialized === 'true') return

    const viewportNode = root.querySelector('.embla__viewport')
    const dotsContainer = root.querySelector('.embla__pagination')
    const prevButton = root.querySelector('.embla__button--prev')
    const nextButton = root.querySelector('.embla__button--next')
    if (!viewportNode || !dotsContainer) return

    root.dataset.emblaInitialized = 'true'

    const emblaApi = EmblaCarousel(viewportNode, {
        loop: true,
        align: 'center',
        startIndex: 1,
        skipSnaps: false
    })

    let dotNodes = []

    const setupDots = () => {
        const scrollSnaps = emblaApi.scrollSnapList()

        dotsContainer.innerHTML = ''
        dotNodes = scrollSnaps.map((_, index) => {
            const button = document.createElement('button')
            button.classList.add('embla__dot')
            button.type = 'button'
            button.setAttribute('aria-label', `Перейти к стране ${index + 1}`)
            button.addEventListener('click', () => emblaApi.scrollTo(index))
            dotsContainer.appendChild(button)
            return button
        })
    }

    const updateActiveState = () => {
        const selectedIndex = emblaApi.selectedScrollSnap()
        const slideNodes = emblaApi.slideNodes()

        slideNodes.forEach((slide, index) => {
            const selected = index === selectedIndex
            slide.classList.toggle('is-active', selected)
            slide.setAttribute('aria-current', selected ? 'true' : 'false')
        })

        dotNodes.forEach((dot, index) => {
            const selected = index === selectedIndex
            dot.classList.toggle('is-active', selected)
            dot.setAttribute('aria-current', selected ? 'true' : 'false')
        })
    }

    emblaApi.on('select', updateActiveState)
    emblaApi.on('reInit', setupDots)
    emblaApi.on('reInit', updateActiveState)

    prevButton?.addEventListener('click', emblaApi.scrollPrev)
    nextButton?.addEventListener('click', emblaApi.scrollNext)

    setupDots()
    updateActiveState()

    return () => {
        prevButton?.removeEventListener('click', emblaApi.scrollPrev)
        nextButton?.removeEventListener('click', emblaApi.scrollNext)
        emblaApi.destroy()
        delete root.dataset.emblaInitialized
    }
}
