import { type ProductFilterOption, type ProductSummary } from "@/types/domain";

export const mockProducts: ProductSummary[] = [
  {
    id: "toro-lazerz-x",
    modelName: "Lazer Z X-Series",
    coverImage: "/logos/toro.svg",
    marketPosition: "professional",
    powertrain: "ICE",
    releaseYear: 2023,
    status: "active",
    summary: "旗舰级零转割草机，针对市政与大型园林场景。",
    priceRange: [168000, 198000],
    specs: [
      { definitionId: "cutting_width", value: 152, unit: "cm" },
      { definitionId: "deck_type", value: "焊接钢" },
      { definitionId: "engine_power", value: 35, unit: "hp" },
      { definitionId: "drive_type", value: "零转" },
      { definitionId: "sensors", value: "坡度传感、GPS 准备" },
      { definitionId: "safety_features", value: "驾驶员感应座椅、紧停按钮" },
      { definitionId: "price", value: 188000, unit: "CNY" }
    ]
  },
  {
    id: "husqvarna-ceora-544",
    modelName: "Ceora 544",
    coverImage: "/logos/husqvarna.svg",
    marketPosition: "municipal",
    powertrain: "Robot",
    releaseYear: 2024,
    status: "active",
    summary: "专业级机器人割草系统，支持 RTK 精准导航。",
    priceRange: [298000, 358000],
    specs: [
      { definitionId: "cutting_width", value: 68, unit: "cm" },
      { definitionId: "deck_type", value: "模块化割草盘" },
      { definitionId: "battery_capacity", value: 49, unit: "Ah" },
      { definitionId: "battery_voltage", value: 48, unit: "V" },
      { definitionId: "runtime", value: 150, unit: "min" },
      { definitionId: "sensors", value: "GPS-RTK、超声波、IMU、视觉避障" },
      { definitionId: "safety_features", value: "电子围栏、障碍检测、远程急停" },
      { definitionId: "price", value: 328000, unit: "CNY" }
    ]
  },
  {
    id: "ego-power-z6",
    modelName: "EGO Power+ Z6",
    coverImage: "/logos/ego.svg",
    marketPosition: "prosumer",
    powertrain: "BEV",
    releaseYear: 2022,
    status: "active",
    summary: "家庭与轻商用场景的电动零转割草机，兼容模块化电池。",
    priceRange: [98000, 118000],
    specs: [
      { definitionId: "cutting_width", value: 132, unit: "cm" },
      { definitionId: "deck_type", value: "冲压钢" },
      { definitionId: "battery_capacity", value: 60, unit: "Ah" },
      { definitionId: "battery_voltage", value: 56, unit: "V" },
      { definitionId: "runtime", value: 90, unit: "min" },
      { definitionId: "drive_type", value: "零转" },
      { definitionId: "safety_features", value: "LED 灯带、坡度预警" },
      { definitionId: "price", value: 108000, unit: "CNY" }
    ]
  },
  {
    id: "kubota-zd1511",
    modelName: "Kubota ZD1511",
    coverImage: "/logos/kubota.svg",
    marketPosition: "professional",
    powertrain: "ICE",
    releaseYear: 2021,
    status: "active",
    summary: "柴油动力零转平台，主打高可靠性与低维护成本。",
    priceRange: [188000, 228000],
    specs: [
      { definitionId: "cutting_width", value: 152, unit: "cm" },
      { definitionId: "deck_type", value: "焊接钢" },
      { definitionId: "engine_power", value: 30.8, unit: "hp" },
      { definitionId: "drive_type", value: "零转" },
      { definitionId: "sensors", value: "坡度传感" },
      { definitionId: "safety_features", value: "翻滚保护框、紧停" },
      { definitionId: "price", value: 208000, unit: "CNY" }
    ]
  }
];

export const productFilters: ProductFilterOption[] = [
  {
    id: "powertrain",
    label: "动力系统",
    group: "动力",
    type: "multi-select",
    values: [
      { value: "ICE", label: "燃油" },
      { value: "BEV", label: "纯电" },
      { value: "Hybrid", label: "混动" },
      { value: "Robot", label: "机器人" }
    ]
  },
  {
    id: "marketPosition",
    label: "市场定位",
    group: "定位",
    type: "multi-select",
    values: [
      { value: "consumer", label: "消费级" },
      { value: "prosumer", label: "进阶用户" },
      { value: "professional", label: "专业级" },
      { value: "municipal", label: "市政" }
    ]
  },
  {
    id: "releaseYear",
    label: "上市年份",
    group: "年份",
    type: "range",
    range: { min: 2018, max: 2024, step: 1 }
  },
  {
    id: "cuttingWidth",
    label: "割幅",
    group: "割幅",
    type: "range",
    range: { min: 50, max: 180, step: 5, unit: "cm" }
  }
];
