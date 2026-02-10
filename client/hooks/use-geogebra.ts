"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { xml2json } from "xml-js";

declare global {
  interface Window {
    ggbLastCommandError: string;
    ggbApplet: any;
    ggbAppletReady: boolean;
    GGBApplet: any;
  }
}

let ggbAppletSelection: string[] = [];

export interface GeoGebraCommands {
  isReady: boolean;
  rebuild: () => boolean;
  reset: () => void;
  setSize: (width: number, height: number) => void;
  executeCommands: (
    commands: string[]
  ) => Promise<{ success: boolean; label: string; error: string }[]>;
  executeCommand: (
    cmd: string
  ) => Promise<{ success: boolean; label: string; error: string }>;
  getCanvasContext: () => Record<string, any>;
  setUndoPoint: () => boolean;
  undo: () => boolean;
  deleteGeoGebraObject: (label: string) => boolean;
  setPerspective: (mode: string) => boolean;
  evalLaTeX: (latex: string) => boolean;
  getPNGBase64: (
    exportScale: number,
    transparent: boolean,
    DPI: number
  ) => string;
  getSelectedObjects: () => string[];
}

export function useGeoGebra(): GeoGebraCommands {
  // ==================== State 状态管理 ====================
  const [isReady, setIsReady] = useState(false);

  // ==================== Refs 引用管理 ====================
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const appletInitializedRef = useRef(false);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createGGBApplet = useCallback(() => {
    if (typeof window.GGBApplet !== "undefined") {
      const ggbAppParams = {
        appName: "classic",
        width: "100%",
        height: "100%",
        showToolBar: true,
        showAlgebraInput: false,
        showMenuBar: true,
        enableLabelDrags: false,
        enableShiftDragZoom: true,
        enableRightClick: true,
        enable3d: true,
        enableUndoRedo: true,
        errorDialogsActive: false,
        showResetIcon: true,
        useBrowserForJS: false,
        allowStyleBar: false,
        scaleContainerClass: "geogebra-container",
        preventFocus: false,
        language: "en",
        appletOnLoad: (ggbApi: any) => {
          window.ggbAppletReady = true;
          appletInitializedRef.current = true;
          const ggbContainer = document.getElementById("geogebra-container");
          ggbApi.setSize(ggbContainer?.clientWidth, ggbContainer?.clientHeight);
          // 设置事件监听器等
          ggbApi.registerClientListener(
            (event: { type: string; target: string; arguement: string }) => {
              switch (event.type) {
                case "select":
                  ggbAppletSelection.push(event.target);
                  break;
                case "deselect":
                  ggbAppletSelection = ggbAppletSelection.filter(
                    (label) => label !== event.target
                  );
                  break;
                default:
                  break;
              }
            }
          );
          setIsReady(true);
        },
      };

      // Desktop GeoGebra
      const ggbContainer = document.getElementById("geogebra-container");
      if (ggbContainer) {
        const ggbApp = new window.GGBApplet(ggbAppParams, true);
        ggbApp.setHTML5Codebase("GeoGebra/HTML5/5.0/web3d/");
        ggbApp.inject("geogebra-container");
      } else {
        ;
      }
    } else {
      ;
    }
  }, []);

  const initGeoGebraApplet = useCallback(() => {
    window.ggbLastCommandError = "";

    // 防止重复加载脚本 - 检查是否已经初始化或脚本已存在
    if (appletInitializedRef.current) {
      console.log("GeoGebra 已初始化，跳过");
      return;
    }

    // 检查是否已经有脚本在DOM中
    const existingScript = document.querySelector(
      'script[src="GeoGebra/deployggb.js"]'
    );
    if (existingScript) {
      console.log("GeoGebra 脚本已存在，跳过加载");
      scriptRef.current = existingScript as HTMLScriptElement;
      return;
    }

    const script = document.createElement("script");
    scriptRef.current = script;
    script.src = "GeoGebra/deployggb.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      createGGBApplet();
    };
  }, []);

  // ==================== GeoGebra 初始化 ====================
  useEffect(() => {
    initGeoGebraApplet();
  }, []);

  // ==================== 尺寸管理相关 ====================
  // 设置GeoGebra大小的内部方法
  const setSizeInternal = useCallback((width: number, height: number) => {
    // 避免重复设置相同的尺寸
    if (
      lastSizeRef.current.width === width &&
      lastSizeRef.current.height === height
    ) {
      return false;
    }

    if (
      window.ggbApplet &&
      typeof window.ggbApplet.setSize === "function" &&
      width > 0 &&
      height > 0
    ) {
      window.ggbApplet.setSize(width, height);
      lastSizeRef.current = { width, height };
      return true;
    }
    return false;
  }, []);

  // 对外暴露的 setSize 方法
  const setSize = useCallback(
    (width: number, height: number) => {
      return setSizeInternal(width, height);
    },
    [setSizeInternal]
  );

  // 监听窗口大小变化
  useEffect(() => {
    if (!isReady) return;

    const handleResize = () => {
      // 使用防抖，避免频繁调整大小
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        const container = document.getElementById("geogebra-container");
        if (container && window.ggbApplet) {
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width > 0 && height > 0) {
            setSizeInternal(width, height);
          }
        }
      }, 200); // 200ms 防抖
    };

    window.addEventListener("resize", handleResize);

    // 初始调整大小
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isReady, setSizeInternal]);

  // ==================== 命令执行相关 ====================
  // 解析并执行LaTeX命令
  const evalLaTeX = useCallback((latex: string): boolean => {
    if (window.ggbApplet) {
      return window.ggbApplet.evalLaTeX(latex);
    }
    return false;
  }, []);

  // 执行单个GeoGebra命令
  const executeCommand = useCallback(
    async (
      cmd: string
    ): Promise<{ success: boolean; label: string; error: string }> => {
      if (window.ggbApplet) {
        const label = await window.ggbApplet.asyncEvalCommandGetLabels(cmd);
        const lastCommandError = window.ggbLastCommandError;

        if (lastCommandError === "") {
          console.log(`命令执行成功: "${cmd}", label: "${label}"`);
        } else {
          console.error(`命令执行失败: "${cmd}"，错误: ${lastCommandError}`);
        }

        // 重置错误状态
        window.ggbLastCommandError = "";
        return {
          success: lastCommandError === "",
          label: label,
          error: lastCommandError,
        };
      }
      throw new Error("GeoGebra applet不可用，无法执行命令");
    },
    []
  );

  // 执行多个GeoGebra命令
  const executeCommands = useCallback(
    async (
      commands: string[]
    ): Promise<{ success: boolean; label: string; error: string }[]> => {
      if (!window.ggbApplet || commands.length === 0) {
        throw new Error("GeoGebra applet不可用或没有命令，无法执行命令");
      }

      console.log(`准备执行${commands.length}个GeoGebra命令`);

      let result: { success: boolean; label: string; error: string }[] = [];
      // 执行所有命令
      for (let command of commands) {
        const res = await executeCommand(command);
        result.push(res);
      }
      return result;
    },
    [executeCommand]
  );

  // 设置撤回记录点
  const setUndoPoint = useCallback(() => {
    if (window.ggbApplet) {
      try {
        window.ggbApplet.setUndoPoint();
        console.log("GeoGebra撤销点设置成功");
        return true;
      } catch (e) {
        console.error("GeoGebra撤销点设置失败:", e);
        return false;
      }
    }
    return false;
  }, []);

  // 撤回
  const undo = useCallback(() => {
    if (window.ggbApplet) {
      try {
        window.ggbApplet.undo();
        console.log("GeoGebra撤销成功");
        return true;
      } catch (e) {
        console.error("GeoGebra撤销失败:", e);
        return false;
      }
    }
    return false;
  }, []);

  const deleteGeoGebraObject = useCallback((label: string) => {
    if (window.ggbApplet) {
      try {
        window.ggbApplet.deleteObject(label);
        console.log(`GeoGebra对象"${label}"删除成功`);
        ggbAppletSelection = ggbAppletSelection.filter((l) => l !== label);
        return true;
      } catch (e) {
        console.error(`GeoGebra对象"${label}"删除失败:`, e);
        return false;
      }
    }
    return false;
  }, []);

  // ==================== 其他操作 ====================
  // 重置GeoGebra
  const reset = useCallback(() => {
    window.ggbLastCommandError = "";
    if (window.ggbApplet) {
      try {
        window.ggbApplet.reset();
        ggbAppletSelection = [];
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }, []);

  // 获取画布上下文
  const extractCanvasContext = function () {
    if (!window.ggbApplet)
      throw new Error("GeoGebra applet不可用，无法获取完整画布上下文");
    const elelemtXMLText = window.ggbApplet.getXML();
    const xmlJson = JSON.parse(xml2json(elelemtXMLText, { compact: true }));
    const context = {
      elements: xmlJson.geogebra.construction.element,
      expressions: xmlJson.geogebra.construction.expression,
    };
    return context;
  };

  // 获取用户选中对象
  const getSelectedObjects = useCallback(() => {
    return ggbAppletSelection;
  }, []);

  const extractCanvasFullContext = function () {
    if (!window.ggbApplet)
      throw new Error("GeoGebra applet不可用，无法获取完整画布上下文");
  };

  // 暴露接口
  const getCanvasContext = useCallback(() => {
    return extractCanvasContext();
  }, []);

  const getCanvasFullContext = useCallback(() => {
    return extractCanvasFullContext();
  }, []);

  const getPNGBase64 = useCallback(
    (exportScale: number, transparent: boolean, DPI: number) => {
      if (window.ggbApplet) {
        return window.ggbApplet.getPNGBase64(exportScale, transparent, DPI);
      }
      return "";
    },
    []
  );

  // 切换视图模式
  const setPerspective = useCallback((mode: string) => {
    console.log("切换视图模式:", mode);
    if (window.ggbApplet) {
      window.ggbApplet.setPerspective(mode);
      return true;
    }
    return false;
  }, []);

  // 重建GeoGebra
  const rebuild = useCallback(() => {
    try {
      createGGBApplet();
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  // ==================== 返回接口 ====================
  return {
    rebuild,
    isReady,
    setSize,
    reset,
    executeCommand,
    executeCommands,
    getCanvasContext,
    setUndoPoint,
    undo,
    deleteGeoGebraObject,
    setPerspective,
    evalLaTeX,
    getPNGBase64,
    getSelectedObjects,
  };
}
