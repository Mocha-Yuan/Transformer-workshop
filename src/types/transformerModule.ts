export type ModuleColor = 'cyan' | 'yellow' | 'pink' | 'green' | 'blue' | 'orange';

export interface TransformerModule {
  id: string;
  nameZh: string;
  nameEn: string;
  roleName: string;
  roleMotto: string;
  summary: string;
  detail: string;
  color: ModuleColor;
}
