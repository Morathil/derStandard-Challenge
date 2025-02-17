import { test, expect, Page } from '@playwright/test';
import { ARTICLE } from '../src/constants/article';

test.describe('Article & Ads', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
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
      await adSlots.nth(i).scrollIntoViewIfNeeded()
      const visibleAds = await page.getByTestId('ad')
      const visibleAdsCount = await visibleAds.count()
      expect(visibleAdsCount).toBe(1)
    }
  });

  test('scroll to each paragraph => shows always 1 or 0 ad', async () => {
    var paragraphs = page.locator('[data-testid^="paragraph"]')
    var paragraphsCount = await paragraphs.count()

    for (let i = 0; i < paragraphsCount; i++) {
      await paragraphs.nth(i).scrollIntoViewIfNeeded()

      var adSlots = page.getByTestId('ad-slot')
      var adSlotsCount = await adSlots.count()

      const visibleAds = await page.getByTestId('ad')
      const visibleAdsCount = await visibleAds.count()

      // if an ad slot is visible, 1 ad should be visible
      if (adSlotsCount > 0) {
        expect(visibleAdsCount).toBe(1)
      } else {
      // if no ad slot is visible, no ad should be visible
        expect(visibleAdsCount).toBe(0)
      }
    }
  });


  // jump from paragraph to paragraph and ensure 1 ad is shown or 0 if 0 slots are in viewport
})

