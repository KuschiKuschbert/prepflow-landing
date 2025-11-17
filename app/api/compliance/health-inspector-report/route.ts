import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const EMPLOYEE_SELECT = `
  *,
  employee_qualifications (
    *,
    qualification_types (
      id,
      name,
      description,
      is_required,
      default_expiry_days
    )
  )
`;

const COMPLIANCE_TYPES_SELECT = `
  *,
  compliance_types (
    id,
    type_name,
    name,
    description,
    renewal_frequency_days
  )
`;

/**
 * GET /api/compliance/health-inspector-report
 * Generate comprehensive health inspector report aggregating data from multiple sources
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date') || new Date().toISOString().split('T')[0];
    const includeSections = searchParams.get('include_sections')?.split(',') || [
      'business',
      'employees',
      'qualifications',
      'compliance',
      'temperature',
      'temperature_violations',
      'cleaning',
      'sanitizer',
      'staff_health',
      'incidents',
      'haccp',
      'allergens',
      'equipment',
      'waste',
      'procedures',
      'suppliers',
      'compliance_gaps',
      'summary',
    ];

    // Calculate default start dates
    const complianceStartDate =
      startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 12 months ago
    const tempCleaningStartDate =
      startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days ago

    const reportData: any = {
      generated_at: new Date().toISOString(),
      report_period: {
        start_date: complianceStartDate,
        end_date: endDate,
      },
    };

    // 1. Business Information (from compliance records - licenses, etc.)
    if (includeSections.includes('business') || includeSections.includes('compliance')) {
      const { data: complianceRecords, error: complianceError } = await supabaseAdmin
        .from('compliance_records')
        .select(COMPLIANCE_TYPES_SELECT)
        .eq('status', 'active')
        .order('expiry_date', { ascending: true });

      if (!complianceError) {
        reportData.business_info = {
          active_licenses:
            complianceRecords?.filter(r => {
              const typeName = r.compliance_types?.type_name || r.compliance_types?.name || '';
              return typeName.toLowerCase().includes('license');
            }) || [],
          total_compliance_records: complianceRecords?.length || 0,
        };
      }
    }

    // 2. Employee Roster with Qualifications
    if (includeSections.includes('employees') || includeSections.includes('qualifications')) {
      const { data: employees, error: employeesError } = await supabaseAdmin
        .from('employees')
        .select(EMPLOYEE_SELECT)
        .eq('status', 'active')
        .order('full_name');

      if (!employeesError) {
        reportData.employees = employees || [];

        // Qualification Summary
        const allQualifications: any[] = [];
        employees?.forEach(emp => {
          if (emp.employee_qualifications) {
            emp.employee_qualifications.forEach((qual: any) => {
              allQualifications.push({
                employee_name: emp.full_name,
                employee_role: emp.role,
                ...qual,
              });
            });
          }
        });

        reportData.qualifications = {
          all_qualifications: allQualifications,
          expiring_soon: allQualifications.filter(qual => {
            if (!qual.expiry_date) return false;
            const expiry = new Date(qual.expiry_date);
            const today = new Date();
            const daysUntilExpiry = Math.ceil(
              (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );
            return daysUntilExpiry > 0 && daysUntilExpiry <= 90; // Expiring within 90 days
          }),
          expired: allQualifications.filter(qual => {
            if (!qual.expiry_date) return false;
            return new Date(qual.expiry_date) < new Date();
          }),
        };
      }
    }

    // 3. Compliance Records
    if (includeSections.includes('compliance')) {
      const { data: complianceRecords, error: complianceError } = await supabaseAdmin
        .from('compliance_records')
        .select(COMPLIANCE_TYPES_SELECT)
        .gte('created_at', `${complianceStartDate}T00:00:00Z`)
        .lte('created_at', `${endDate}T23:59:59Z`)
        .order('expiry_date', { ascending: true });

      if (!complianceError) {
        reportData.compliance_records = {
          all_records: complianceRecords || [],
          active: complianceRecords?.filter(r => r.status === 'active') || [],
          expiring_soon:
            complianceRecords?.filter(r => {
              if (!r.expiry_date) return false;
              const expiry = new Date(r.expiry_date);
              const today = new Date();
              const daysUntilExpiry = Math.ceil(
                (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
              );
              return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
            }) || [],
          expired:
            complianceRecords?.filter(r => {
              if (!r.expiry_date) return false;
              return new Date(r.expiry_date) < new Date();
            }) || [],
        };
      }
    }

    // 4. Temperature Logs (last 30 days) with Violation Analysis
    if (
      includeSections.includes('temperature') ||
      includeSections.includes('temperature_violations')
    ) {
      // Get temperature equipment thresholds
      const { data: equipment, error: equipmentError } = await supabaseAdmin
        .from('temperature_equipment')
        .select('*')
        .eq('is_active', true);

      const equipmentMap = new Map();
      equipment?.forEach(eq => {
        equipmentMap.set(eq.name?.toLowerCase() || eq.location?.toLowerCase(), {
          min: eq.min_temp_celsius,
          max: eq.max_temp_celsius,
          type: eq.equipment_type,
        });
      });

      const { data: temperatureLogs, error: tempError } = await supabaseAdmin
        .from('temperature_logs')
        .select('*')
        .gte('log_date', tempCleaningStartDate)
        .lte('log_date', endDate)
        .order('log_date', { ascending: false })
        .order('log_time', { ascending: false })
        .limit(500);

      if (!tempError) {
        const logs = temperatureLogs || [];

        // Analyze violations
        const violations: any[] = [];
        const dangerZoneViolations: any[] = [];

        logs.forEach(log => {
          const temp = parseFloat(log.temperature_celsius);
          const location = log.location?.toLowerCase() || log.temperature_type?.toLowerCase();
          const eq = equipmentMap.get(location);

          // Check for out-of-range violations
          if (eq) {
            if (eq.min !== null && temp < eq.min) {
              violations.push({
                ...log,
                violation_type: 'below_minimum',
                threshold: eq.min,
                deviation: (eq.min - temp).toFixed(2),
              });
            }
            if (eq.max !== null && temp > eq.max) {
              violations.push({
                ...log,
                violation_type: 'above_maximum',
                threshold: eq.max,
                deviation: (temp - eq.max).toFixed(2),
              });
            }
          }

          // Check for danger zone (5°C to 60°C for cold/hot holding)
          if (temp >= 5 && temp <= 60) {
            if (log.temperature_type === 'fridge' || log.temperature_type === 'storage') {
              dangerZoneViolations.push({
                ...log,
                violation_type: 'danger_zone',
                time_in_zone: 'Unknown', // Would need sequential logs to calculate
              });
            }
          }
        });

        reportData.temperature_logs = {
          logs: logs,
          total_logs: logs.length,
          date_range: {
            start: tempCleaningStartDate,
            end: endDate,
          },
        };

        if (includeSections.includes('temperature_violations')) {
          reportData.temperature_violations = {
            total_violations: violations.length + dangerZoneViolations.length,
            out_of_range: violations,
            danger_zone: dangerZoneViolations,
            violation_summary: {
              below_minimum: violations.filter(v => v.violation_type === 'below_minimum').length,
              above_maximum: violations.filter(v => v.violation_type === 'above_maximum').length,
              danger_zone_count: dangerZoneViolations.length,
            },
          };
        }
      }
    }

    // 5. Cleaning Records (last 30 days)
    if (includeSections.includes('cleaning')) {
      const CLEANING_AREAS_SELECT = `
        *,
        cleaning_areas (
          id,
          name,
          description,
          frequency_days
        )
      `;

      const { data: cleaningTasks, error: cleaningError } = await supabaseAdmin
        .from('cleaning_tasks')
        .select(CLEANING_AREAS_SELECT)
        .gte('assigned_date', tempCleaningStartDate)
        .lte('assigned_date', endDate)
        .order('assigned_date', { ascending: false })
        .limit(500); // Limit to most recent 500 tasks

      if (!cleaningError) {
        reportData.cleaning_records = {
          tasks: cleaningTasks || [],
          completed: cleaningTasks?.filter(t => t.status === 'completed') || [],
          pending: cleaningTasks?.filter(t => t.status === 'pending') || [],
          overdue: cleaningTasks?.filter(t => t.status === 'overdue') || [],
          total_tasks: cleaningTasks?.length || 0,
          date_range: {
            start: tempCleaningStartDate,
            end: endDate,
          },
        };
      }
    }

    // 7. Sanitizer Logs
    if (includeSections.includes('sanitizer')) {
      const { data: sanitizerLogs, error: sanitizerError } = await supabaseAdmin
        .from('sanitizer_logs')
        .select('*')
        .gte('log_date', tempCleaningStartDate)
        .lte('log_date', endDate)
        .order('log_date', { ascending: false })
        .order('log_time', { ascending: false })
        .limit(200);

      if (!sanitizerError) {
        const logs = sanitizerLogs || [];
        reportData.sanitizer_logs = {
          logs: logs,
          total_logs: logs.length,
          out_of_range: logs.filter(l => !l.is_within_range),
          date_range: {
            start: tempCleaningStartDate,
            end: endDate,
          },
        };
      }
    }

    // 8. Staff Health Declarations
    if (includeSections.includes('staff_health')) {
      const { data: healthDeclarations, error: healthError } = await supabaseAdmin
        .from('staff_health_declarations')
        .select('*, employees(full_name, role)')
        .gte('declaration_date', tempCleaningStartDate)
        .lte('declaration_date', endDate)
        .order('declaration_date', { ascending: false })
        .limit(200);

      if (!healthError) {
        const declarations = healthDeclarations || [];
        reportData.staff_health = {
          declarations: declarations,
          total_declarations: declarations.length,
          unhealthy_count: declarations.filter(d => !d.is_healthy).length,
          excluded_count: declarations.filter(d => d.excluded_from_work).length,
          date_range: {
            start: tempCleaningStartDate,
            end: endDate,
          },
        };
      }
    }

    // 9. Incident Reports
    if (includeSections.includes('incidents')) {
      const { data: incidents, error: incidentsError } = await supabaseAdmin
        .from('incident_reports')
        .select('*')
        .gte('incident_date', complianceStartDate)
        .lte('incident_date', endDate)
        .order('incident_date', { ascending: false })
        .order('severity', { ascending: false })
        .limit(100);

      if (!incidentsError) {
        const incidentList = incidents || [];
        reportData.incidents = {
          incidents: incidentList,
          total_incidents: incidentList.length,
          by_severity: {
            critical: incidentList.filter(i => i.severity === 'critical').length,
            high: incidentList.filter(i => i.severity === 'high').length,
            medium: incidentList.filter(i => i.severity === 'medium').length,
            low: incidentList.filter(i => i.severity === 'low').length,
          },
          by_status: {
            open: incidentList.filter(i => i.status === 'open').length,
            investigating: incidentList.filter(i => i.status === 'investigating').length,
            resolved: incidentList.filter(i => i.status === 'resolved').length,
            closed: incidentList.filter(i => i.status === 'closed').length,
          },
          unresolved: incidentList.filter(i => i.status !== 'closed' && i.status !== 'resolved'),
        };
      }
    }

    // 10. HACCP Records
    if (includeSections.includes('haccp')) {
      const { data: haccpRecords, error: haccpError } = await supabaseAdmin
        .from('haccp_records')
        .select('*')
        .gte('record_date', complianceStartDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: false })
        .limit(200);

      if (!haccpError) {
        const records = haccpRecords || [];
        reportData.haccp = {
          records: records,
          total_records: records.length,
          out_of_limit: records.filter(r => !r.is_within_limit),
          by_step: records.reduce((acc: any, r) => {
            acc[r.haccp_step] = (acc[r.haccp_step] || 0) + 1;
            return acc;
          }, {}),
        };
      }
    }

    // 11. Allergen Management
    if (includeSections.includes('allergens')) {
      const { data: allergenRecords, error: allergenError } = await supabaseAdmin
        .from('allergen_records')
        .select('*')
        .gte('record_date', complianceStartDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: false })
        .limit(200);

      if (!allergenError) {
        const records = allergenRecords || [];
        reportData.allergens = {
          records: records,
          total_records: records.length,
          inaccurate_declarations: records.filter(r => !r.is_accurate),
          high_risk_items: records.filter(r => r.cross_contamination_risk === 'high'),
        };
      }
    }

    // 12. Equipment Maintenance
    if (includeSections.includes('equipment')) {
      const { data: maintenance, error: maintenanceError } = await supabaseAdmin
        .from('equipment_maintenance')
        .select('*')
        .gte('maintenance_date', complianceStartDate)
        .lte('maintenance_date', endDate)
        .order('maintenance_date', { ascending: false })
        .limit(200);

      if (!maintenanceError) {
        const maintenanceRecords = maintenance || [];
        reportData.equipment_maintenance = {
          records: maintenanceRecords,
          total_records: maintenanceRecords.length,
          critical_equipment: maintenanceRecords.filter(m => m.is_critical),
          overdue_maintenance: maintenanceRecords.filter(m => {
            if (!m.next_maintenance_date) return false;
            return new Date(m.next_maintenance_date) < new Date();
          }),
        };
      }
    }

    // 13. Waste Management
    if (includeSections.includes('waste')) {
      const { data: wasteLogs, error: wasteError } = await supabaseAdmin
        .from('waste_management_logs')
        .select('*')
        .gte('log_date', tempCleaningStartDate)
        .lte('log_date', endDate)
        .order('log_date', { ascending: false })
        .limit(200);

      if (!wasteError) {
        const logs = wasteLogs || [];
        reportData.waste_management = {
          logs: logs,
          total_logs: logs.length,
          by_type: logs.reduce((acc: any, l) => {
            acc[l.waste_type] = (acc[l.waste_type] || 0) + 1;
            return acc;
          }, {}),
        };
      }
    }

    // 14. Food Safety Procedures
    if (includeSections.includes('procedures')) {
      const { data: procedures, error: proceduresError } = await supabaseAdmin
        .from('food_safety_procedures')
        .select('*')
        .eq('is_active', true)
        .order('procedure_type');

      if (!proceduresError) {
        const procedureList = procedures || [];
        reportData.procedures = {
          procedures: procedureList,
          total_procedures: procedureList.length,
          overdue_reviews: procedureList.filter(p => {
            if (!p.next_review_date) return false;
            return new Date(p.next_review_date) < new Date();
          }),
          by_type: procedureList.reduce((acc: any, p) => {
            acc[p.procedure_type] = (acc[p.procedure_type] || 0) + 1;
            return acc;
          }, {}),
        };
      }
    }

    // 15. Supplier Verification
    if (includeSections.includes('suppliers')) {
      const SUPPLIER_SELECT = `
        *,
        suppliers (
          id,
          supplier_name,
          contact_person,
          email,
          phone
        )
      `;

      const { data: supplierVerification, error: supplierError } = await supabaseAdmin
        .from('supplier_verification')
        .select(SUPPLIER_SELECT)
        .gte('verification_date', complianceStartDate)
        .lte('verification_date', endDate)
        .order('verification_date', { ascending: false })
        .limit(200);

      if (!supplierError) {
        const verifications = supplierVerification || [];
        reportData.supplier_verification = {
          verifications: verifications,
          total_verifications: verifications.length,
          invalid_certificates: verifications.filter(v => !v.is_valid),
          expired_certificates: verifications.filter(v => {
            if (!v.expiry_date) return false;
            return new Date(v.expiry_date) < new Date();
          }),
        };
      }
    }

    // 16. Compliance Gaps Analysis
    if (includeSections.includes('compliance_gaps')) {
      const gaps: any[] = [];

      // Check for missing required qualifications
      if (reportData.employees) {
        const requiredQuals = ['Food Safety Supervisor', 'Food Handler'];
        reportData.employees.forEach((emp: any) => {
          const empQuals = (emp.employee_qualifications || []).map(
            (q: any) => q.qualification_types?.name?.toLowerCase() || '',
          );

          requiredQuals.forEach(reqQual => {
            const hasQual = empQuals.some((q: string) => q.includes(reqQual.toLowerCase()));

            if (!hasQual) {
              gaps.push({
                type: 'missing_qualification',
                severity: 'high',
                employee_name: emp.full_name,
                employee_role: emp.role,
                missing_item: reqQual,
                description: `${emp.full_name} (${emp.role}) is missing required ${reqQual} certificate`,
              });
            }
          });
        });
      }

      // Check for missing critical compliance records
      if (reportData.compliance_records) {
        const criticalTypes = ['Food License', 'Council Registration', 'Pest Control'];
        const activeTypes = (reportData.compliance_records.active || []).map((r: any) =>
          (r.compliance_types?.type_name || r.compliance_types?.name || '').toLowerCase(),
        );

        criticalTypes.forEach(criticalType => {
          const hasType = activeTypes.some((t: string) => t.includes(criticalType.toLowerCase()));

          if (!hasType) {
            gaps.push({
              type: 'missing_compliance_record',
              severity: 'critical',
              missing_item: criticalType,
              description: `Missing active ${criticalType} compliance record`,
            });
          }
        });
      }

      // Check for temperature violations
      if (reportData.temperature_violations?.total_violations > 0) {
        gaps.push({
          type: 'temperature_violations',
          severity: 'high',
          count: reportData.temperature_violations.total_violations,
          description: `${reportData.temperature_violations.total_violations} temperature violation(s) detected`,
        });
      }

      // Check for unresolved incidents
      if (reportData.incidents?.unresolved?.length > 0) {
        gaps.push({
          type: 'unresolved_incidents',
          severity: 'medium',
          count: reportData.incidents.unresolved.length,
          description: `${reportData.incidents.unresolved.length} unresolved incident(s) require attention`,
        });
      }

      reportData.compliance_gaps = {
        gaps: gaps,
        total_gaps: gaps.length,
        critical: gaps.filter(g => g.severity === 'critical').length,
        high: gaps.filter(g => g.severity === 'high').length,
        medium: gaps.filter(g => g.severity === 'medium').length,
        low: gaps.filter(g => g.severity === 'low').length,
      };
    }

    // 17. Executive Summary (updated with all new data)
    if (includeSections.includes('summary')) {
      const expiringQualifications = reportData.qualifications?.expiring_soon?.length || 0;
      const expiredQualifications = reportData.qualifications?.expired?.length || 0;
      const expiringCompliance = reportData.compliance_records?.expiring_soon?.length || 0;
      const expiredCompliance = reportData.compliance_records?.expired?.length || 0;
      const tempViolations = reportData.temperature_violations?.total_violations || 0;
      const complianceGaps = reportData.compliance_gaps?.total_gaps || 0;
      const unresolvedIncidents = reportData.incidents?.unresolved?.length || 0;

      reportData.executive_summary = {
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

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (err) {
    logger.error('[Health Inspector Report API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/compliance/health-inspector-report', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
