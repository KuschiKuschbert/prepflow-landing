/**
 * Format cleaning schedule for print/export
 * Generates HTML content for cleaning schedules
 */

import type { CleaningTask } from './printCleaningSchedule';

/**
 * Format cleaning schedule for print/export
 *
 * @param {CleaningTask[]} tasks - Cleaning tasks
 * @param {Date} startDate - Start date for the schedule
 * @param {Date} endDate - End date for the schedule
 * @returns {string} HTML content
 */
export function formatCleaningScheduleForPrint(
  tasks: CleaningTask[],
  startDate: Date,
  endDate: Date,
): string {
  // Group tasks by area
  const tasksByArea = tasks.reduce(
    (acc, task) => {
      const areaName = task.cleaning_areas.name;
      if (!acc[areaName]) {
        acc[areaName] = [];
      }
      acc[areaName].push(task);
      return acc;
    },
    {} as Record<string, CleaningTask[]>,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#29E7CD';
      case 'overdue':
        return '#D925C7';
      case 'pending':
      default:
        return '#FF6B00';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  return `
    <div style="max-width: 100%;">
      <!-- Summary Section -->
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
          Summary
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Tasks</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${tasks.length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Completed</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${tasks.filter(t => t.status === 'completed').length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Pending</div>
            <div style="font-size: 28px; font-weight: 700; color: #FF6B00;">${tasks.filter(t => t.status === 'pending').length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Overdue</div>
            <div style="font-size: 28px; font-weight: 700; color: #D925C7;">${tasks.filter(t => t.status === 'overdue').length}</div>
          </div>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(42, 42, 42, 0.5);">
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">
            Date Range: ${startDate.toLocaleDateString('en-AU')} - ${endDate.toLocaleDateString('en-AU')}
          </div>
        </div>
      </div>

      <!-- Tasks by Area -->
      ${Object.entries(tasksByArea)
        .map(
          ([areaName, areaTasks]) => `
        <div style="margin-bottom: 32px; page-break-inside: avoid;">
          <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
            ${areaName}
            <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6); margin-left: 8px;">(${areaTasks.length} tasks)</span>
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background: rgba(42, 42, 42, 0.5);">
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Assigned Date</th>
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Completed Date</th>
                <th style="text-align: center; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Status</th>
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Notes</th>
              </tr>
            </thead>
            <tbody>
              ${areaTasks
                .sort(
                  (a, b) =>
                    new Date(a.assigned_date).getTime() - new Date(b.assigned_date).getTime(),
                )
                .map(task => {
                  const assignedDate = new Date(task.assigned_date).toLocaleDateString('en-AU');
                  const completedDate = task.completed_date
                    ? new Date(task.completed_date).toLocaleDateString('en-AU')
                    : 'N/A';
                  const statusColor = getStatusColor(task.status);
                  const statusLabel = getStatusLabel(task.status);

                  return `
                    <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                      <td style="padding: 10px; color: rgba(255, 255, 255, 0.9);">${assignedDate}</td>
                      <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${completedDate}</td>
                      <td style="text-align: center; padding: 10px;">
                        <span style="color: ${statusColor}; font-weight: 600;">${statusLabel}</span>
                      </td>
                      <td style="padding: 10px; color: rgba(255, 255, 255, 0.7); font-size: 13px;">${task.notes || ''}</td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}
