# 代码解析系统 (Code Interpreter)

## 概述

这是一个创新的教学工具，它能够分析Python代码的意图，并直接修改游戏状态，而不需要实际执行Python代码。这种方法特别适合教学环境，让学生能够通过编写"伪代码"来理解编程逻辑。

## 核心特性

### 🎯 智能代码解析
- 支持中英文混合输入
- 识别常见的编程模式和意图
- 将抽象代码转换为具体的游戏操作

### 🎮 直接游戏状态修改
- 无需Python运行环境
- 实时反馈代码效果
- 可视化编程结果

### 📚 教育友好设计
- 降低技术门槛
- 专注于编程思维培养
- 适合课堂环境使用

## 支持的操作

### 资源管理
```python
wood + 100        # 增加木材
stone = 200       # 设置石头数量
food + 50         # 增加食物
metal + 25        # 增加金属
```

### 殖民者控制
```python
move colonist to (5, 3)    # 移动殖民者
heal colonist              # 治疗殖民者
revive colonist           # 复活殖民者
```

### 建筑系统
```python
build wall at (3, 4)      # 建造墙壁
build house at (2, 2)     # 建造房屋
demolish at (5, 6)        # 拆除建筑
```

### 游戏控制
```python
auto on           # 启动自动模式
auto off          # 停止自动模式
pause             # 暂停游戏
resume            # 恢复游戏
```

### 环境控制
```python
weather = "sunny"         # 改变天气
temperature = 25          # 设置温度
disaster flood           # 触发洪水
disaster earthquake      # 触发地震
```

## 技术实现

### 核心组件

1. **CodeInterpreter类** (`code_interpreter.js`)
   - 模式匹配引擎
   - 代码解析逻辑
   - 游戏状态修改接口

2. **游戏集成** (`rimworld_game.js`)
   - 代码解析器初始化
   - 执行结果显示
   - 游戏状态同步

3. **用户界面** (`script.js`)
   - 代码编辑器集成
   - 结果展示优化
   - 错误处理机制

### 解析流程

```
用户输入代码 → 模式匹配 → 意图识别 → 游戏操作 → 结果反馈
```

## 使用方法

### 基础使用
1. 启动RimWorld游戏
2. 在Python编辑器中输入代码
3. 点击"运行代码"按钮
4. 观察游戏状态变化和执行结果

### 测试环境
访问 `test_interpreter.html` 进行独立测试：
```bash
# 在浏览器中打开
open frontend/test_interpreter.html
```

## 教学应用场景

### 1. 编程思维培养
- 让学生理解代码与结果的关系
- 培养逻辑思维和问题分解能力
- 降低编程语法学习门槛

### 2. 游戏化学习
- 通过游戏反馈激发学习兴趣
- 可视化抽象编程概念
- 提供即时成就感

### 3. 协作学习
- 多人共享游戏状态
- 团队编程项目
- 代码效果讨论

## 扩展性设计

### 添加新操作类型
```javascript
// 在 initializePatterns() 中添加新模式
newCategory: [
    {
        pattern: /your_regex_pattern/i,
        action: (match) => this.yourCustomAction(match)
    }
]
```

### 自定义游戏集成
```javascript
// 创建新的游戏适配器
class YourGameAdapter {
    constructor(game) {
        this.game = game;
        this.codeInterpreter = new CodeInterpreter(this);
    }
}
```

## 优势与特点

### 🚀 技术优势
- **零依赖**: 无需Python运行环境
- **实时性**: 即时代码解析和反馈
- **可扩展**: 模块化设计，易于添加新功能
- **跨平台**: 基于Web技术，支持所有现代浏览器

### 📖 教育优势
- **降低门槛**: 专注于编程思维而非语法细节
- **可视化**: 代码效果直观展示
- **互动性**: 游戏化的学习体验
- **灵活性**: 支持多种教学场景

### 🎯 创新点
- **意图理解**: 不执行代码，而是理解代码意图
- **直接操作**: 绕过传统的代码执行流程
- **教学导向**: 专为教育场景设计优化

## 未来发展

### 短期目标
- [ ] 增加更多操作类型支持
- [ ] 优化错误提示和用户体验
- [ ] 添加代码自动补全功能

### 长期规划
- [ ] AI辅助代码理解
- [ ] 多语言编程支持
- [ ] 可视化编程界面
- [ ] 学习进度跟踪系统

## 贡献指南

欢迎贡献代码和想法！请查看以下文件：
- `code_examples.md` - 使用示例
- `test_interpreter.html` - 测试环境
- `code_interpreter.js` - 核心实现

## 许可证

本项目采用MIT许可证，详见LICENSE文件。
