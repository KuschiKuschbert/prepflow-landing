import { useDishesClientControllerCore } from '../DishesClient/useDishesClientControllerCore';
import type { UseDishesClientControllerResult } from './useDishesClientController.types';
import type { UseDishesClientControllerProps } from '../DishesClient/useDishesClientControllerCore';

export function useDishesClientController(
  props: UseDishesClientControllerProps = {},
): UseDishesClientControllerResult {
  return useDishesClientControllerCore(props);
}
