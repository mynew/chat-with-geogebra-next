import geogebraCommandsIndex from "./commandsIndexTree.json";

// 索引树中的重载信息
interface CommandOverload {
    signature: string;
    paramCount: number;
    paramTypes: string[];
    description: string;
    examples: { description: string; command: string }[];
    note: string;
}

// 最终生成的索引树结构
interface CommandIndexTree {
    [key: string]: {
        commandBase: string;
        overloads: CommandOverload[];
    };
}

// 搜索结果结构
type SearchResult = {
    commandBase: string;
    overloads: Array<{
        signature: string;
        paramCount: number;
        paramTypes: string[];
        description: string;
        examples: { description: string; command: string }[];
        note: string;
    }>;
    score: number;
}[];

function searchGeogebraCommand(query: string, topN: number) {
  const lowerQuery = query.toLowerCase();
  const results: SearchResult = [];
  const commandsTree = geogebraCommandsIndex as CommandIndexTree;

  // 构建倒排索引：字符 -> 包含该字符的命令列表
  const invertedIndex: Map<string, Set<string>> = new Map();
  for (const key in commandsTree) {
    for (const char of key.toLowerCase()) {
      if (!invertedIndex.has(char)) {
        invertedIndex.set(char, new Set());
      }
      invertedIndex.get(char)!.add(key);
    }
  }

  // 使用倒排索引快速筛选候选命令
  const candidates = new Set<string>();
  for (const char of lowerQuery) {
    const matches = invertedIndex.get(char);
    if (matches) {
      matches.forEach((key) => candidates.add(key));
    }
  }

  // 模糊匹配评分函数（编辑距离 + 子序列匹配）
  function fuzzyScore(str: string, query: string): number {
    str = str.toLowerCase();
    let score = 0;
    let queryIndex = 0;

    // 子序列匹配
    for (let i = 0; i < str.length && queryIndex < query.length; i++) {
      if (str[i] === query[queryIndex]) {
        score += 10; // 字符匹配得分
        if (i === queryIndex) score += 5; // 位置完全匹配额外加分
        queryIndex++;
      }
    }

    // 完整匹配所有查询字符
    if (queryIndex === query.length) {
      score += 20;
      // 如果是前缀匹配，额外加分
      if (str.startsWith(query)) score += 30;
      // 如果完全相等，最高分
      if (str === query) score += 50;
    }

    return score;
  }

  // 对候选命令进行评分和过滤
  for (const key of candidates) {
    const score = fuzzyScore(key, lowerQuery);
    if (score > 0) {
      const entry = commandsTree[key];
      results.push({
        commandBase: entry.commandBase,
        overloads: entry.overloads.map((overload: any) => ({
          signature: overload.signature,
          paramCount: overload.paramCount,
          paramTypes: overload.paramTypes,
          description: overload.description,
          examples: overload.examples,
          note: overload.note,
        })),
        score,
      });
    }
  }

  // 按分数降序排序
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topN).map(({ commandBase, overloads }) => ({
    commandBase,
    overloads,
  }));
}

// 搜索 GeoGebra 命令的函数
export function searchGeoGebraCommands(query: string, topN: number) {
  console.log("搜索: ", query);
  let result: any[] = [];
  let singleQuery = query.split(" ");
  let singleTopN = Math.ceil(topN / singleQuery.length);

  for (let q of singleQuery) {
    let partialResults = searchGeogebraCommand(q, singleTopN);
    result = result.concat(partialResults);
  }

  // 合并重复命令，取最高分
  const mergedResultsMap: Map<string, any> = new Map();
  for (let res of result) {
    if (mergedResultsMap.has(res.commandBase)) {
      let existing = mergedResultsMap.get(res.commandBase);
      existing.score = Math.max(existing.score, res.score);
    } else {
      mergedResultsMap.set(res.commandBase, res);
    }
  }

  let mergedResults = Array.from(mergedResultsMap.values());

  // 最终排序并截取前 topN
  mergedResults.sort((a, b) => b.score - a.score);

  return mergedResults.slice(0, topN).map(({ commandBase, overloads }) => ({
    commandBase,
    overloads,
  }));
}
