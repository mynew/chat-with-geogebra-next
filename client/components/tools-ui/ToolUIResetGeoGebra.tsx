
export const ToolUIResetGeoGebra = (part: any) => {
  switch (part.state) {
    case "input-streaming":
      return `寻找黑板擦...`;
    case "input-available":
      return `准备擦除黑板...`;
    case "output-available":
      return `黑板已被擦除`;
    case "output-error":
      return `擦除黑板时出错: ${part.output.error}`;
  }
};
