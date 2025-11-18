import { fetchBusinessInfo } from './fetchBusinessInfo';
import { fetchEmployees } from './fetchEmployees';
import { fetchComplianceRecords } from './fetchComplianceRecords';
import { fetchTemperatureData } from './fetchTemperatureData';
import { fetchCleaningRecords } from './fetchCleaningRecords';
import { fetchSanitizerLogs, fetchStaffHealth } from './fetchHygieneSections';
import { fetchIncidents, fetchHACCP } from './fetchSafetySections';
import { fetchAllergens, fetchEquipmentMaintenance } from './fetchComplianceSections';
import {
  fetchWasteManagement,
  fetchProcedures,
  fetchSupplierVerification,
} from './fetchOperationsSections';

/**
 * Fetch all report sections based on includeSections parameter.
 *
 * @param {string[]} includeSections - Array of section names to include
 * @param {string} complianceStartDate - Start date for compliance data
 * @param {string} tempCleaningStartDate - Start date for temperature/cleaning data
 * @param {string} endDate - End date for all data
 * @returns {Promise<any>} Report data object with all fetched sections
 */
export async function fetchReportSections(
  includeSections: string[],
  complianceStartDate: string,
  tempCleaningStartDate: string,
  endDate: string,
) {
  const reportData: any = {};
  const fetchPromises: Promise<any>[] = [];

  // 1. Business Information
  if (includeSections.includes('business') || includeSections.includes('compliance')) {
    fetchPromises.push(
      fetchBusinessInfo().then(info => {
        if (info) reportData.business_info = info;
      }),
    );
  }

  // 2. Employee Roster with Qualifications
  if (includeSections.includes('employees') || includeSections.includes('qualifications')) {
    fetchPromises.push(
      fetchEmployees().then(({ employees, qualifications }) => {
        if (employees) reportData.employees = employees;
        if (qualifications) reportData.qualifications = qualifications;
      }),
    );
  }

  // 3. Compliance Records
  if (includeSections.includes('compliance')) {
    fetchPromises.push(
      fetchComplianceRecords(complianceStartDate, endDate).then(records => {
        if (records) reportData.compliance_records = records;
      }),
    );
  }

  // 4. Temperature Logs and Violations
  if (
    includeSections.includes('temperature') ||
    includeSections.includes('temperature_violations')
  ) {
    fetchPromises.push(
      fetchTemperatureData(tempCleaningStartDate, endDate).then(({ logs, violations }) => {
        if (logs) reportData.temperature_logs = logs;
        if (violations && includeSections.includes('temperature_violations')) {
          reportData.temperature_violations = violations;
        }
      }),
    );
  }

  // 5. Cleaning Records
  if (includeSections.includes('cleaning')) {
    fetchPromises.push(
      fetchCleaningRecords(tempCleaningStartDate, endDate).then(records => {
        if (records) reportData.cleaning_records = records;
      }),
    );
  }

  // 6. Sanitizer Logs
  if (includeSections.includes('sanitizer')) {
    fetchPromises.push(
      fetchSanitizerLogs(tempCleaningStartDate, endDate).then(logs => {
        if (logs) reportData.sanitizer_logs = logs;
      }),
    );
  }

  // 7. Staff Health
  if (includeSections.includes('staff_health')) {
    fetchPromises.push(
      fetchStaffHealth(tempCleaningStartDate, endDate).then(health => {
        if (health) reportData.staff_health = health;
      }),
    );
  }

  // 8. Incidents
  if (includeSections.includes('incidents')) {
    fetchPromises.push(
      fetchIncidents(complianceStartDate, endDate).then(incidents => {
        if (incidents) reportData.incidents = incidents;
      }),
    );
  }

  // 9. HACCP
  if (includeSections.includes('haccp')) {
    fetchPromises.push(
      fetchHACCP(complianceStartDate, endDate).then(haccp => {
        if (haccp) reportData.haccp = haccp;
      }),
    );
  }

  // 10. Allergens
  if (includeSections.includes('allergens')) {
    fetchPromises.push(
      fetchAllergens(complianceStartDate, endDate).then(allergens => {
        if (allergens) reportData.allergens = allergens;
      }),
    );
  }

  // 11. Equipment Maintenance
  if (includeSections.includes('equipment')) {
    fetchPromises.push(
      fetchEquipmentMaintenance(complianceStartDate, endDate).then(maintenance => {
        if (maintenance) reportData.equipment_maintenance = maintenance;
      }),
    );
  }

  // 12. Waste Management
  if (includeSections.includes('waste')) {
    fetchPromises.push(
      fetchWasteManagement(tempCleaningStartDate, endDate).then(waste => {
        if (waste) reportData.waste_management = waste;
      }),
    );
  }

  // 13. Procedures
  if (includeSections.includes('procedures')) {
    fetchPromises.push(
      fetchProcedures().then(procedures => {
        if (procedures) reportData.procedures = procedures;
      }),
    );
  }

  // 14. Supplier Verification
  if (includeSections.includes('suppliers')) {
    fetchPromises.push(
      fetchSupplierVerification(complianceStartDate, endDate).then(verification => {
        if (verification) reportData.supplier_verification = verification;
      }),
    );
  }

  // Wait for all data fetches to complete
  await Promise.all(fetchPromises);

  return reportData;
}
