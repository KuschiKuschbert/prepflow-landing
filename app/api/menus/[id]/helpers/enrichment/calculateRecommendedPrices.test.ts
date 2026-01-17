import { RawMenuItem } from '../../../types';
import { calculateDishSellingPrice } from '../../statistics/helpers/calculateDishSellingPrice';
import { calculateRecipeSellingPrice } from '../../statistics/helpers/calculateRecipeSellingPrice';
import { calculateRecommendedPrice } from './calculateRecommendedPrices';

// Mock dependencies
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock('../../items/[itemId]/helpers/cacheRecommendedPrice', () => ({
  cacheRecommendedPrice: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../statistics/helpers/calculateDishSellingPrice', () => ({
  calculateDishSellingPrice: jest.fn(),
}));

jest.mock('../../statistics/helpers/calculateRecipeSellingPrice', () => ({
  calculateRecipeSellingPrice: jest.fn(),
}));

describe('calculateRecommendedPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItemBase: Partial<RawMenuItem> = {
    id: 'item-1',
  };

  it('should return existing recommended price if present and columns exist', async () => {
    const item = { ...mockItemBase, recommended_selling_price: 15.0 } as RawMenuItem;
    const result = await calculateRecommendedPrice(item, 'menu-1', true);
    expect(result).toBe(15.0);
    expect(calculateDishSellingPrice).not.toHaveBeenCalled();
    expect(calculateRecipeSellingPrice).not.toHaveBeenCalled();
  });

  it('should calculate dish price if no existing price', async () => {
    const item = {
      ...mockItemBase,
      dish_id: 'dish-1',
      dishes: { id: 'dish-1' },
      recommended_selling_price: null,
    } as unknown as RawMenuItem;

    (calculateDishSellingPrice as jest.Mock).mockResolvedValue(20.0);

    const result = await calculateRecommendedPrice(item, 'menu-1', true);
    expect(result).toBe(20.0);
    expect(calculateDishSellingPrice).toHaveBeenCalledWith('dish-1');
    // Check background caching was triggered (difficult to await, but jest mocks capture it)
    // We can simulate waiting for promise queue if needed, but for now just checks duplication logic
  });

  it('should calculate recipe price if no existing price and no dish', async () => {
    const item = {
      ...mockItemBase,
      recipe_id: 'recipe-1',
      recommended_selling_price: null,
    } as RawMenuItem;

    (calculateRecipeSellingPrice as jest.Mock).mockResolvedValue(12.5);

    const result = await calculateRecommendedPrice(item, 'menu-1', true);
    expect(result).toBe(12.5);
    expect(calculateRecipeSellingPrice).toHaveBeenCalledWith('recipe-1');
  });

  it('should return null if no ID matches', async () => {
    const item = { ...mockItemBase, recommended_selling_price: null } as RawMenuItem;
    const result = await calculateRecommendedPrice(item, 'menu-1', true);
    expect(result).toBeNull();
  });
});
