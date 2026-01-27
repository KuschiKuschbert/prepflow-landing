
import { loadEnvConfig } from '@next/env';
import { convertToStandardUnit } from '../lib/unit-conversion/standardUnitConversions';

// Load env
loadEnvConfig(process.cwd());

async function main() {
    console.log('Verifying Density-Based Conversions...');

    const tests = [
        { name: 'Water', qty: 100, unit: 'ml', expected: 100, target: 'g' }, // Density 1.0
        { name: 'Salt', qty: 5, unit: 'ml', expected: 6, target: 'g' }, // Density 1.2
        { name: 'Sugar', qty: 10, unit: 'ml', expected: 8.5, target: 'g' }, // Density 0.85
        { name: 'Flour', qty: 100, unit: 'ml', expected: 55, target: 'g' }, // Density 0.55
        // Unknown ingredient -> should stay volume
        { name: 'Unknown Goop', qty: 100, unit: 'ml', expected: 100, target: 'ml' },
        // Already weight -> no change
        { name: 'Salt', qty: 10, unit: 'g', expected: 10, target: 'g' },

        // NEW: Proteins (200ml Chicken -> ~208g RAW -> Rounds to 210g)
        { name: 'Chicken', qty: 200, unit: 'ml', expected: 210, target: 'g' },

        // NEW: Vegetables (1 cup Onion -> ~142g RAW -> Rounds to 140g)
        { name: 'Onion', qty: 1, unit: 'cup', expected: 140, target: 'g' },

        // NEW: Starches (1 cup Pasta -> ~95g -> Rounds to 95g)
        { name: 'Pasta', qty: 1, unit: 'cup', expected: 95, target: 'g' },

        // NEW: AU Localization (1 cup Capsicum -> 0.5 density -> ~118g -> Rounds to 120g)
        // Note: Parser converts "Bell Pepper" -> "Capsicum" before density lookup.
        // We simulate passing "Capsicum" directly to check density map alias.
        { name: 'Capsicum', qty: 1, unit: 'cup', expected: 120, target: 'g' },
    ];

    tests.forEach(t => {
        const result = convertToStandardUnit(t.qty, t.unit, t.name);
        console.log(`\nTest: ${t.qty}${t.unit} of ${t.name}`);
        console.log(`  -> Result: ${result.value.toFixed(2)} ${result.unit}`);

        const isTargetMatch = result.unit === t.target;
        // Allow small float variance
        const isValueMatch = Math.abs(result.value - t.expected) < 0.1;

        if (isTargetMatch && isValueMatch) {
            console.log('  ✅ PASS');
        } else {
             // For unknown goop, we expect ML, so value match is 100.
             if (t.name === 'Unknown Goop' && result.unit === 'ml' && result.value === 100) {
                 console.log('  ✅ PASS (Fallback)');
             } else {
                 console.log(`  ❌ FAIL (Expected ${t.expected} ${t.target})`);
             }
        }
    });

}

main();
