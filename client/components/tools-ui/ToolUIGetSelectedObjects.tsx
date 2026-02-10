
export const ToolUIGetSelectedObjects = (part: any) => {
  switch (part.state) {
    case "input-streaming":
      return `偷瞄画板中...`;
    case "input-available":
      return `获取画板内容...`;
    case "output-available":
      return `获取画板内容(已读取)`;
    case "output-error":
      return `获取画板内容时出错: ${part.output.error}`;
  }
};
