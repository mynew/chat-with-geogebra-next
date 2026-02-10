
export const ToolUIEvalLaTeX = (part: any) => {
  switch (part.state) {
    case "input-streaming":
      return "思考中...";
    case "input-available":
      return `添加标签: ${part.input.latex}...`;
    case "output-available":
      const result = part.output;
      return `添加标签: ${part.input.latex}(成功)`;
    case "output-error":
      return `添加标签: ${part.input.latex} 时出错`;
  }
};
