#!/usr/bin/env node

/**
 * Extract report generator sections into separate files
 */

const fs = require('fs');
const path = require('path');

const reportGeneratorPath = path.join(__dirname, '../lib/compliance/report-generator.ts');
const sectionsDir = path.join(__dirname, '../lib/compliance/report-sections');

// Ensure sections directory exists
if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
}

const content = fs.readFileSync(reportGeneratorPath, 'utf8');
const lines = content.split('\n');

// Function ranges (line numbers are 1-indexed in file, 0-indexed in array)
const functions = [
  { name: 'generateExecutiveSummary', startLine: 354, endLine: 451 },
  { name: 'generateBusinessInfo', startLine: 453, endLine: 463 },
  { name: 'generateEmployeeRoster', startLine: 465, endLine: 524 },
  { name: 'generateQualificationSummary', startLine: 526, endLine: 573 },
  { name: 'generateComplianceRecords', startLine: 574, endLine: 668 },
  { name: 'generateTemperatureLogs', startLine: 669, endLine: 719 },
  { name: 'generateCleaningRecords', startLine: 720, endLine: 778 },
  { name: 'generateTemperatureViolations', startLine: 779, endLine: 882 },
  { name: 'generateSanitizerLogs', startLine: 883, endLine: 946 },
  { name: 'generateStaffHealth', startLine: 947, endLine: 1008 },
  { name: 'generateIncidents', startLine: 1009, endLine: 1095 },
  { name: 'generateHACCP', startLine: 1096, endLine: 1171 },
  { name: 'generateAllergens', startLine: 1172, endLine: 1255 },
  { name: 'generateEquipmentMaintenance', startLine: 1256, endLine: 1325 },
  { name: 'generateWasteManagement', startLine: 1326, endLine: 1384 },
  { name: 'generateProcedures', startLine: 1385, endLine: 1466 },
  { name: 'generateSupplierVerification', startLine: 1467, endLine: 1552 },
  { name: 'generateComplianceGaps', startLine: 1553, endLine: 1610 },
];

functions.forEach(({ name, startLine, endLine }) => {
  // Extract function (convert to 0-indexed)
  const funcLines = lines.slice(startLine - 1, endLine);
  const funcContent = funcLines.join('\n');

  // Convert function name to file name (e.g., generateExecutiveSummary -> executive-summary.ts)
  const fileName = name
    .replace('generate', '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .slice(1) + '.ts';

  const filePath = path.join(sectionsDir, fileName);

  // Create file content with imports and export
  const fileContent = `/**
 * ${name.replace(/([A-Z])/g, ' $1').trim()}
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

${funcContent.replace(/^function /, 'export function ')}
`;

  fs.writeFileSync(filePath, fileContent);
  console.log(`✅ Created ${fileName} (${funcLines.length} lines)`);
});

console.log(`\n✅ Extracted ${functions.length} sections to ${sectionsDir}`);
