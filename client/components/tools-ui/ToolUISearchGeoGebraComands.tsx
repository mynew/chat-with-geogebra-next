
export const ToolUISearchGeoGebraCommands = (part: any) => {
  switch (part.state) {
    case "input-streaming":
      return "前往图书馆中...";
    case "input-available":
      return `查阅关键词: ${part.input.query}...`;
    case "output-available":
      const commandList = part.output
      if (commandList && commandList.length > 0) {
        return `查阅到 ${commandList.length} 条相关命令`;
      }
      return `未查阅到相关命令`;
    case "output-error":
      return `查阅命令时出错`;
  }
};
