# derStandard Challenge
- Start development server `npm run dev`
- Production build: `npm run build`
- `npx playwright test --ui`
- `npx playwright test`


### Steps
- Viewport Logic: (2h)
  - Use intersection observer to find out which ad slots are currently in the viewport
  - Enable an ad (first, middle, last, ...) of available ad slots in the viewport
  - As long as ad is visible disable all other ad slots in and coming into the viewport


- With parallax last ad could not be 100% visible.

### Questions:
Lt. angabe werden die Ads in die Ad Slots nach jedem Absatz befuellt, aber das Video das ich bekommen habe sieht eher so aus als ob nach jedem Absatz nur eine Transparenter Container ist wo man auf das Ad durchsieht, welches im Hintergrund fixiert positioniert wurde?
