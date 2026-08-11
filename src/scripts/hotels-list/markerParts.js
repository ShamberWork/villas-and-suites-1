export function markerParts(marker) {
    const [country, region] = marker.split(".")
    return { country, region }
}