'use client';

import { useEffect, useState } from 'react';
import type { RunsheetItemWithRelations } from '../components/RunsheetPanel';

export function useMenuPricePerPerson(items: RunsheetItemWithRelations[]) {
  const [menuPricePerPerson, setMenuPricePerPerson] = useState<Record<string, number>>({});

  useEffect(() => {
    const functionMenuIds = [
      ...new Set(
        items
          .filter(
            i =>
              i.menu_id &&
              i.menus &&
              (i.menus.menu_type === 'function' || i.menus.menu_type?.startsWith('function_')),
          )
          .map(i => i.menu_id as string),
      ),
    ];
    if (functionMenuIds.length === 0) {
      setMenuPricePerPerson({});
      return;
    }
    Promise.all(
      functionMenuIds.map(menuId =>
        fetch(`/api/menus/${menuId}/statistics`)
          .then(res => res.json())
          .then(data => {
            const pp = data?.statistics?.price_per_person;
            return { menuId, pricePerPerson: typeof pp === 'number' ? pp : 0 };
          })
          .catch(() => ({ menuId, pricePerPerson: 0 })),
      ),
    ).then(results => {
      const map: Record<string, number> = {};
      results.forEach(({ menuId, pricePerPerson }) => {
        if (menuId && pricePerPerson > 0) map[menuId] = pricePerPerson;
      });
      setMenuPricePerPerson(map);
    });
  }, [items]);

  return menuPricePerPerson;
}
