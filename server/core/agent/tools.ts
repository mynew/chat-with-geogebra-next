import { z } from "zod"
import { searchGeoGebraCommands } from "@/server/core/geogebra/searchGeoGebraCommands"
import { tool } from "ai";

const tools = {
  searchGeoGebraCommands: tool({
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "要搜索的 GeoGebra 命令关键词，要为英文，多个关键词请用空格分隔"
        ),
    }),
    outputSchema: z.array(
      z.object({
        commandBase: z.string().describe("命令基础名称"),
        overloads: z
          .array(
            z.object({
              signature: z.string().describe("命令签名"),
              paramCount: z.number().describe("参数数量"),
              paramTypes: z.array(z.string()).describe("参数类型列表"),
              description: z.string().describe("命令描述"),
              examples: z
                .array(
                  z.object({
                    description: z.string().describe("示例描述"),
                    command: z.string().describe("示例命令"),
                  })
                )
                .describe("命令示例列表"),
              note: z.string().describe("附加说明"),
            })
          )
          .describe("命令重载列表"),
      })
    ),
    description: "搜索 GeoGebra 命令库以查找相关命令",
    execute: async ({ query }: { query: string }) => {
      try {
        let searchResults = searchGeoGebraCommands(query, 10);
        return searchResults;
      } catch (error) {
        return [];
      }
    },
  }),
  getCanvasContext: tool({
    inputSchema: z.object({}),
    outputSchema: z.object({
      elements: z
        .array(z.record(z.string(), z.any()))
        .describe("当前画布上的所有几何元素的列表"),
      expressions: z
        .array(z.record(z.string(), z.any()))
        .describe("当前画布上的所有表达式的列表"),
      selectedObjects: z
        .array(z.string())
        .describe("当前用户选中的 GeoGebra 对象标签列表"),
    }),
    description: "获取当前 GeoGebra 画布的 JSON 状态",
  }),
  // getPNGBase64: tool({
  //   inputSchema: z.object({
  //     exportScale: z.number().describe("导出图片的缩放比例，默认请传入 1"),
  //     transparent: z.boolean().describe("是否导出透明背景的图片"),
  //     DPI: z.number().describe("导出图片的分辨率，默认请传入 96"),
  //   }),
  //   outputSchema: z.object({
  //     pngBase64: z.string().describe("导出的 PNG 图片的 Base64 编码字符串"),
  //   }),
  //   description: "获取当前 GeoGebra 画布的 PNG 图片的 Base64 编码字符串",
  // }),
  executeGeoGebraCommand: tool({
    inputSchema: z.object({
      command: z.string().describe("要在 GeoGebra 中执行的命令字符串"),
    }),
    outputSchema: z
      .object({
        success: z.boolean().describe("命令是否成功执行"),
        label: z.string().nullable().describe("命令生成的对象标签，如果有的话"),
        error: z.string().nullable().describe("如果执行失败，返回错误信息"),
      })
      .describe("命令执行结果"),
    description: "在 GeoGebra 画布中执行指定的命令",
  }),
  // evalLaTeX: tool({
  //   inputSchema: z.object({
  //     latex: z.string().describe("要在 GeoGebra 中执行的 LaTeX 字符串"),
  //   }),
  //   outputSchema: z
  //     .object({
  //       success: z.boolean().describe("LaTeX 命令是否成功执行"),
  //     })
  //     .describe("LaTeX 命令执行结果"),
  //   description: "在 GeoGebra 画布中执行指定的 LaTeX 命令",
  // }),
  deleteGeoGebraObject: tool({
    inputSchema: z.object({
      label: z.string().describe("要删除的 GeoGebra 对象标签"),
    }),
    outputSchema: z.object({
      success: z.boolean().describe("是否成功删除对象"),
    }),
    description: "从 GeoGebra 画布中删除指定的对象",
  }),
  resetGeoGebra: tool({
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean().describe("是否成功重置 GeoGebra 画布"),
    }),
    description: "重置 GeoGebra 画布到初始状态",
  }),
  setUndoPoint: tool({
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean().describe("是否成功设置撤销点"),
    }),
    description: "在 GeoGebra 画布中设置一个撤销点",
  }),
  undo: tool({
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean().describe("是否成功执行撤销操作"),
    }),
    description: "在 GeoGebra 画布中执行撤销操作",
  }),
  setPerspective: tool({
    inputSchema: z.object({
      mode: z
        .string()
        .describe(
          "视图模式，'A' 表示 Algebra模式，'B' 表示 Probability模式，'G' 表示 2D Graphics模式，'T'表示 3D Graphics模式"
        ),
    }),
    outputSchema: z.object({
      success: z.boolean().describe("是否成功切换视图模式"),
    }),
    description: "切换 GeoGebra 画布的视图模式",
  }),
  getSelectedObjects: tool({
    inputSchema: z.object({}),
    outputSchema: z.object({
      selectedObjects: z
        .array(z.string())
        .describe("当前用户选中的 GeoGebra 对象标签列表"),
    }),
    description: "获取当前用户在 GeoGebra 画布中选中的对象标签列表",
  }),
};

export { tools };