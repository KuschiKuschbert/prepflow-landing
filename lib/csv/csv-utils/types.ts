import Papa from 'papaparse';

export interface ParseCSVOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
  transform?: (value: unknown, field: string) => unknown;
}

export interface ParseCSVResult<T = any> {
  data: T[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}
