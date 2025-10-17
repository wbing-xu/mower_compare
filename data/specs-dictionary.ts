import { type SpecDefinition } from "@/types/domain";

export const specGroups: Record<string, { title: string; description?: string }> = {
  basic: { title: "基础信息", description: "品牌、上市年份、定位等概览字段" },
  dimensions: { title: "尺寸与重量" },
  deck: { title: "割草系统" },
  power: { title: "动力系统" },
  battery: { title: "电池与续航" },
  drive: { title: "驱动与转向" },
  sensing: { title: "感知与导航" },
  safety: { title: "安全与防护" },
  maintenance: { title: "维护与保养" },
  market: { title: "市场与渠道" }
};

export const specDictionary: SpecDefinition[] = [
  {
    id: "release_year",
    group: "basic",
    key: "release_year",
    labelZh: "上市年份",
    labelEn: "Release Year",
    dataType: "number"
  },
  {
    id: "market_position",
    group: "basic",
    key: "market_position",
    labelZh: "定位",
    labelEn: "Market Position",
    dataType: "enum",
    options: ["消费级", "半专业", "专业级", "市政"],
    description: "面向的目标用户或场景"
  },
  {
    id: "cutting_width",
    group: "deck",
    key: "cutting_width",
    labelZh: "割幅",
    labelEn: "Cutting Width",
    dataType: "number",
    unit: "cm",
    unitOptions: ["cm", "in"]
  },
  {
    id: "deck_type",
    group: "deck",
    key: "deck_type",
    labelZh: "割草甲板",
    labelEn: "Deck Type",
    dataType: "enum",
    options: ["冲压钢", "焊接钢", "聚合物"]
  },
  {
    id: "engine_power",
    group: "power",
    key: "engine_power",
    labelZh: "发动机功率",
    labelEn: "Engine Power",
    dataType: "number",
    unit: "hp",
    unitOptions: ["hp", "kW"]
  },
  {
    id: "battery_capacity",
    group: "battery",
    key: "battery_capacity",
    labelZh: "电池容量",
    labelEn: "Battery Capacity",
    dataType: "number",
    unit: "Ah"
  },
  {
    id: "battery_voltage",
    group: "battery",
    key: "battery_voltage",
    labelZh: "电池电压",
    labelEn: "Battery Voltage",
    dataType: "number",
    unit: "V"
  },
  {
    id: "runtime",
    group: "battery",
    key: "runtime",
    labelZh: "续航时间",
    labelEn: "Runtime",
    dataType: "number",
    unit: "min"
  },
  {
    id: "drive_type",
    group: "drive",
    key: "drive_type",
    labelZh: "驱动形式",
    labelEn: "Drive Type",
    dataType: "enum",
    options: ["四轮驱动", "后轮驱动", "履带", "零转"]
  },
  {
    id: "sensors",
    group: "sensing",
    key: "sensors",
    labelZh: "传感器",
    labelEn: "Sensors",
    dataType: "string"
  },
  {
    id: "safety_features",
    group: "safety",
    key: "safety_features",
    labelZh: "安全特性",
    labelEn: "Safety",
    dataType: "string"
  },
  {
    id: "price",
    group: "market",
    key: "price",
    labelZh: "建议零售价",
    labelEn: "MSRP",
    dataType: "number",
    unit: "CNY"
  }
];
