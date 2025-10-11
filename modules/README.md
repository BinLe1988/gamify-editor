# 模块化游戏化编辑器

## 📁 模块结构

### 核心模块
- `base_visualizer.js` - 基础可视化器类
- `scenario_manager.js` - 场景管理器
- `drag_editor_core.js` - 拖拽编辑器核心
- `scenario_extension.js` - 场景扩展接口
- `module_loader.js` - 模块加载器
- `app.js` - 主应用程序

## 🚀 使用方式

### 1. 基本初始化
```javascript
// 创建应用实例
const app = new GamifyEditorApp();

// 初始化应用
await app.initialize();
```

### 2. 添加新场景
```javascript
// 创建自定义场景
const customScenario = ScenarioExtensionFactory.createCustomScenario('robotics', {
    name: '机器人编程',
    icon: '🤖',
    visualizerClass: RoboticsVisualizer,
    codeBlocks: [
        { id: 0, code: 'robot.moveForward()', text: '前进' },
        { id: 1, code: 'robot.turnLeft()', text: '左转' },
        { id: 2, code: 'robot.pickUp()', text: '拾取' },
        { id: 3, code: 'robot.putDown()', text: '放下' }
    ]
});

// 注册场景
customScenario.register(app.scenarioManager);
```

### 3. 创建自定义可视化器
```javascript
class RoboticsVisualizer extends BaseVisualizer {
    constructor(canvasId) {
        super(canvasId, 400, 300);
        this.robot = { x: 0, y: 0, direction: 0 };
        this.draw();
    }

    async moveForward() {
        // 实现机器人前进动画
        this.updateStatus('机器人前进中...', 'roboticsStatus');
        await this.delay(500);
    }

    async turnLeft() {
        // 实现机器人左转动画
        this.robot.direction = (this.robot.direction + 90) % 360;
        this.draw();
        await this.delay(500);
    }

    draw() {
        this.clear();
        // 绘制机器人和环境
    }
}
```

### 4. 扩展编辑器功能
```javascript
class RoboticsDragEditor extends DragEditorCore {
    executeScenarioAction(codeLine, visualizer) {
        if (codeLine.includes('robot.moveForward()')) {
            visualizer.moveForward();
        } else if (codeLine.includes('robot.turnLeft()')) {
            visualizer.turnLeft();
        }
        // 添加更多动作处理
    }
}
```

## 🔧 扩展指南

### 添加新场景的步骤

1. **创建可视化器类**
   - 继承 `BaseVisualizer`
   - 实现场景特定的绘制和动画方法

2. **创建编辑器类（可选）**
   - 继承 `DragEditorCore`
   - 重写 `executeScenarioAction` 方法

3. **定义代码块**
   - 设计符合场景的代码块序列
   - 确定正确的执行顺序

4. **注册场景**
   - 使用 `ScenarioExtensionFactory` 创建场景
   - 注册到场景管理器

### 模块加载顺序

1. 核心模块 (`module_loader.js`, `base_visualizer.js` 等)
2. 场景模块 (各种可视化器)
3. 扩展模块 (自定义场景)
4. 应用初始化

## 📦 模块依赖

```
app.js
├── scenario_manager.js
├── drag_editor_core.js
│   └── base_visualizer.js
├── scenario_extension.js
└── module_loader.js
```

## 🎯 设计原则

### 1. 模块化
- 每个功能独立成模块
- 清晰的接口定义
- 最小化模块间依赖

### 2. 可扩展性
- 插件式架构
- 标准化的扩展接口
- 动态加载机制

### 3. 可维护性
- 统一的代码风格
- 完善的错误处理
- 详细的文档说明

## 🔄 生命周期

### 应用启动
1. 加载核心模块
2. 初始化场景管理器
3. 注册默认场景
4. 显示主界面

### 场景切换
1. 初始化游戏状态
2. 创建代码解释器
3. 渲染编辑器界面
4. 初始化可视化器

### 代码执行
1. 解析代码块序列
2. 验证执行顺序
3. 调用可视化器方法
4. 更新进度系统

## 🚀 未来扩展

### 计划中的场景
- 🤖 机器人编程
- 🧬 生物仿真
- 🌐 网络协议
- 🎵 音乐编程
- 🎨 图像处理

### 技术改进
- WebAssembly 性能优化
- 3D 可视化支持
- 实时协作功能
- 云端保存进度
