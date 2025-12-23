import Papa from 'papaparse';

export interface ParseCSVOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
  transform?: (value: any, field: string) => any;
}

export interface ParseCSVResult<T = any> {
  data: T[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

