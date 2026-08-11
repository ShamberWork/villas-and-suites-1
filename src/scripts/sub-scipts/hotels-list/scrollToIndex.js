export function scrollToIndex(target, index, horizontal, behavior) {
    if (!target) return

    const dimension = horizontal ? target.clientWidth : target.clientHeight
    const position = horizontal ? target.scrollLeft : target.scrollTop
    const destination = index * dimension
    if (!dimension || Math.abs(position - destination) < 1) return

    target.scrollTo(horizontal
        ? { left: destination, behavior }
        : { top: destination, behavior })
}