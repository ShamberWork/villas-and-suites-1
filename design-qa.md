# Carousel design QA

## Source

- Figma: https://www.figma.com/design/hMfExpB2UdZj33qJ7wJgdM/Elite-Villas?node-id=1066-62697&t=2dTOAcjai2a9xtCb-0
- Carousel component: `1066:65513`
- Desktop card component: `1066:65512`
- Mobile card component: `1066:65511`
- Desktop carousel with controls: `978:64556`
- Desktop hotel card: `978:64731`
- Mobile hotel card: `1051:75263`
- Desktop intro frame: `978:64524`
- Desktop hotel section frame: `978:64730`
- Desktop hotel logo navigation: `175:18324`
- Mobile hotel logo navigation: `1051:75270`
- Mobile country carousel frame: `1051:78785`
- Mobile hotels section: `1051:75224`

## Reference measurements

- Desktop active card: 314 × 360 px
- Desktop side card: 260 × 300 px
- Desktop gap: 48 px
- Mobile active card: 234 × 268 px
- Mobile side card: 193 × 222 px
- Mobile gap: 20 px
- Corner radius: 12 px
- Pagination: five 30 × 3 px bars with a 6 px gap
- Navigation controls: 52 × 52 px, 32 px gap, white disc, black chevron, 4 × 4 × 16 px shadow
- Initial active slide: Turkey, second pagination bar
- Desktop hotel card: 1728 × 720 px
- Mobile hotel composition: 500 px details + 360 px media at 720 px viewport
- Desktop spacing: 111 px from carousel arrows to intro text, 80 px from text to region buttons, 80 px from region buttons to hotel card

## Iterations

1. The original implementation used a generic aspect ratio, oversized active cards, gray pagination, arrow buttons, the wrong initial slide, and a Turkey image that did not match the Figma source.
2. Card dimensions, gaps, typography, overlays, image order, active state, and pagination were rebuilt from the Figma component. Carousel styles were scoped under `.corallium.embla-carousel` so they do not affect the hotel carousel.
3. Mobile QA exposed a fractional shrink in the active card. Setting cards to `flex: 0 0 auto` restored the exact 234 px width.
4. Breakpoint QA exposed a height jump between 768 and 769 px. Fluid section padding was adjusted to keep the transition continuous.
5. The first arrow export included a Figma component background and produced blue squares. It was replaced with the original Figma disc and chevron SVG layers.
6. The centered host container clipped the banner and hotel section to 1370 px. The application root and both visual sections were expanded to viewport width while inner content retained its design limits.
7. Browser measurements found 151 px above the intro, 40 px between intro text and region buttons, and 0 px below the buttons. Section padding was corrected to the Figma spacing system without changing carousel or hotel card dimensions.
8. The hotel carousel used 52 px circular controls over the media. Figma places plain chevrons at the sides of the 112 px logo row. The controls were moved to that row, the selected logo kept a white background, and desktop/mobile logo dimensions were matched to the source components.
9. At 320 px, country card dimensions scaled down but typography, radii, overlay padding, pagination, and section spacing stayed at their 720 px values. Those values now scale from the 720 px Figma frame as one system.
10. The Susesi hotel card exceeded its 500 px mobile panel: the location/map row escaped above the panel and the two actions wrapped. The location row is now anchored 30 px from the Figma frame edge, card spacing follows the source rhythm, and both actions remain in one row.

## Verification

- Desktop: 1728 × 619 px — passed
- Figma mobile component: 720 × 602 px — passed
- Narrow phone: 390 × 500 px — passed
- Breakpoint continuity: 768 and 769 px — passed
- Pagination click and active state — passed
- Country previous/next controls — passed
- Hotel previous/next controls — passed
- Banner width at 1728 px viewport — 1728 px, passed
- Hotel card width and height at 1728 px viewport — 1728 × 720 px, passed
- Mobile hotel details and media at 720 px viewport — 500 + 360 px, passed
- Horizontal viewport scrolling — prevented
- Browser console errors and warnings — none
- SCSS compilation — passed
- JavaScript syntax check — passed
- Desktop hotel logo navigation: 1336 px controls, 1229 px logo viewport, 42 px side gaps — passed
- Mobile hotel logo navigation at 720 px: 660 px controls, 544 px logo viewport, 42 px side gaps — passed
- Narrow hotel logo navigation at 320 px: proportional scaling and both controls visible — passed
- Hotel previous/next state remains stable after transitions — passed
- Yandex Maps markup, styles, controls, and JavaScript were not changed
- Project `npm run check` and `npm run build` — passed
- Mobile country carousel at 720 px: 193 × 222 px side cards, 234 × 268 px active card, 20 px gaps, 24/28 px labels — passed
- Mobile country carousel at 320 px: labels, radii, overlays, pagination, and spacing scale proportionally; all labels remain inside cards — passed
- Mobile Susesi card at 320 px: location/map row and both action buttons remain inside the 500/720 viewport-scaled panel — passed
- Desktop regression at 1728 px: 260 × 300 px side cards and 314 × 360 px active card — passed
- Browser console errors after the responsive fixes — none

## Artifacts

- `carousel-fix/qa/comparison-desktop.png`
- `carousel-fix/qa/comparison-mobile.png`
- `carousel-fix/qa/implementation-desktop-1728x619.png`
- `carousel-fix/qa/implementation-mobile-720x602.png`
- `carousel-fix/qa/implementation-phone-390x500.png`
- `carousel-fix/qa/figma-country-with-arrows-929x550.png`
- `carousel-fix/qa/implementation-country-with-arrows-cropped2.png`
- `carousel-fix/qa/comparison-country-with-arrows-final2.png`
- `carousel-fix/qa/comparison-hotel-nav-desktop.png`
- `carousel-fix/qa/comparison-hotel-nav-mobile.png`
- `carousel-fix/qa/hotel-nav-phone-final.png`
- `carousel-fix/qa/figma-country-mobile-660x295.png`
- `carousel-fix/qa/figma-hotels-mobile-720x1844.png`
- `carousel-fix/qa/comparison-country-mobile-second-fix.png`
- `carousel-fix/qa/comparison-hotel-card-mobile-second-fix.png`
- `carousel-fix/qa/country-phone-after-second-fix.png`
- `carousel-fix/qa/hotel-card-phone-after-second-fix.png`

- Carousel arrows to intro text at 1728 px viewport: 111 px, passed
- Intro text to region buttons at 1728 px viewport: 80 px, passed
- Region buttons to hotel card at 1728 px viewport: 80 px, passed
- Mobile intro and hotel spacing at 720 px viewport: 80 + 80 px, passed
- Comparison: `carousel-fix/qa/comparison-spacing-final.png`

final result: passed
