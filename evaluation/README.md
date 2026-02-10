# GeoGebra Agent Evaluation System

用于评估 GeoGebra Agent 性能的评估系统，通过对比 Agent 实际执行的命令与期望的命令，计算准确率并生成评估报告。

## 文件说明

- **`evaluate.ts`**: 核心评估脚本，包含评估逻辑和命令匹配算法
- **`test-evaluate.ts`**: 快速测试脚本，用于测试单个样本
- **`dataset.json`**: 评估数据集（包含10个样本，需要手动填充）
- **`dataset.example.json`**: 评估数据集示例（画圆的例子）

## 使用方法

### 1. 准备数据集

编辑 `dataset.json`，按照以下格式填充样本：

```json
{
  "id": 1,
  "prompt": "画一个以原点为圆心，半径为3的圆",
  "expectedCommands": ["O = (0, 0)", "c = Circle(O, 3)"],
  "coreCommands": ["O = (0, 0)", "c = Circle(O, 3)"],
  "description": "创建圆心在原点、半径为3的圆",
  "category": "basic_geometry"
}
```

**字段说明**：
- `prompt`: 自然语言提示
- `expectedCommands`: 所有期望的 GeoGebra 命令
- `coreCommands`: 核心命令（必须匹配的命令，用于计算核心准确率）
- `description`: 样本描述
- `category`: 类别

### 2. 运行评估

```bash
# 设置环境变量
export API_KEY=your_api_key_here
export MODEL_PROVIDER=deepseek  # 可选，默认 deepseek
export MODEL_TYPE=deepseek-chat  # 可选，默认 deepseek-chat

# 运行完整评估
pnpm exec tsx evaluation/evaluate.ts evaluation/dataset.json

# 保存结果到文件
pnpm exec tsx evaluation/evaluate.ts evaluation/dataset.json evaluation/results.json
```

### 3. 快速测试

```bash
# 测试单个样本（使用 dataset.example.json）
pnpm exec tsx evaluation/test-evaluate.ts
```

## 评估逻辑

### 匹配规则

1. **命令名必须完全匹配**：`Ellipse` ≠ `ImplicitCurve`，`Hyperbola` ≠ `Conic`
2. **参数类型和个数必须匹配**：参数可以是坐标、数字或变量
3. **变量名容差**：如果命令名和参数都匹配，变量名不同也可以接受
   - 例如：`poly1 = Polygon(A, B, C)` 可以匹配 `triangleABC = Polygon(A, B, C)`
4. **Slider 命令宽松匹配**：只要都是 Slider 命令就匹配（参数可以不同）
5. **空格和格式容差**：`(0,0)` 等价于 `(0, 0)`，`Circle(O, 3)` 等价于 `Circle( O , 3 )`

### 评分标准

- **核心命令准确率**：匹配的核心命令数 / 总核心命令数（权重 70%）
- **总体准确率**：匹配的所有命令数 / 总期望命令数（权重 30%）
- **综合评分**：核心准确率 × 70% + 总体准确率 × 30%（0-100分）
- **成功标准**：核心命令准确率 = 100%

### 输出说明

每个样本会显示：
- 综合评分（0-100分）
- 核心命令准确率和匹配情况
- 总体准确率和匹配情况
- 匹配的命令列表
- 未匹配的期望命令
- 额外命令（不影响评分）

评估总结会显示：
- 总样本数和成功样本数
- 平均核心命令准确率
- 平均总体准确率
- 平均综合评分
- 各样本详细评分列表
