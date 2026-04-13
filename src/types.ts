export interface Project {
  id: string;
  name: string;
  description: string;
  editedAt: string;
  dataCount?: number;
  dashboardCount?: number;
  isActive?: boolean;
  image?: string;
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface MappingField {
  id: string;
  label: string;
  value: string;
  type: 'String' | 'Number' | 'Decimal' | 'DateTime';
}

export interface ChartConfig {
  id: string;
  name: string;
  type: string;
  data: any[];
  labelField: string;
  valueField: string;
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export type Page = 'home' | 'project-details' | 'dashboard';
