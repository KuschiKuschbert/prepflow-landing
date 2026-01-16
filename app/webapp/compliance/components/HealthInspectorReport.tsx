'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { generateHTMLReport, ReportData } from '@/lib/compliance/report-generator';
import { logger } from '@/lib/logger';
import { Calendar, Download, FileText, Printer } from 'lucide-react';
import { useState } from 'react';

export function HealthInspectorReport() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [includeSections, setIncludeSections] = useState<string[]>([
    'summary',
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
  ]);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        include_sections: includeSections.join(','),
      });

      const response = await fetch(`/api/compliance/health-inspector-report?${params}`);
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        setError(data.error || 'Failed to generate report');
      }
    } catch (err) {
      logger.error('Error generating report:', err);
      setError('Failed to generate report. Give it another go, chef.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportData) return;
    const html = generateHTMLReport(reportData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html); // auditor:ignore
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleExportHTML = () => {
    if (!reportData) return;
    const html = generateHTMLReport(reportData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-inspector-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!reportData) return;
    const json = JSON.stringify(reportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-inspector-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (section: string) => {
    setIncludeSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section],
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--foreground)]">
          <Icon icon={FileText} size="md" aria-hidden={true} />
          Generate Health Inspector Report
        </h3>

        {/* Date Range */}
        <div className="desktop:grid-cols-2 mb-4 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              <Icon icon={Calendar} size="sm" className="mr-1 inline" aria-hidden={true} />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              <Icon icon={Calendar} size="sm" className="mr-1 inline" aria-hidden={true} />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Section Toggles */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Include Sections
          </label>
          <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-2 gap-2">
            {[
              { key: 'summary', label: 'Executive Summary', category: 'core' },
              { key: 'business', label: 'Business Info', category: 'core' },
              { key: 'employees', label: 'Employees', category: 'core' },
              { key: 'qualifications', label: 'Qualifications', category: 'core' },
              { key: 'compliance', label: 'Compliance Records', category: 'core' },
              { key: 'compliance_gaps', label: 'Compliance Gaps', category: 'core' },
              { key: 'temperature', label: 'Temperature Logs', category: 'monitoring' },
              { key: 'temperature_violations', label: 'Temp Violations', category: 'monitoring' },
              { key: 'cleaning', label: 'Cleaning Records', category: 'monitoring' },
              { key: 'sanitizer', label: 'Sanitizer Logs', category: 'monitoring' },
              { key: 'staff_health', label: 'Staff Health', category: 'staff' },
              { key: 'incidents', label: 'Incident Reports', category: 'safety' },
              { key: 'haccp', label: 'HACCP Records', category: 'safety' },
              { key: 'allergens', label: 'Allergen Management', category: 'safety' },
              { key: 'equipment', label: 'Equipment Maintenance', category: 'operations' },
              { key: 'waste', label: 'Waste Management', category: 'operations' },
              { key: 'procedures', label: 'Food Safety Procedures', category: 'documentation' },
              { key: 'suppliers', label: 'Supplier Verification', category: 'supply' },
            ].map(section => (
              <label
                key={section.key}
                className="flex items-center space-x-2 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-3 transition-colors hover:bg-[var(--muted)]/80"
              >
                <input
                  type="checkbox"
                  checked={includeSections.includes(section.key)}
                  onChange={() => toggleSection(section.key)}
                  className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--foreground)]">{section.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateReport}
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-3xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-6">
          <p className="text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <LoadingSkeleton variant="card" count={3} height="100px" />
        </div>
      )}

      {/* Report Preview */}
      {reportData && !loading && (
        <div className="space-y-4">
          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80"
            >
              <Icon icon={Printer} size="sm" aria-hidden={true} />
              Print
            </button>
            <button
              onClick={handleExportHTML}
              className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80"
            >
              <Icon icon={Download} size="sm" aria-hidden={true} />
              Export HTML
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80"
            >
              <Icon icon={Download} size="sm" aria-hidden={true} />
              Export JSON
            </button>
          </div>

          {/* Report Preview */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--qr-background)] p-8 shadow-lg">
            <iframe
              srcDoc={generateHTMLReport(reportData)}
              className="h-[800px] w-full border-0"
              title="Health Inspector Report Preview"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!reportData && !loading && !error && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={FileText} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
            No Report Generated
          </h3>
          <p className="text-[var(--foreground-muted)]">
            Select your date range and sections, then click &quot;Generate Report&quot; to create a
            comprehensive health inspector compliance report.
          </p>
        </div>
      )}
    </div>
  );
}
