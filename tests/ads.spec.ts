import { test, expect, Page } from '@playwright/test';
import { ARTICLE } from '../src/constants/article';

test.describe('Article & Ads', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.route('**/*', async route => {
      await route.continue();
    });    
    await page.goto('http://localhost:8080/'); // Only visit once
  });
  
  test('has html title', async () => {
    await expect(page).toHaveTitle('derStandard Challenge');
  });
  
  test('has content (title, category, summary, paragraphs, images, paragraphHeader)', async () => {
    await expect(page.getByTestId('title')).toContainText('Baut China im Geheimen gerade einen der größten Kernfusionsreaktoren der Welt?');
    await expect(page.getByTestId('category')).toContainText('TECHNOLOGIE');
    await expect(page.getByTestId('summary')).toContainText('Die neue Laserfusionsanlage dürfte vor allem für Atomwaffentests relevant sein. Aber auch bei der Energiegewinnung durch Kernfusion zieht China immer weiter voran');
  
    for (let i = 0; i < ARTICLE.length; i++) {
      const content = ARTICLE[i]
      
      switch(content.type) {
        case 'paragraph':
        case 'paragraphHeader':
          await expect(page.getByTestId(`${content.type}-${i}`)).toContainText(content.text!);
          break
        case 'image':
          await expect(page.getByTestId(`${content.type}-${i}`)).toBeVisible();
      }
    }
  });

  test('has ad slots equal to paragraphs', async () => {
    const paragraphs = ARTICLE.filter((a) => a.type === 'paragraph')
    var adSlots = page.getByTestId('ad-slot')
    var adSlotsCount = await adSlots.count()

    await expect(adSlotsCount).toBe(paragraphs.length)
  });

  test('scroll to each ad => shows always 1 ad', async () => {
    var adSlots = page.getByTestId('ad-slot')
    var adSlotsCount = await adSlots.count()

    for (let i = 0; i < adSlotsCount; i++) {
      adSlots = page.getByTestId('ad-slot')
      const currentAdSlot = adSlots.nth(i)
      await currentAdSlot.scrollIntoViewIfNeeded()

      const visibleAds = page.getByTestId('ad')
      const visibleAdsCount = await visibleAds.count()

      expect(visibleAdsCount).toBe(1)
    }
  })

  // due to scrolling jumps it can be a bit less than viewport size
  test('scrolls to bottom => distances between ad container > ~viewport', async () => {
    // Scroll to the bottom of the page smoothly (by 100px)
    await page.evaluate(async () => {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      for (let i = 0; i < document.body.scrollHeight; i += 100) {
        window.scrollTo(0, i);
        await delay(50);
      }
    });

    // scroll to top again to get correct viewport distances
    await page.evaluate(() => {
      return window.scroll(0,0);
    });

    const viewportSize = await page.viewportSize()
    const adContainers = page.getByTestId('adContainer')
    const currentAdContainerCount = await adContainers.count()
    let lastY = 0

    for (let i = 0; i < currentAdContainerCount; i++) {
      const adContainer = adContainers.nth(i)
      const adContainerBoundingBox = await adContainer.boundingBox()

      if (adContainerBoundingBox && viewportSize) {
        if (i > 0) { // skip first
          const allowAbleViewportHeight = viewportSize.height - 100 // 100 scroll height
          const differenceToLastContainer = adContainerBoundingBox.y - lastY
          expect(differenceToLastContainer).toBeGreaterThan(allowAbleViewportHeight)
        }
        lastY = adContainerBoundingBox.y + adContainerBoundingBox.height
      }
    }

  })
})