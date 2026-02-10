#!/usr/bin/env node
/**
 * GeoGebra 命令搜索测试脚本
 * 用于测试 searchGeoGebraCommands 函数
 * 
 * 使用方法:
 * pnpm tsx scripts/test-search-commands.ts <查询词>
 * 或
 * node --loader tsx scripts/test-search-commands.ts <查询词>
 * 
 * 示例:
 * pnpm tsx scripts/test-search-commands.ts Circle
 * pnpm tsx scripts/test-search-commands.ts Point
 * pnpm tsx scripts/test-search-commands.ts Line
 */

import { searchGeoGebraCommands } from '@/server/core/geogebra/searchGeoGebraCommands'

// 获取命令行参数
const query = process.argv[2]

if (!query) {
  console.error('\n❌ 错误: 请提供查询词')
  console.log('\n使用方法:')
  console.log('  pnpm tsx scripts/test-search-commands.ts <查询词>')
  console.log('\n示例:')
  console.log('  pnpm tsx scripts/test-search-commands.ts Circle')
  console.log('  pnpm tsx scripts/test-search-commands.ts Point')
  console.log('  pnpm tsx scripts/test-search-commands.ts Line\n')
  process.exit(1)
}

console.log(`\n🔍 搜索 GeoGebra 命令: "${query}"\n`)
console.log('=' .repeat(80))

try {
  const results = searchGeoGebraCommands(query, 10)
  
  if (results.length === 0) {
    console.log('\n❌ 未找到匹配的命令\n')
    process.exit(0)
  }
  
  console.log(`\n✅ 找到 ${results.length} 个匹配的命令:\n`)
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. 命令: ${result.commandBase}`)
    console.log(`   重载数量: ${result.overloads.length}`)
    console.log('')
    
    result.overloads.forEach((overload: any, overloadIndex: any) => {
      console.log(`   重载 ${overloadIndex + 1}:`)
      console.log(`   ├─ 签名: ${overload.signature}`)
      console.log(`   ├─ 参数数量: ${overload.paramCount}`)
      console.log(`   ├─ 参数类型: ${overload.paramTypes.join(', ')}`)
      console.log(`   ├─ 描述: ${overload.description}`)
      
      if (overload.note) {
        console.log(`   ├─ 注意: ${overload.note}`)
      }
      
      if (overload.examples && overload.examples.length > 0) {
        console.log(`   └─ 示例:`)
        overload.examples.forEach((example: any) => {
          console.log(`      • ${example.description}`)
          console.log(`        命令: ${example.command}`)
        })
      } else {
        console.log(`   └─ 示例: 无`)
      }
      
      if (overloadIndex < result.overloads.length - 1) {
        console.log('')
      }
    })
    
    if (index < results.length - 1) {
      console.log('\n' + '-'.repeat(80) + '\n')
    }
  })
  
  console.log('\n' + '='.repeat(80))
  console.log(`\n✨ 搜索完成! 共找到 ${results.length} 个命令\n`)
  
} catch (error) {
  console.error('\n❌ 搜索失败:', error)
  process.exit(1)
}
