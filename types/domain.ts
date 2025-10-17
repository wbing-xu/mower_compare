export type CompanyTag =
  | "上市公司"
  | "私有企业"
  | "机器人"
  | "乘骑式"
  | "园林"
  | "商用"
  | "民用";

export interface SeriesDefinition {
  id: string;
  name: string;
  description?: string;
}

export interface ProductCategoryDefinition {
  id: string;
  name: string;
  taxonomyPath: string[];
  children: SeriesDefinition[];
}

export interface DivisionDefinition {
  id: string;
  name: string;
  type: "brand" | "division";
  description?: string;
  children: ProductCategoryDefinition[];
}

export interface Company {
  id: string;
  name: string;
  shortName?: string;
  country: string;
  city?: string;
  listed: boolean;
  website?: string;
  logo: string;
  description: string;
  tags: CompanyTag[];
  divisions: DivisionDefinition[];
  highlights: string[];
}

export interface SeriesNode extends SeriesDefinition {
  products: ProductSummary[];
}

export interface ProductCategoryNode extends ProductCategoryDefinition {
  children: SeriesNode[];
}

export interface DivisionNode extends DivisionDefinition {
  children: ProductCategoryNode[];
}

export type MarketPosition = "consumer" | "prosumer" | "professional" | "municipal";
export type Powertrain = "ICE" | "BEV" | "Hybrid" | "Robot";

export interface ProductSummary {
  id: string;
  modelName: string;
  sku?: string;
  coverImage: string;
  companyId: string;
  divisionId: string;
  categoryId: string;
  seriesId: string;
  brandName?: string;
  marketPosition: MarketPosition;
  powertrain: Powertrain;
  releaseYear: number;
  status: "active" | "discontinued";
  summary: string;
  priceRange?: [number, number];
  specs: SpecValue[];
}

export type SpecGroup =
  | "media"
  | "basic"
  | "mechanical"
  | "dimensions"
  | "deck"
  | "performance"
  | "mobility"
  | "power"
  | "battery"
  | "sensing"
  | "software"
  | "environment"
  | "safety"
  | "maintenance"
  | "certification"
  | "market";

export interface SpecDefinition {
  id: string;
  group: SpecGroup;
  key: string;
  labelZh: string;
  labelEn: string;
  description?: string;
  unit?: string;
  unitOptions?: string[];
  dataType: "string" | "number" | "boolean" | "enum" | "range";
  options?: string[];
}

export interface SpecValue {
  definitionId: string;
  value: string | number | boolean | number[];
  unit?: string;
}

export interface ProductFilterOption {
  id: string;
  label: string;
  group: "用途" | "动力" | "割幅" | "定位" | "年份";
  type: "multi-select" | "range";
  values?: { value: string; label: string }[];
  range?: { min: number; max: number; step?: number; unit?: string };
}
