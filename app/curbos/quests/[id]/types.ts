export interface Quest {
  id: string;
  title: string;
  description: string;
  reward_miles: number;
  quest_type: string;
  target: number;
  current_value: number;
}

export interface Transaction {
  id: string;
  order_number: number;
  total_amount: number;
  fulfillment_status: string;
  created_at: string;
  items_json: string;
}

export interface Customer {
  id: string;
  member_number?: number;
  full_name: string | null;
  current_rank: string;
  lifetime_miles: number;
  redeemable_miles: number;
  streak_count: number;
  stamp_cards: Record<string, number>;
  active_quests: Quest[];
  unlocked_regions: string[];
  avatar_url?: string;
}
