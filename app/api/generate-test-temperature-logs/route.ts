import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    console.log('🌡️ Starting temperature log generation...');

    // First, get all active equipment
    const { data: equipment, error: equipmentError } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .eq('is_active', true);

    if (equipmentError) {
      console.error('Error fetching equipment:', equipmentError);
      return NextResponse.json({ 
        error: 'Failed to fetch equipment',
        message: equipmentError.message 
      }, { status: 500 });
    }

    if (!equipment || equipment.length === 0) {
      return NextResponse.json({ 
        error: 'No active equipment found',
        message: 'Please add some temperature equipment first in the setup page'
      }, { status: 400 });
    }

    console.log(`📊 Found ${equipment.length} active equipment items`);

    // Generate data for the last 3 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    const temperatureLogs = [];
    const foodItems = [
      'Chicken Curry', 'Beef Stew', 'Vegetable Soup', 'Pasta Sauce', 'Rice Pilaf',
      'Mashed Potatoes', 'Gravy', 'Mac & Cheese', 'Chili', 'Stir Fry',
      'Salad Bar Mix', 'Coleslaw', 'Potato Salad', 'Fruit Salad', 'Caesar Salad',
      'Sandwich Fillings', 'Deli Meats', 'Cheese Platter', 'Hummus', 'Tzatziki'
    ];

    const staffMembers = [
      'Chef Sarah', 'Chef Mike', 'Chef Emma', 'Chef James', 'Chef Lisa',
      'Sous Chef Tom', 'Line Cook Alex', 'Prep Cook Sam', 'Kitchen Manager Kim'
    ];

    // Generate logs for each day
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Include weekends for more comprehensive data
      // if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      //   continue;
      // }

      // Generate 2 entries per day for each equipment (morning and evening)
      for (const item of equipment) {
        // Morning entry (randomized between 7:00-9:00 AM)
        const morningHour = 7 + Math.floor(Math.random() * 3);
        const morningMinute = Math.floor(Math.random() * 60);
        const morningTime = `${morningHour.toString().padStart(2, '0')}:${morningMinute.toString().padStart(2, '0')}`;
        const morningTemp = generateRealisticTemperature(item, 'morning');
        
        temperatureLogs.push({
          log_date: dateStr,
          log_time: morningTime,
          temperature_celsius: morningTemp,
          temperature_type: item.equipment_type,
          location: item.name,
          notes: `Morning temperature check - ${getTemperatureStatusText(morningTemp, item)}`,
          logged_by: staffMembers[Math.floor(Math.random() * staffMembers.length)],
          created_at: new Date(`${dateStr}T${morningTime}:00`).toISOString()
        });

        // Evening entry (randomized between 5:00-7:00 PM)
        const eveningHour = 17 + Math.floor(Math.random() * 3);
        const eveningMinute = Math.floor(Math.random() * 60);
        const eveningTime = `${eveningHour.toString().padStart(2, '0')}:${eveningMinute.toString().padStart(2, '0')}`;
        const eveningTemp = generateRealisticTemperature(item, 'evening');
        
        temperatureLogs.push({
          log_date: dateStr,
          log_time: eveningTime,
          temperature_celsius: eveningTemp,
          temperature_type: item.equipment_type,
          location: item.name,
          notes: `Evening temperature check - ${getTemperatureStatusText(eveningTemp, item)}`,
          logged_by: staffMembers[Math.floor(Math.random() * staffMembers.length)],
          created_at: new Date(`${dateStr}T${eveningTime}:00`).toISOString()
        });
      }

      // Generate hot holding food items (2 entries per day)
      const hotHoldingItems = [
        'Chicken Curry', 'Beef Stew', 'Vegetable Soup', 'Pasta Sauce', 'Rice Pilaf'
      ];

      for (let i = 0; i < 2; i++) {
        const foodItem = hotHoldingItems[Math.floor(Math.random() * hotHoldingItems.length)];
        // Randomize times around lunch (11:30-13:30) and afternoon (14:30-16:30)
        const baseHour = i === 0 ? 11 : 14;
        const hour = baseHour + Math.floor(Math.random() * 2);
        const minute = Math.floor(Math.random() * 60);
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const temp = generateFoodTemperature('hot_holding');
        
        temperatureLogs.push({
          log_date: dateStr,
          log_time: time,
          temperature_celsius: temp,
          temperature_type: 'food_hot_holding',
          location: foodItem,
          notes: `Hot holding temperature check - ${getFoodSafetyStatusText(temp)}`,
          logged_by: staffMembers[Math.floor(Math.random() * staffMembers.length)],
          created_at: new Date(`${dateStr}T${time}:00`).toISOString()
        });
      }

      // Generate cold holding food items (2 entries per day)
      const coldHoldingItems = [
        'Salad Bar Mix', 'Coleslaw', 'Potato Salad', 'Fruit Salad', 'Caesar Salad'
      ];

      for (let i = 0; i < 2; i++) {
        const foodItem = coldHoldingItems[Math.floor(Math.random() * coldHoldingItems.length)];
        // Randomize times around pre-lunch (10:30-12:30) and afternoon (15:30-17:30)
        const baseHour = i === 0 ? 10 : 15;
        const hour = baseHour + Math.floor(Math.random() * 2);
        const minute = Math.floor(Math.random() * 60);
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const temp = generateFoodTemperature('cold_holding');
        
        temperatureLogs.push({
          log_date: dateStr,
          log_time: time,
          temperature_celsius: temp,
          temperature_type: 'food_cold_holding',
          location: foodItem,
          notes: `Cold holding temperature check - ${getFoodSafetyStatusText(temp)}`,
          logged_by: staffMembers[Math.floor(Math.random() * staffMembers.length)],
          created_at: new Date(`${dateStr}T${time}:00`).toISOString()
        });
      }

      // Generate cooking food items (1 entry per day)
      const cookingItems = [
        'Chicken Breast', 'Salmon Fillet', 'Beef Tenderloin', 'Pork Chops', 'Vegetable Medley'
      ];

      const cookingItem = cookingItems[Math.floor(Math.random() * cookingItems.length)];
      // Randomize cooking time around afternoon (13:30-15:30)
      const cookingHour = 13 + Math.floor(Math.random() * 2);
      const cookingMinute = Math.floor(Math.random() * 60);
      const cookingTime = `${cookingHour.toString().padStart(2, '0')}:${cookingMinute.toString().padStart(2, '0')}`;
      const cookingTemp = generateFoodTemperature('cooking');
      
      temperatureLogs.push({
        log_date: dateStr,
        log_time: cookingTime,
        temperature_celsius: cookingTemp,
        temperature_type: 'food_cooking',
        location: cookingItem,
        notes: `Cooking temperature check - ${getFoodSafetyStatusText(cookingTemp)}`,
        logged_by: staffMembers[Math.floor(Math.random() * staffMembers.length)],
        created_at: new Date(`${dateStr}T${cookingTime}:00`).toISOString()
      });
    }

    console.log(`📝 Generated ${temperatureLogs.length} temperature log entries`);

    // Insert logs in batches to avoid overwhelming the database
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < temperatureLogs.length; i += batchSize) {
      const batch = temperatureLogs.slice(i, i + batchSize);
      
      const { error: insertError } = await supabaseAdmin
        .from('temperature_logs')
        .insert(batch);

      if (insertError) {
        console.error('Error inserting batch:', insertError);
        return NextResponse.json({ 
          error: 'Failed to insert temperature logs',
          message: insertError.message,
          insertedCount 
        }, { status: 500 });
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(temperatureLogs.length / batchSize)} (${insertedCount}/${temperatureLogs.length} logs)`);
    }

    console.log(`🎉 Successfully generated ${insertedCount} temperature log entries`);

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${insertedCount} temperature log entries for the last 3 months`,
      data: {
        totalLogs: insertedCount,
        equipmentCount: equipment.length,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        },
        breakdown: {
          equipmentLogs: equipment.length * 2 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          hotHoldingLogs: 2 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          coldHoldingLogs: 2 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          cookingLogs: 1 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        }
      }
    });

  } catch (error) {
    console.error('Error generating temperature logs:', error);
    return NextResponse.json({ 
      error: 'Failed to generate temperature logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to generate realistic temperatures based on equipment type and time
function generateRealisticTemperature(equipment: any, timeOfDay: 'morning' | 'evening'): number {
  const { equipment_type, min_temp_celsius, max_temp_celsius } = equipment;
  
  let baseTemp: number;
  let variation: number;

  switch (equipment_type) {
    case 'fridge':
    case 'walk_in_cooler':
    case 'reach_in_cooler':
      baseTemp = 4; // 4°C
      variation = 2; // ±2°C
      break;
    case 'freezer':
    case 'walk_in_freezer':
      baseTemp = -18; // -18°C
      variation = 3; // ±3°C
      break;
    case 'bain_marie':
      baseTemp = 75; // 75°C
      variation = 5; // ±5°C
      break;
    case 'hot_cabinet':
      baseTemp = 65; // 65°C
      variation = 5; // ±5°C
      break;
    default:
      baseTemp = (min_temp_celsius + max_temp_celsius) / 2;
      variation = (max_temp_celsius - min_temp_celsius) / 4;
  }

  // Add time-of-day variation (equipment might be slightly warmer in evening)
  const timeVariation = timeOfDay === 'evening' ? 0.5 : 0;
  
  // Add some randomness
  const randomVariation = (Math.random() - 0.5) * variation;
  
  const finalTemp = baseTemp + timeVariation + randomVariation;
  
  // Ensure temperature is within reasonable bounds
  if (min_temp_celsius && max_temp_celsius) {
    return Math.max(min_temp_celsius - 2, Math.min(max_temp_celsius + 2, finalTemp));
  }
  
  return Math.round(finalTemp * 10) / 10; // Round to 1 decimal place
}

// Helper function to generate food temperatures
function generateFoodTemperature(type: 'hot_holding' | 'cold_holding' | 'cooking'): number {
  switch (type) {
    case 'hot_holding':
      return 65 + (Math.random() - 0.5) * 10; // 60-70°C
    case 'cold_holding':
      return 3 + (Math.random() - 0.5) * 4; // 1-5°C
    case 'cooking':
      return 75 + (Math.random() - 0.5) * 10; // 70-80°C
    default:
      return 20;
  }
}

// Helper function to get temperature status text
function getTemperatureStatusText(temp: number, equipment: any): string {
  if (equipment.min_temp_celsius && equipment.max_temp_celsius) {
    if (temp < equipment.min_temp_celsius) {
      return 'Below minimum range';
    } else if (temp > equipment.max_temp_celsius) {
      return 'Above maximum range';
    } else {
      return 'Within safe range';
    }
  }
  return 'Temperature logged';
}

// Helper function to get food safety status text
function getFoodSafetyStatusText(temp: number): string {
  if (temp < 5) {
    return 'Safe - below danger zone';
  } else if (temp > 60) {
    return 'Safe - above danger zone';
  } else {
    return 'In danger zone - monitor closely';
  }
}
