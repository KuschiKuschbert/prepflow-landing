import type { PreviewData } from '../types';

export const menuPreview: PreviewData = {
  title: 'Spring Tasting Menu',
  subtitle: 'Seasonal Selections',
  customMeta: 'Valid until: June 30, 2024',
  content: `
    <div class="menu-section">
      <h3 class="menu-heading">Starters</h3>
      <div class="menu-item">
        <div class="menu-item-header">
          <span class="menu-item-name">Tuna Tartare</span>
          <span class="menu-item-price">$18</span>
        </div>
        <p class="menu-item-desc">Yellowfin tuna, avocado mousse, sesame crisp, citrus ponzu.</p>
      </div>
      <div class="menu-item">
        <div class="menu-item-header">
          <span class="menu-item-name">Burrata & Heirloom</span>
          <span class="menu-item-price">$22</span>
        </div>
        <p class="menu-item-desc">Local burrata, heirloom tomatoes, basil pesto, balsamic glaze.</p>
      </div>
    </div>

    <div class="menu-section">
      <h3 class="menu-heading">Mains</h3>
      <div class="menu-item">
        <div class="menu-item-header">
          <span class="menu-item-name">Pan-Seared Scallops</span>
          <span class="menu-item-price">$34</span>
        </div>
        <p class="menu-item-desc">Cauliflower purée, crispy pancetta, sage brown butter.</p>
      </div>
      <div class="menu-item">
        <div class="menu-item-header">
          <span class="menu-item-name">Wagyu Beef Burger</span>
          <span class="menu-item-price">$28</span>
        </div>
        <p class="menu-item-desc">Brioche bun, truffle mayo, aged cheddar, caramelized onions, fries.</p>
      </div>
    </div>
  `,
};
