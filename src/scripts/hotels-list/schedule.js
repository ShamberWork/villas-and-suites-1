export function schedule(callback) {
    let cleanup
    let timer

    const run = () => {
        cleanup = callback()
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true })
    } else {
        timer = window.setTimeout(run, 0)
    }

    return () => {
        document.removeEventListener("DOMContentLoaded", run)
        window.clearTimeout(timer)
        cleanup?.()
    }
}
