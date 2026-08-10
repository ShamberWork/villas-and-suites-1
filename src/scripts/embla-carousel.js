import EmblaCarousel from 'embla-carousel'

export default function init() {
    const viewportNode = document.querySelector('.embla__viewport')
    const prevBtn = document.querySelector('.embla__btn--prev')
    const nextBtn = document.querySelector('.embla__btn--next')
    const dotsContainer = document.querySelector('.embla__pagination')

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
            button.addEventListener('click', () => emblaApi.scrollTo(index))
            dotsContainer.appendChild(button)
            return button
        })
    }

    const updateActiveState = () => {
        const selectedIndex = emblaApi.selectedScrollSnap()
        const slideNodes = emblaApi.slideNodes()

        slideNodes.forEach((slide, index) => {
            if (index === selectedIndex) {
                slide.classList.add('is-active')
            } else {
                slide.classList.remove('is-active')
            }
        })

        dotNodes.forEach((dot, index) => {
            if (index === selectedIndex) {
                dot.classList.add('is-active')
            } else {
                dot.classList.remove('is-active')
            }
        })
    }

    emblaApi.on('init', setupDots)
    emblaApi.on('init', updateActiveState)
    emblaApi.on('select', updateActiveState)
    emblaApi.on('reInit', setupDots)
    emblaApi.on('reInit', updateActiveState)

    prevBtn.addEventListener('click', () => emblaApi.scrollPrev())
    nextBtn.addEventListener('click', () => emblaApi.scrollNext())
}