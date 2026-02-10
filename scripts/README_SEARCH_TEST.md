# GeoGebra 命令搜索测试脚本使用说明

## 脚本位置
`scripts/test-search-commands.ts`

## 功能说明
这个脚本用于通过命令行界面（CLI）测试 `searchGeoGebraCommands` 函数，可以快速搜索和查看 GeoGebra 命令的详细信息。

## 使用方法

### 方式一：使用 npm 脚本（推荐）
```bash
pnpm search:test <查询词>
```

### 方式二：直接使用 tsx
```bash
pnpm tsx scripts/test-search-commands.ts <查询词>
```

## 使用示例

### 搜索圆形命令
```bash
pnpm search:test Circle
```

### 搜索点命令
```bash
pnpm search:test Point
```

### 搜索线命令
```bash
pnpm search:test Line
```

### 搜索交点命令
```bash
pnpm search:test Intersect
```

### 搜索角平分线命令
```bash
pnpm search:test AngleBisector
```

## 输出格式

脚本会输出以下信息：

1. **匹配的命令数量**
2. 对于每个命令：
   - 命令基本名称
   - 重载数量
   - 每个重载的详细信息：
     - 签名
     - 参数数量
     - 参数类型
     - 描述
     - 注意事项
     - 使用示例

## 输出示例

```
🔍 搜索 GeoGebra 命令: "Point"

================================================================================

✅ 找到 5 个匹配的命令:

1. 命令: Point
   重载数量: 3

   重载 1:
   ├─ 签名: Point( <Object> )
   ├─ 参数数量: 1
   ├─ 参数类型: Object
   ├─ 描述: Creates a new point on the object.
   └─ 示例:
      • Create a point on line
        命令: Point(Line((0,0),(1,1)))

--------------------------------------------------------------------------------

✨ 搜索完成! 共找到 5 个命令
```

## 注意事项

- 查询词不区分大小写
- 使用模糊匹配算法，可以匹配部分单词
- 搜索结果按相关度评分排序
- 如果没有找到匹配的命令，会提示 "未找到匹配的命令"

## 相关文件

- 搜索函数实现：`app/core/geogebra/searchGeoGebraCommands.ts`
- 命令索引数据：`app/core/geogebra/commandsIndexTree.json`

## 开发建议

可以使用这个脚本来：
- 验证搜索功能是否正常工作
- 测试不同查询词的搜索结果
- 检查命令索引数据的完整性
- 调试搜索算法的评分机制
