import { mockCompanies } from "@/data/mock-companies";
import {
  type Company,
  type DivisionDefinition,
  type DivisionNode,
  type ProductCategoryDefinition,
  type ProductCategoryNode,
  type SeriesDefinition,
  type SeriesNode
} from "@/types/domain";
import { loadAllProducts } from "@/lib/server/products";

type ProductRecord = Awaited<ReturnType<typeof loadAllProducts>>[number];

function buildSeriesNode(series: SeriesDefinition, productsBySeries: Map<string, ProductRecord[]>): SeriesNode {
  const products = productsBySeries.get(series.id) ?? [];
  return { ...series, products };
}

function collectSeriesProducts(products: ProductRecord[]) {
  const map = new Map<string, ProductRecord[]>();
  for (const product of products) {
    if (!map.has(product.seriesId)) {
      map.set(product.seriesId, []);
    }
    map.get(product.seriesId)!.push(product);
  }
  return map;
}

function buildCategoryNode(
  category: ProductCategoryDefinition,
  products: ProductRecord[]
): ProductCategoryNode {
  const seriesProductMap = collectSeriesProducts(products);
  const seriesNodes: SeriesNode[] = category.children.map((series) => buildSeriesNode(series, seriesProductMap));
  const definedSeriesIds = new Set(category.children.map((series) => series.id));

  const extraSeries = Array.from(seriesProductMap.entries())
    .filter(([seriesId]) => !definedSeriesIds.has(seriesId))
    .map(([seriesId, seriesProducts]) => ({
      id: seriesId,
      name: seriesProducts[0]?.brandName ?? "未命名系列",
      description: undefined,
      products: seriesProducts
    } satisfies SeriesNode));

  const nodes = [...seriesNodes, ...extraSeries].filter((node) => node.products.length > 0);
  return { ...category, children: nodes };
}

function buildDivisionNode(
  division: DivisionDefinition,
  products: ProductRecord[]
): DivisionNode {
  const categories = division.children.map((category) => {
    const categoryProducts = products.filter((product) => product.categoryId === category.id);
    return buildCategoryNode(category, categoryProducts);
  });

  const definedCategoryIds = new Set(division.children.map((category) => category.id));
  const extraProducts = products.filter((product) => !definedCategoryIds.has(product.categoryId));

  if (extraProducts.length > 0) {
    const fallbackCategory: ProductCategoryNode = buildCategoryNode(
      {
        id: `${division.id}-unassigned`,
        name: "未分配品类",
        taxonomyPath: ["未分类"],
        children: []
      },
      extraProducts
    );
    categories.push(fallbackCategory);
  }

  return { ...division, children: categories.filter((category) => category.children.length > 0) };
}

export function getCompanyList(): Company[] {
  return mockCompanies;
}

export async function getCompanyWithMatrix(companyId: string): Promise<Company | undefined> {
  const company = mockCompanies.find((item) => item.id === companyId);
  if (!company) {
    return undefined;
  }
  const products = await loadAllProducts();
  const companyProducts = products.filter((product) => product.companyId === companyId);

  const divisions = company.divisions.map((division) => {
    const divisionProducts = companyProducts.filter((product) => product.divisionId === division.id);
    return buildDivisionNode(division, divisionProducts);
  });

  const definedDivisionIds = new Set(company.divisions.map((division) => division.id));
  const extraProducts = companyProducts.filter((product) => !definedDivisionIds.has(product.divisionId));
  if (extraProducts.length > 0) {
    divisions.push(
      buildDivisionNode(
        {
          id: `${company.id}-unassigned`,
          name: "未分配事业部",
          type: "division",
          description: "导入数据未匹配到既有事业部",
          children: []
        },
        extraProducts
      )
    );
  }

  return { ...company, divisions };
}
