import { type Company } from "@/types/domain";

export const mockCompanies: Company[] = [
  {
    id: "stanley-black-decker",
    name: "Stanley Black & Decker",
    shortName: "SBD",
    country: "美国",
    listed: true,
    website: "https://www.stanleyblackanddecker.com/",
    logo: "/logos/stanley.svg",
    description:
      "Stanley Black & Decker 通过 Craftsman、MTD 等品牌布局住宅园林机械，并在零售渠道具有深厚积累。",
    tags: ["上市公司", "民用", "园林"],
    highlights: [
      "Craftsman 提供完整住宅园艺组合",
      "整合 MTD 形成从 OEM 到渠道的垂直体系",
      "积极推进 60V 电动化平台"
    ],
    divisions: [
      {
        id: "sbd-craftsman",
        name: "Craftsman",
        type: "brand",
        description: "北美家用园林与工具品牌",
        children: [
          {
            id: "craftsman-riding",
            name: "住宅乘骑式割草机",
            taxonomyPath: ["乘骑式", "民用"],
            children: [
              { id: "craftsman-t-series", name: "T Series" },
              { id: "craftsman-zt-series", name: "Zero-Turn" }
            ]
          }
        ]
      },
      {
        id: "sbd-mtd-pro",
        name: "MTD Professional",
        type: "brand",
        description: "MTD 工程与专业级产品线",
        children: [
          {
            id: "mtd-pro-zero-turn",
            name: "商用零转平台",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "mtd-pro-z-series", name: "Pro Z Series" }]
          }
        ]
      }
    ]
  },
  {
    id: "husqvarna-group",
    name: "Husqvarna Group",
    country: "瑞典",
    listed: true,
    website: "https://www.husqvarna.com/",
    logo: "/logos/husqvarna.svg",
    description:
      "Husqvarna 深耕机器人割草与专业园林服务，Ceora 平台覆盖市政与球场级应用。",
    tags: ["上市公司", "机器人", "商用"],
    highlights: [
      "Automower 与 Ceora 构建多场景产品矩阵",
      "EPOS 无线定位与 Fleet Services 平台",
      "机器人割草全球市占率领先"
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
            name: "Ceora 系统",
            taxonomyPath: ["机器人", "商用"],
            children: [{ id: "ceora-544", name: "Ceora 544" }]
          },
          {
            id: "husqvarna-automower-pro",
            name: "Automower 专业版",
            taxonomyPath: ["机器人", "专业"],
            children: [{ id: "automower-550-epos", name: "Automower 550 EPOS" }]
          }
        ]
      }
    ]
  },
  {
    id: "john-deere",
    name: "John Deere",
    country: "美国",
    listed: true,
    website: "https://www.deere.com/",
    logo: "/logos/john-deere.svg",
    description:
      "John Deere 在农机和草坪管理领域提供从零转割草到球场机械的全套解决方案。",
    tags: ["上市公司", "乘骑式", "商用"],
    highlights: [
      "ZTrak 系列覆盖轻型到高端商用",
      "Connected Support 提供远程诊断",
      "遍布全球的经销与服务网络"
    ],
    divisions: [
      {
        id: "john-deere-turf",
        name: "Turf & Utility",
        type: "division",
        description: "草坪与园林设备事业部",
        children: [
          {
            id: "john-deere-commercial",
            name: "商用零转割草机",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "john-deere-ztrak", name: "ZTrak" }]
          }
        ]
      }
    ]
  },
  {
    id: "toro",
    name: "The Toro Company",
    country: "美国",
    listed: true,
    website: "https://www.thetorocompany.com/",
    logo: "/logos/toro.svg",
    description:
      "Toro Company 覆盖零转割草、自治割草与场地维护，并通过 Exmark 等品牌服务专业市场。",
    tags: ["上市公司", "乘骑式", "商用"],
    highlights: [
      "Exmark 在北美商用零转市场保持领先",
      "Toro Revolution 推进电动化平台",
      "整合雪地、地下施工等多元品牌"
    ],
    divisions: [
      {
        id: "toro-exmark",
        name: "Exmark",
        type: "brand",
        description: "专注专业级零转割草机",
        children: [
          {
            id: "exmark-zero-turn",
            name: "乘骑式零转平台",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "exmark-lazer-z", name: "Lazer Z" }]
          }
        ]
      },
      {
        id: "toro-turf",
        name: "Toro Turf",
        type: "division",
        description: "Toro 自有品牌乘骑式与自治解决方案",
        children: [
          {
            id: "toro-revolution",
            name: "Revolution 电动平台",
            taxonomyPath: ["乘骑式", "电动"],
            children: [{ id: "toro-revolution-series", name: "Revolution Series" }]
          }
        ]
      }
    ]
  },
  {
    id: "ariensco",
    name: "AriensCo",
    country: "美国",
    listed: false,
    website: "https://www.ariensco.com/",
    logo: "/logos/ariens.svg",
    description:
      "AriensCo 拥有 Ariens 与 Gravely 双品牌，覆盖住宅与商用零转割草平台。",
    tags: ["私有企业", "乘骑式", "商用"],
    highlights: [
      "Ariens 电动与燃油双平台并行",
      "Gravely 面向商用承包商与场地运营",
      "密集的北美经销网络"
    ],
    divisions: [
      {
        id: "ariens-brand",
        name: "Ariens",
        type: "brand",
        description: "住宅与轻商用零转平台",
        children: [
          {
            id: "ariens-zero-turn",
            name: "零转割草机",
            taxonomyPath: ["乘骑式", "民用"],
            children: [{ id: "ariens-zenith", name: "Zenith" }]
          }
        ]
      },
      {
        id: "ariens-gravely",
        name: "Gravely",
        type: "brand",
        description: "商用与电动零转平台",
        children: [
          {
            id: "gravely-electric",
            name: "电动零转",
            taxonomyPath: ["乘骑式", "电动"],
            children: [{ id: "gravely-pro-turn-ev", name: "Pro-Turn EV" }]
          }
        ]
      }
    ]
  },
  {
    id: "stiga-group",
    name: "Stiga Group",
    country: "瑞典",
    listed: false,
    website: "https://www.stiga.com/",
    logo: "/logos/stiga.svg",
    description:
      "Stiga 在欧洲住宅与专业园林市场推出机器人、乘骑式及手持电动工具。",
    tags: ["私有企业", "机器人", "民用"],
    highlights: [
      "Stiga A 系列机器人支持 RTK",
      "多品牌合作覆盖渠道",
      "电池生态与智慧园艺平台"
    ],
    divisions: [
      {
        id: "stiga-robotics",
        name: "Stiga Robotics",
        type: "division",
        description: "机器人割草系列",
        children: [
          {
            id: "stiga-a-series",
            name: "A 系列",
            taxonomyPath: ["机器人", "民用"],
            children: [{ id: "stiga-a1500", name: "A 1500" }]
          }
        ]
      }
    ]
  },
  {
    id: "swisher",
    name: "Swisher Mower & Machine",
    country: "美国",
    listed: false,
    website: "https://www.swisherinc.com/",
    logo: "/logos/swisher.svg",
    description:
      "Swisher 以拖挂式与粗草割草设备著称，面向农场与大面积物业。",
    tags: ["私有企业", "乘骑式", "商用"],
    highlights: [
      "拖挂式 Rough Cut 解决高草杂灌",
      "自制发动机平台与附件体系",
      "美国本土制造"
    ],
    divisions: [
      {
        id: "swisher-roughcut",
        name: "Rough Cut",
        type: "division",
        description: "粗草与拖挂割草平台",
        children: [
          {
            id: "swisher-trail",
            name: "拖挂割草机",
            taxonomyPath: ["拖挂", "商用"],
            children: [{ id: "swisher-rc", name: "Rough Cut" }]
          }
        ]
      }
    ]
  },
  {
    id: "doosan-bobcat",
    name: "Doosan Bobcat",
    country: "韩国",
    listed: true,
    website: "https://www.bobcat.com/",
    logo: "/logos/bobcat.svg",
    description:
      "Bobcat 拓展至地面维护设备，推出高性能零转与紧凑型工具。",
    tags: ["上市公司", "乘骑式", "商用"],
    highlights: [
      "ZT7000 面向高端承包商",
      "整合多功能工具载具",
      "服务网络覆盖全球 100+ 国家"
    ],
    divisions: [
      {
        id: "bobcat-turf",
        name: "Bobcat Turf",
        type: "division",
        description: "零转割草与场地维护",
        children: [
          {
            id: "bobcat-zero-turn",
            name: "零转割草机",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "bobcat-zt7000", name: "ZT7000" }]
          }
        ]
      }
    ]
  },
  {
    id: "greenworks",
    name: "Greenworks (Globe Tools)",
    country: "中国",
    listed: false,
    website: "https://www.greenworkstools.com/",
    logo: "/logos/greenworks.svg",
    description:
      "Greenworks 在 24V~82V 电池平台上推出住宅到轻商用的园林设备。",
    tags: ["私有企业", "机器人", "民用"],
    highlights: [
      "Optimow 系列覆盖多面积段",
      "82V Commercial 系列提升续航",
      "智能互联 App 与远程诊断"
    ],
    divisions: [
      {
        id: "greenworks-robotics",
        name: "Optimow",
        type: "brand",
        description: "机器人割草产品线",
        children: [
          {
            id: "greenworks-optimow",
            name: "Optimow 系列",
            taxonomyPath: ["机器人", "民用"],
            children: [{ id: "optimow-50h", name: "Optimow 50H" }]
          }
        ]
      }
    ]
  },
  {
    id: "mtd-holdings",
    name: "MTD Holdings",
    country: "美国",
    listed: false,
    website: "https://www.mtdproducts.com/",
    logo: "/logos/mtd.svg",
    description:
      "MTD Holdings 运营 Cub Cadet、Troy-Bilt 等品牌，为北美住宅和轻商用提供平台。",
    tags: ["私有企业", "乘骑式", "民用"],
    highlights: [
      "Cub Cadet Ultima 平台强化舒适性",
      "专业 OEM 能力支撑多品牌",
      "与 Stanley Black & Decker 深度整合"
    ],
    divisions: [
      {
        id: "mtd-cub-cadet",
        name: "Cub Cadet",
        type: "brand",
        description: "住宅与轻商用零转平台",
        children: [
          {
            id: "cub-cadet-ultima",
            name: "Ultima 系列",
            taxonomyPath: ["乘骑式", "民用"],
            children: [{ id: "cub-cadet-zt1", name: "Ultima ZT" }]
          }
        ]
      }
    ]
  },
  {
    id: "tti",
    name: "Techtronic Industries",
    shortName: "TTI",
    country: "中国香港",
    listed: true,
    website: "https://www.ttigroup.com/",
    logo: "/logos/ryobi.svg",
    description:
      "TTI 通过 Ryobi、Milwaukee 等品牌在 DIY 与专业市场提供电动工具及园林解决方案。",
    tags: ["上市公司", "民用", "电动"],
    highlights: [
      "Ryobi 80V 平台覆盖乘骑式",
      "ONE+ 与 40V 系列构建生态",
      "数字化互联与订阅服务探索"
    ],
    divisions: [
      {
        id: "tti-ryobi",
        name: "Ryobi Outdoor",
        type: "brand",
        description: "Ryobi 园林电动平台",
        children: [
          {
            id: "ryobi-ride-on",
            name: "乘骑式与零转",
            taxonomyPath: ["乘骑式", "电动"],
            children: [{ id: "ryobi-80v", name: "80V Ride-on" }]
          }
        ]
      }
    ]
  },
  {
    id: "chervon",
    name: "Chervon Group",
    country: "中国",
    listed: true,
    website: "https://www.chervongroup.com/",
    logo: "/logos/ego.svg",
    description:
      "Chervon 旗下 EGO Power+ 打造 56V ARC Lithium 电池平台，覆盖从手持到乘骑式设备。",
    tags: ["上市公司", "乘骑式", "电动"],
    highlights: [
      "Z6 系列实现多电池换装",
      "Smart Control 应用实现远程监控",
      "全球化制造与渠道布局"
    ],
    divisions: [
      {
        id: "chervon-ego",
        name: "EGO Power+",
        type: "brand",
        description: "EGO 乘骑式与零转平台",
        children: [
          {
            id: "ego-zero-turn",
            name: "Z6 零转",
            taxonomyPath: ["乘骑式", "电动"],
            children: [{ id: "ego-z6", name: "Z6" }]
          }
        ]
      }
    ]
  },
  {
    id: "scag",
    name: "Scag Power Equipment",
    country: "美国",
    listed: false,
    website: "https://www.scag.com/",
    logo: "/logos/scag.svg",
    description:
      "Scag 以重载零转割草机著称，为专业承包商和设施维护提供高耐久平台。",
    tags: ["私有企业", "乘骑式", "商用"],
    highlights: [
      "Turf Tiger II 聚焦高端商用",
      "独家 Velocity Plus 甲板提升效率",
      "强大的经销与零部件体系"
    ],
    divisions: [
      {
        id: "scag-commercial",
        name: "Scag Commercial",
        type: "division",
        description: "重载零转平台",
        children: [
          {
            id: "scag-turf-tiger",
            name: "Turf Tiger II",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "scag-turf-tiger-ii", name: "Turf Tiger II" }]
          }
        ]
      }
    ]
  },
  {
    id: "wright",
    name: "Wright Manufacturing",
    country: "美国",
    listed: false,
    website: "https://www.wrightmfg.com/",
    logo: "/logos/wright.svg",
    description:
      "Wright 专注站立式与紧凑型零转割草机，服务专业园林承包商。",
    tags: ["私有企业", "乘骑式", "商用"],
    highlights: [
      "Stander 系列定义站立式标准",
      "Aero Core 甲板设计优化气流",
      "持续布局电动化与互联系统"
    ],
    divisions: [
      {
        id: "wright-stander",
        name: "Stander 平台",
        type: "division",
        description: "站立式零转割草机",
        children: [
          {
            id: "wright-stander-series",
            name: "Stander 系列",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "wright-stander-b", name: "Stander B" }]
          }
        ]
      }
    ]
  },
  {
    id: "mean-green",
    name: "Mean Green Mowers",
    country: "美国",
    listed: false,
    website: "https://meangreenproducts.com/",
    logo: "/logos/meangreen.svg",
    description:
      "Mean Green 聚焦全电动商用零转平台，提供长续航与智慧互联能力。",
    tags: ["私有企业", "乘骑式", "电动"],
    highlights: [
      "EVO-74 续航可达 8 小时",
      "整合 SmartDeck 即时调节",
      "Generac 收购后扩展渠道"
    ],
    divisions: [
      {
        id: "mean-green-commercial",
        name: "Mean Green Commercial",
        type: "division",
        description: "全电动商用平台",
        children: [
          {
            id: "mean-green-evo",
            name: "EVO 系列",
            taxonomyPath: ["乘骑式", "电动"],
            children: [{ id: "mean-green-evo-74", name: "EVO" }]
          }
        ]
      }
    ]
  },
  {
    id: "stihl",
    name: "Stihl Group",
    country: "德国",
    listed: false,
    website: "https://www.stihl.com/",
    logo: "/logos/stihl.svg",
    description:
      "Stihl 在手持、电池与机器人割草等园林设备领域拥有全球影响力。",
    tags: ["私有企业", "机器人", "民用"],
    highlights: [
      "iMOW EVO 支持智能避障",
      "AP 系列电池平台扩展至商用",
      "全球自建渠道体系"
    ],
    divisions: [
      {
        id: "stihl-robotics",
        name: "iMOW",
        type: "brand",
        description: "Stihl 机器人割草平台",
        children: [
          {
            id: "stihl-imow",
            name: "iMOW 系列",
            taxonomyPath: ["机器人", "民用"],
            children: [{ id: "stihl-imow-7-evo", name: "iMOW 7 EVO" }]
          }
        ]
      }
    ]
  },
  {
    id: "textron",
    name: "Textron Inc.",
    country: "美国",
    listed: true,
    website: "https://www.textron.com/",
    logo: "/logos/jacobsen.svg",
    description:
      "Textron 旗下 Jacobsen、Cushman 等品牌覆盖高端草坪与球场机械。",
    tags: ["上市公司", "商用", "乘骑式"],
    highlights: [
      "Jacobsen Eclipse 聚焦球场养护",
      "采用锂电混合动力方案",
      "全球球场服务经验"
    ],
    divisions: [
      {
        id: "textron-jacobsen",
        name: "Jacobsen",
        type: "brand",
        description: "球场与高端草坪设备",
        children: [
          {
            id: "jacobsen-eclipse",
            name: "Eclipse 混动平台",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "jacobsen-eclipse-322", name: "Eclipse 322" }]
          }
        ]
      }
    ]
  },
  {
    id: "honda",
    name: "Honda Motor Co.",
    country: "日本",
    listed: true,
    website: "https://global.honda/",
    logo: "/logos/honda.svg",
    description:
      "Honda 在小型发动机与机器人割草领域持续创新，Miimo 系列覆盖高端住宅。",
    tags: ["上市公司", "机器人", "民用"],
    highlights: [
      "Miimo 支持智能路径规划",
      "自研发动机与电池平台",
      "全球售后服务网络"
    ],
    divisions: [
      {
        id: "honda-robotics",
        name: "Miimo",
        type: "brand",
        description: "机器人割草平台",
        children: [
          {
            id: "honda-miimo",
            name: "Miimo 系列",
            taxonomyPath: ["机器人", "民用"],
            children: [{ id: "honda-miimo-hrm3000", name: "Miimo HRM" }]
          }
        ]
      }
    ]
  },
  {
    id: "kubota",
    name: "Kubota Corp.",
    country: "日本",
    listed: true,
    website: "https://www.kubota.com/",
    logo: "/logos/kubota.svg",
    description:
      "Kubota 在农机、场地及施工设备领域提供柴油零转与自治解决方案。",
    tags: ["上市公司", "乘骑式", "商用"],
    highlights: [
      "ZD 系列采用柴油动力与商用甲板",
      "探索自治割草平台",
      "亚洲至全球的制造布局"
    ],
    divisions: [
      {
        id: "kubota-turf",
        name: "Kubota Turf",
        type: "division",
        description: "柴油零转与前置甲板",
        children: [
          {
            id: "kubota-zd",
            name: "ZD 系列",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "kubota-zd1611", name: "ZD" }]
          }
        ]
      }
    ]
  },
  {
    id: "bad-boy",
    name: "Bad Boy Mowers",
    country: "美国",
    listed: false,
    website: "https://badboymowers.com/",
    logo: "/logos/badboy.svg",
    description:
      "Bad Boy 主打高性能零转割草机，覆盖住宅与商用区间。",
    tags: ["私有企业", "乘骑式", "商用"],
    highlights: [
      "Rebel、Rogue 等系列覆盖多甲板",
      "集成全悬挂座椅提升舒适度",
      "持续推出电动化概念机"
    ],
    divisions: [
      {
        id: "badboy-commercial",
        name: "Bad Boy Commercial",
        type: "division",
        description: "高性能零转平台",
        children: [
          {
            id: "badboy-rebel",
            name: "Rebel 系列",
            taxonomyPath: ["乘骑式", "商用"],
            children: [{ id: "badboy-rebel-series", name: "Rebel" }]
          }
        ]
      }
    ]
  }
];
