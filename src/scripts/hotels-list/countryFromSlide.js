export function countryFromSlide(slide) {
    const title = slide.querySelector(".embla__slide__title")?.textContent?.trim().toLocaleLowerCase("ru-RU")
    if (title === "турция") return "turkey"
    if (title === "египет") return "egypt"
    return ""
}