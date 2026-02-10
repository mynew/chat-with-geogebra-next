import { ToolUISearchGeoGebraCommands } from "./ToolUISearchGeoGebraComands";
import { ToolUISetPerspective } from "./ToolUISetPerspective";
import { ToolUIResetGeoGebra } from "./ToolUIResetGeoGebra";
import { ToolUIGetCanvasContext } from "./ToolUIGetCanvasContext";
import { ToolUIExecuteGeoGebraCommand } from "./ToolUIExecuteGeoGebraCommand";
import { ToolUIGetSelectedObjects } from "./ToolUIGetSelectedObjects";
import { ToolUIEvalLaTeX } from "./ToolUIEvalLaTeX";
import { ToolUIDefault } from "./ToolUIDefault";

export function getToolUIComponent(type: string, part: any) {
  switch (type) {
    case "tool-searchGeoGebraCommands":
      return ToolUISearchGeoGebraCommands(part);
    case "tool-setPerspective":
      return ToolUISetPerspective(part);
    case "tool-resetGeoGebra":
      return ToolUIResetGeoGebra(part);
    case "tool-getSelectedObjects":
      return ToolUIGetSelectedObjects(part);
    case "tool-getCanvasContext":
      return ToolUIGetCanvasContext(part);
    case "tool-executeGeoGebraCommand":
      return ToolUIExecuteGeoGebraCommand(part);
    case "tool-evalLaTeX":
      return ToolUIEvalLaTeX(part);
    default:
      return ToolUIDefault(part);
  }
}
