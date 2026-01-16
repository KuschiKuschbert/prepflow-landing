/**
 * Generate executive summary from report data
 */

export function generateExecutiveSummary(reportData: unknown) {
  const expiringQualifications = reportData.qualifications?.expiring_soon?.length || 0;
  const expiredQualifications = reportData.qualifications?.expired?.length || 0;
  const expiringCompliance = reportData.compliance_records?.expiring_soon?.length || 0;
  const expiredCompliance = reportData.compliance_records?.expired?.length || 0;
  const tempViolations = reportData.temperature_violations?.total_violations || 0;
  const complianceGaps = reportData.compliance_gaps?.total_gaps || 0;
  const unresolvedIncidents = reportData.incidents?.unresolved?.length || 0;

  return {
    overall_status:
      expiredQualifications > 0 ||
      expiredCompliance > 0 ||
      tempViolations > 0 ||
      complianceGaps > 0 ||
      unresolvedIncidents > 0
        ? 'non_compliant'
        : expiringQualifications > 0 || expiringCompliance > 0 || complianceGaps > 0
          ? 'attention_required'
          : 'compliant',
    total_employees: reportData.employees?.length || 0,
    total_qualifications: reportData.qualifications?.all_qualifications?.length || 0,
    expiring_qualifications: expiringQualifications,
    expired_qualifications: expiredQualifications,
    total_compliance_records: reportData.compliance_records?.all_records?.length || 0,
    expiring_compliance: expiringCompliance,
    expired_compliance: expiredCompliance,
    temperature_logs_count: reportData.temperature_logs?.total_logs || 0,
    temperature_violations_count: tempViolations,
    cleaning_tasks_count: reportData.cleaning_records?.total_tasks || 0,
    sanitizer_logs_count: reportData.sanitizer_logs?.total_logs || 0,
    staff_health_declarations_count: reportData.staff_health?.total_declarations || 0,
    incidents_count: reportData.incidents?.total_incidents || 0,
    haccp_records_count: reportData.haccp?.total_records || 0,
    compliance_gaps_count: complianceGaps,
    alerts: [
      ...(expiredQualifications > 0
        ? [`${expiredQualifications} expired qualification(s) require immediate attention`]
        : []),
      ...(expiredCompliance > 0
        ? [`${expiredCompliance} expired compliance record(s) require immediate attention`]
        : []),
      ...(tempViolations > 0 ? [`${tempViolations} temperature violation(s) detected`] : []),
      ...(complianceGaps > 0 ? [`${complianceGaps} compliance gap(s) identified`] : []),
      ...(unresolvedIncidents > 0
        ? [`${unresolvedIncidents} unresolved incident(s) require attention`]
        : []),
      ...(expiringQualifications > 0
        ? [`${expiringQualifications} qualification(s) expiring within 90 days`]
        : []),
      ...(expiringCompliance > 0
        ? [`${expiringCompliance} compliance record(s) expiring within 90 days`]
        : []),
    ],
  };
}
