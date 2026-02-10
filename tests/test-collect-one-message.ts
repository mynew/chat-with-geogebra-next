import { collectOneMessage } from "@/client/lib/collection";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// 遍历 tests/stream 目录下的所有 .txt 文件，逐个进行 collectOneMessage 测试


const files = readdirSync("./tests/stream").filter(file => file.endsWith(".txt"));

for (const file of files) {
  const filePath = path.join("./tests/stream", file);
  const text = readFileSync(filePath, "utf-8");
  const result = collectOneMessage(text);
  console.log(`Result for ${file}:`);
  console.log(JSON.stringify(result, null, 2));
}
