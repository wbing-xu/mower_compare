import { mockProducts } from "@/data/mock-products";
import { type Company } from "@/types/domain";

const productMap = new Map(mockProducts.map((product) => [product.id, product]));

export const mockCompanies: Company[] = [
  {
    id: "toro",
    name: "Toro Company",
    shortName: "Toro",
    country: "美国",
    listed: true,
    website: "https://www.thetorocompany.com/",
    logo: "/logos/toro.svg",
    description:
      "Toro Company 致力于园林机械、灌溉系统与场地管理解决方案，在零转割草、机器人割草、专业园林设备等领域拥有广泛产品线。",
    tags: ["上市公司", "乘骑式", "园林", "商用"],
    highlights: [
      "零转割草平台市场份额领先",
      "收购 Exmark、Ventrac 等高端品牌",
      "在自治割草与互联平台持续投入"
    ],
    divisions: [
      {
        id: "toro-exmark",
        name: "Exmark",
        type: "brand",
        description: "专注专业级乘骑式与站立式割草解决方案",
        children: [
          {
            id: "toro-exmark-zero-turn",
            name: "乘骑式/零转",
            taxonomyPath: ["乘骑式", "零转"],
            children: [
              {
                id: "toro-lazer-z",
                name: "Lazer Z 系列",
                products: [productMap.get("toro-lazerz-x")!]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "husqvarna",
    name: "Husqvarna",
    country: "瑞典",
    listed: true,
    website: "https://www.husqvarna.com/",
    logo: "/logos/husqvarna.svg",
    description:
      "Husqvarna 深耕林业与园艺机械，在机器人割草与智能园林管理领域具有领先技术。",
    tags: ["上市公司", "机器人", "园林", "商用"],
    highlights: [
      "Ceora 平台面向球场、市政大场景",
      "Automower 系列覆盖家庭到专业场景",
      "积极布局连接与数字服务"
    ],
    divisions: [
      {
        id: "husqvarna-professional",
        name: "Professional Robotics",
        type: "division",
        description: "专业机器人割草事业部",
        children: [
          {
            id: "husqvarna-ceora",
            name: "Ceora 机器人系统",
            taxonomyPath: ["机器人", "商用"],
            children: [
              {
                id: "ceora-544",
                name: "Ceora 544",
                products: [productMap.get("husqvarna-ceora-544")!]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "chengdu-ego",
    name: "EGO Power+",
    country: "中国",
    listed: false,
    website: "https://egopowerplus.com/",
    logo: "/logos/ego.svg",
    description:
      "EGO Power+ 聚焦电动园林设备，通过模块化 56V 电池平台覆盖割草、吹风、锯切等多类产品。",
    tags: ["私有企业", "民用", "乘骑式"],
    highlights: [
      "56V ARC Lithium 电池生态",
      "多品牌联合渠道布局",
      "电动零转割草机在北美市场快速增长"
    ],
    divisions: [
      {
        id: "ego-riding",
        name: "Riding & Zero-Turn",
        type: "division",
        children: [
          {
            id: "ego-zero-turn",
            name: "电动零转",
            taxonomyPath: ["乘骑式", "电动"],
            children: [
              {
                id: "ego-z6",
                name: "Z6 系列",
                products: [productMap.get("ego-power-z6")!]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kubota",
    name: "Kubota",
    country: "日本",
    listed: true,
    website: "https://www.kubota.com/",
    logo: "/logos/kubota.svg",
    description:
      "Kubota 提供农业、建筑与园艺机械，其零转割草平台强调可靠性与易维护。",
    tags: ["上市公司", "乘骑式", "商用"],
    highlights: [
      "柴油动力零转保有量高",
      "全系支持 ROPS 与多重安全机制",
      "布局智能互联与远程监控"
    ],
    divisions: [
      {
        id: "kubota-turf",
        name: "Kubota Turf",
        type: "division",
        children: [
          {
            id: "kubota-zero-turn",
            name: "零转割草平台",
            taxonomyPath: ["乘骑式", "零转"],
            children: [
              {
                id: "kubota-zd",
                name: "ZD 系列",
                products: [productMap.get("kubota-zd1511")!]
              }
            ]
          }
        ]
      }
    ]
  }
];
