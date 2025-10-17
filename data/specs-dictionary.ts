import { type SpecDefinition } from "@/types/domain";

export const specGroups: Record<string, { title: string; description?: string }> = {
  media: { title: "视觉资料" },
  basic: { title: "基础信息", description: "品牌、上市年份、定位等概览字段" },
  mechanical: { title: "机械规格" },
  dimensions: { title: "尺寸与重量" },
  deck: { title: "割草系统" },
  performance: { title: "性能能力" },
  mobility: { title: "地形适应" },
  power: { title: "动力系统" },
  battery: { title: "电池与续航" },
  sensing: { title: "导航与感知" },
  software: { title: "软件与平台" },
  environment: { title: "环境适应" },
  safety: { title: "安全与防护" },
  maintenance: { title: "维护与耐用度" },
  certification: { title: "认证与合规" },
  market: { title: "市场与渠道" }
};

export const specDictionary: SpecDefinition[] = [
  {
    id: "product_image",
    group: "media",
    key: "image",
    labelZh: "图片",
    labelEn: "Image",
    dataType: "string",
    description: "主图或展示图片地址"
  },
  {
    id: "mechanical_spec",
    group: "mechanical",
    key: "mechanical_spec",
    labelZh: "机械规格",
    labelEn: "Mechanical Spec",
    dataType: "string"
  },
  {
    id: "weight",
    group: "mechanical",
    key: "weight",
    labelZh: "重量",
    labelEn: "Weight",
    dataType: "number",
    unit: "kg"
  },
  {
    id: "dimensions",
    group: "dimensions",
    key: "dimensions",
    labelZh: "尺寸（L×W×H）",
    labelEn: "Dimensions",
    dataType: "string"
  },
  {
    id: "cutting_width",
    group: "deck",
    key: "cutting_width",
    labelZh: "割草宽度",
    labelEn: "Cutting Width",
    dataType: "number",
    unit: "cm",
    unitOptions: ["cm", "in"]
  },
  {
    id: "cutting_height_range",
    group: "deck",
    key: "cutting_height_range",
    labelZh: "割草高度范围",
    labelEn: "Cut Height Range",
    dataType: "string"
  },
  {
    id: "blade_system",
    group: "deck",
    key: "blade_system",
    labelZh: "刀片系统",
    labelEn: "Blade System",
    dataType: "string"
  },
  {
    id: "deck_type",
    group: "deck",
    key: "deck_type",
    labelZh: "刀盘类型",
    labelEn: "Deck Type",
    dataType: "string"
  },
  {
    id: "blade_speed",
    group: "deck",
    key: "blade_speed",
    labelZh: "刀盘转速",
    labelEn: "Blade Speed",
    dataType: "number",
    unit: "rpm"
  },
  {
    id: "top_speed",
    group: "performance",
    key: "top_speed",
    labelZh: "最高速度",
    labelEn: "Top Speed",
    dataType: "number",
    unit: "km/h"
  },
  {
    id: "cutting_speed",
    group: "performance",
    key: "cutting_speed",
    labelZh: "切割速度",
    labelEn: "Productivity",
    dataType: "number",
    unit: "㎡/h"
  },
  {
    id: "max_work_area",
    group: "performance",
    key: "max_work_area",
    labelZh: "最大工作面积",
    labelEn: "Max Work Area",
    dataType: "number",
    unit: "㎡"
  },
  {
    id: "performance_notes",
    group: "performance",
    key: "performance_notes",
    labelZh: "性能参数",
    labelEn: "Performance Notes",
    dataType: "string"
  },
  {
    id: "tilt_capability",
    group: "mobility",
    key: "tilt_capability",
    labelZh: "倾斜通过能力",
    labelEn: "Tilt Capability",
    dataType: "number",
    unit: "°"
  },
  {
    id: "max_gradeability",
    group: "mobility",
    key: "max_gradeability",
    labelZh: "最大爬坡能力",
    labelEn: "Max Gradeability",
    dataType: "number",
    unit: "%"
  },
  {
    id: "power_system",
    group: "power",
    key: "power_system",
    labelZh: "电源系统",
    labelEn: "Power System",
    dataType: "string"
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
    id: "runtime",
    group: "battery",
    key: "runtime",
    labelZh: "续航时间",
    labelEn: "Runtime",
    dataType: "string"
  },
  {
    id: "charging_method",
    group: "battery",
    key: "charging_method",
    labelZh: "充电方式",
    labelEn: "Charging Method",
    dataType: "string"
  },
  {
    id: "charging_time",
    group: "battery",
    key: "charging_time",
    labelZh: "充电时间",
    labelEn: "Charging Time",
    dataType: "string"
  },
  {
    id: "swap_support",
    group: "battery",
    key: "swap_support",
    labelZh: "换电支持",
    labelEn: "Swap Support",
    dataType: "boolean"
  },
  {
    id: "navigation_obstacle",
    group: "sensing",
    key: "navigation_obstacle",
    labelZh: "导航避障系统",
    labelEn: "Navigation & Obstacle",
    dataType: "string"
  },
  {
    id: "positioning_system",
    group: "sensing",
    key: "positioning_system",
    labelZh: "定位系统",
    labelEn: "Positioning System",
    dataType: "string"
  },
  {
    id: "navigation_method",
    group: "sensing",
    key: "navigation_method",
    labelZh: "导航方式",
    labelEn: "Navigation Method",
    dataType: "string"
  },
  {
    id: "obstacle_system",
    group: "sensing",
    key: "obstacle_system",
    labelZh: "避障系统",
    labelEn: "Obstacle System",
    dataType: "string"
  },
  {
    id: "software_suite",
    group: "software",
    key: "software_suite",
    labelZh: "软件相关",
    labelEn: "Software Suite",
    dataType: "string"
  },
  {
    id: "remote_control",
    group: "software",
    key: "remote_control",
    labelZh: "遥控支持",
    labelEn: "Remote Control",
    dataType: "boolean"
  },
  {
    id: "ota_support",
    group: "software",
    key: "ota_support",
    labelZh: "OTA 升级",
    labelEn: "OTA Support",
    dataType: "boolean"
  },
  {
    id: "map_management",
    group: "software",
    key: "map_management",
    labelZh: "地图/任务管理",
    labelEn: "Map Management",
    dataType: "string"
  },
  {
    id: "unique_selling_points",
    group: "software",
    key: "unique_selling_points",
    labelZh: "特殊功能或卖点",
    labelEn: "Selling Points",
    dataType: "string"
  },
  {
    id: "platform_capabilities",
    group: "software",
    key: "platform_capabilities",
    labelZh: "软件平台能力",
    labelEn: "Platform Capabilities",
    dataType: "string"
  },
  {
    id: "noise_level",
    group: "environment",
    key: "noise_level",
    labelZh: "工作噪音",
    labelEn: "Noise Level",
    dataType: "number",
    unit: "dB(A)"
  },
  {
    id: "ip_rating",
    group: "environment",
    key: "ip_rating",
    labelZh: "防水等级",
    labelEn: "IP Rating",
    dataType: "string"
  },
  {
    id: "operating_temperature",
    group: "environment",
    key: "operating_temperature",
    labelZh: "工作温度范围",
    labelEn: "Operating Temp",
    dataType: "string"
  },
  {
    id: "temperature_range",
    group: "environment",
    key: "temperature_range",
    labelZh: "温度适应区间",
    labelEn: "Temperature Range",
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
    id: "maintenance_durability",
    group: "maintenance",
    key: "maintenance_durability",
    labelZh: "维护与耐用度",
    labelEn: "Maintenance",
    dataType: "string"
  },
  {
    id: "mechanical_strength",
    group: "mechanical",
    key: "mechanical_strength",
    labelZh: "机械强度与载荷",
    labelEn: "Mechanical Strength",
    dataType: "string"
  },
  {
    id: "certifications",
    group: "certification",
    key: "certifications",
    labelZh: "认证",
    labelEn: "Certifications",
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
