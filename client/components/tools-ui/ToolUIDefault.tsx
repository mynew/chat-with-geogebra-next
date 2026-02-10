export const ToolUIDefault = (part: any) => {
  switch (part.state) {
    case "input-streaming":
      return "思考中...";
    case "input-available":
      return `调用函数中...`;
    case "output-available":
      return "函数调用完毕";
    case "output-error":
      return `调用出错: ${part.output}`;
  }
};
