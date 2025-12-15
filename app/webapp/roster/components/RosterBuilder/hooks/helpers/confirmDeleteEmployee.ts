/**
 * Show confirmation dialog for deleting employee from roster.
 */
interface ConfirmDeleteEmployeeParams {
  employeeName: string;
  employeeShiftsCount: number;
  showConfirm: (options: {
    title: string;
    message: string;
    variant: 'danger';
    confirmLabel: string;
    cancelLabel: string;
  }) => Promise<boolean>;
}

export async function confirmDeleteEmployee({
  employeeName,
  employeeShiftsCount,
  showConfirm,
}: ConfirmDeleteEmployeeParams): Promise<boolean> {
  return await showConfirm({
    title: 'Remove Employee from Roster',
    message: `Are you sure you want to 86 ${employeeName} from this week's roster?${employeeShiftsCount > 0 ? ` This will delete all ${employeeShiftsCount} shift${employeeShiftsCount > 1 ? 's' : ''} for this week's roster.` : ''} This action can't be undone.`,
    variant: 'danger',
    confirmLabel: '86 Them',
    cancelLabel: 'Cancel',
  });
}
