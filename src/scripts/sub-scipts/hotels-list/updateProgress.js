export function updateProgress(context, index, total) {
    const progress = context.root.querySelector(".descriptions-comp .progress-indicator")
    const indicator = progress?.querySelector(".indicator")
    if (!progress || !indicator || total < 2) {
        if (progress) progress.hidden = true
        return
    }

    const horizontal = window.matchMedia("(max-width: 768px)").matches
    progress.hidden = false
    progress.style.top = horizontal ? "auto" : "0"
    progress.style.right = "0"
    progress.style.bottom = "0"
    progress.style.left = horizontal ? "0" : "auto"
    progress.style.width = horizontal ? "100%" : "4px"
    progress.style.height = horizontal ? "4px" : "100%"
    indicator.style.width = horizontal ? `${100 / total}%` : "100%"
    indicator.style.height = horizontal ? "100%" : `${100 / total}%`
    indicator.style.left = horizontal ? `${index * 100 / total}%` : "0"
    indicator.style.top = horizontal ? "0" : `${index * 100 / total}%`
}
