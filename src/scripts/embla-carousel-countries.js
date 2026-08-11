import EmblaCarousel from 'embla-carousel'

export default function init(container = document) {
    const root = container.matches?.('.corallium.embla-carousel')
        ? container
        : container.querySelector?.('.corallium.embla-carousel') || document.querySelector('.corallium.embla-carousel')
    if (!root || root.dataset.emblaInitialized === 'true') return

    const viewportNode = root.querySelector('.embla__viewport')
    const prevBtn = root.querySelector('.embla__btn--prev')
    const nextBtn = root.querySelector('.embla__btn--next')
    const dotsContainer = root.querySelector('.embla__pagination')
    if (!viewportNode || !prevBtn || !nextBtn || !dotsContainer) return

    root.dataset.emblaInitialized = 'true'

    const options = {
        loop: true,
        align: 'center',
        skipSnaps: false
    }

    const emblaApi = EmblaCarousel(viewportNode, options)

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

    const scrollPrev = () => emblaApi.scrollPrev()
    const scrollNext = () => emblaApi.scrollNext()

    prevBtn.addEventListener('click', scrollPrev)
    nextBtn.addEventListener('click', scrollNext)
    setupDots()
    updateActiveState()

    return () => {
        prevBtn.removeEventListener('click', scrollPrev)
        nextBtn.removeEventListener('click', scrollNext)
        emblaApi.destroy()
        delete root.dataset.emblaInitialized
    }
}
