// 原始 JSON 数据的格式
interface RawCommand {
    signature: string;
    commandBase: string;
    description: string;
    examples: { description: string; command: string }[];
    note: string;
    overloads: string[];  // 新增的 overloads 字段
}

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

import * as fs from 'fs';

function buildGGBIndex(filePath: string, outputPath: string) {
    // 1. 读取原始数据
    const rawData: RawCommand[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const indexTree: CommandIndexTree = {};

    rawData.forEach((item) => {
        const base = item.commandBase;
        const key = base.toLowerCase();

        // 2. 初始化分类节点
        if (!indexTree[key]) {
            indexTree[key] = {
                commandBase: base,
                overloads: []
            };
        }

        // 3. 处理每个重载签名（使用 overloads 字段或回退到 signature）
        const overloadSignatures = item.overloads && item.overloads.length > 0 
            ? item.overloads 
            : [item.signature];

        overloadSignatures.forEach((sig) => {
            // 提取参数类型
            // 匹配 <Object>, <Number> 等标签
            const paramMatches = sig.match(/<([^>]+)>/g) || [];
            const paramTypes = paramMatches.map(p => p.replace(/[<>]/g, '').trim());

            // 4. 构建重载对象
            const overload: CommandOverload = {
                signature: sig,
                paramCount: paramTypes.length,
                paramTypes: paramTypes,
                description: item.description,
                examples: item.examples || [],
                note: item.note || ""
            };

            // 避免重复添加相同的重载
            const exists = indexTree[key].overloads.some(
                o => o.signature === overload.signature
            );
            
            if (!exists) {
                indexTree[key].overloads.push(overload);
            }
        });
    });

    // 5. 将结果写入文件
    fs.writeFileSync(outputPath, JSON.stringify(indexTree, null, 2));
    console.log(`✅ 索引构建成功! 包含 ${Object.keys(indexTree).length} 个基础命令。`);
    
    // 统计重载信息
    const totalOverloads = Object.values(indexTree).reduce((sum, cmd) => sum + cmd.overloads.length, 0);
    console.log(`📊 总共有 ${totalOverloads} 个命令重载。`);
}

// 执行构建
buildGGBIndex('lib/geogebra-lint-core/core/specs/commandSignatures.json', 'lib/geogebra-lint-core/core/specs/commandsIndexTree.json');
