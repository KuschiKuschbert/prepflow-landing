import { NextRequest } from 'next/server';

export interface ShiftQueryParams {
  employee_id: string | undefined;
  status: string;
  start_date: string | undefined;
  end_date: string | undefined;
  shift_date: string | undefined;
  page: number;
  pageSize: number;
}

export function parseShiftQueryParams(request: NextRequest): ShiftQueryParams {
  const { searchParams } = new URL(request.url);
  return {
    employee_id: searchParams.get('employee_id') || undefined,
    status: searchParams.get('status') || 'all',
    start_date: searchParams.get('start_date') || undefined,
    end_date: searchParams.get('end_date') || undefined,
    shift_date: searchParams.get('shift_date') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || '100', 10),
  };
}
