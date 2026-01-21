import type {
    ReportQualification,
    ReportStaffHealthDeclaration,
} from '../report-item-types';

export interface ReportQualificationsSection {
  all_qualifications: ReportQualification[];
  expiring_soon: ReportQualification[];
  expired: ReportQualification[];
}

export interface ReportStaffHealthSection {
  declarations: ReportStaffHealthDeclaration[];
  total_declarations: number;
  unhealthy_count: number;
  excluded_count: number;
  date_range: {
    start: string;
    end: string;
  };
}
