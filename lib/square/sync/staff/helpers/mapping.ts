/**
 * Staff mapping helpers for Square ↔ PrepFlow conversion.
 */
import type { Employee } from '../../staff';

// Square Team Member structure (from Square API)
interface SquareTeamMember {
  id?: string;
  givenName?: string;
  familyName?: string;
  emailAddress?: {
    emailAddress?: string;
  };
  phoneNumber?: {
    phoneNumber?: string;
  };
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  createdAt?: string;
  assignedLocations?: {
    assignmentType?: 'MANAGER' | 'EMPLOYEE' | string;
    locationIds?: string[];
  };
}

/**
 * Map Square team member to PrepFlow employee
 */
export function mapSquareTeamMemberToEmployee(teamMember: SquareTeamMember): Employee {
  // Extract name
  const givenName = teamMember.givenName || '';
  const familyName = teamMember.familyName || '';
  const fullName =
    `${givenName} ${familyName}`.trim() || teamMember.emailAddress?.emailAddress || 'Unknown';

  // Extract email
  const email = teamMember.emailAddress?.emailAddress || null;

  // Extract phone
  const phone = teamMember.phoneNumber?.phoneNumber || null;

  // Map Square status to PrepFlow status
  let status: 'active' | 'inactive' | 'terminated' = 'active';
  if (teamMember.status === 'INACTIVE') {
    status = 'inactive';
  } else if (teamMember.status === 'TERMINATED') {
    status = 'terminated';
  }

  // Extract role (from assignment or default)
  let role: string | null = null;
  if (teamMember.assignedLocations?.assignmentType) {
    // Map Square assignment type to role
    const assignmentType = teamMember.assignedLocations.assignmentType;
    if (assignmentType === 'MANAGER') {
      role = 'manager';
    } else if (assignmentType === 'EMPLOYEE') {
      role = 'staff';
    }
  }

  // Extract employment dates
  const employmentStartDate = teamMember.createdAt
    ? new Date(teamMember.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  const employmentEndDate = status === 'terminated' ? employmentStartDate : null;

  return {
    id: '', // Will be set when creating employee
    full_name: fullName,
    role,
    employment_start_date: employmentStartDate,
    employment_end_date: employmentEndDate,
    status,
    phone,
    email,
    emergency_contact: null, // Square doesn't have emergency contact
    photo_url: null, // Square doesn't provide photo URL directly
    notes: null,
  };
}

/**
 * Map PrepFlow employee to Square team member
 */
export function mapEmployeeToSquareTeamMember(employee: Employee): SquareTeamMember {
  // Split full name into given and family name
  const nameParts = employee.full_name.split(' ');
  const givenName = nameParts[0] || '';
  const familyName = nameParts.slice(1).join(' ') || '';

  // Map PrepFlow status to Square status
  let status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  if (employee.status === 'inactive' || employee.status === 'terminated') {
    status = 'INACTIVE';
  }

  // Build team member data
  const teamMemberData: SquareTeamMember = {
    givenName,
    familyName,
    emailAddress: employee.email
      ? {
          emailAddress: employee.email,
        }
      : undefined,
    phoneNumber: employee.phone
      ? {
          phoneNumber: employee.phone,
        }
      : undefined,
    status,
  };

  // Add assignment if role exists
  if (employee.role) {
    // Map PrepFlow role to Square assignment type
    let assignmentType: 'EMPLOYEE' | 'MANAGER' = 'EMPLOYEE';
    if (
      employee.role.toLowerCase().includes('manager') ||
      employee.role.toLowerCase().includes('admin')
    ) {
      assignmentType = 'MANAGER';
    }

    // Note: Square requires location IDs for assignments
    // We'll need to get the default location from config
    // For now, we'll skip assignment and let Square handle it
    // TODO: Add location assignment based on config.default_location_id
  }

  return teamMemberData;
}
