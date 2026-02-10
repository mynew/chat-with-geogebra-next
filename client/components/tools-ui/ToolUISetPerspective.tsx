export const ToolUISetPerspective = (part: any) => {
  switch (part.state) {
    case "input-streaming":
      return `思考中...`;
    case "input-available":
      return `设置视角为: ${part.input.mode}...`;
    case "output-available":
      return `视角设置成功: ${part.input.mode}`;
    case "output-error":
      return `设置视角时出错: ${part.output.error}`;
  }
};
