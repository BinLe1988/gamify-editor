// 场景扩展接口
class ScenarioExtension {
    constructor(scenarioId, config) {
        this.scenarioId = scenarioId;
        this.config = config;
    }

    // 注册新场景到场景管理器
    register(scenarioManager) {
        scenarioManager.addScenario(this.scenarioId, this.config);
    }

    // 创建场景特定的编辑器
    createEditor(gameState, scenarioManager) {
        return new this.config.editorClass(this.scenarioId, gameState, scenarioManager);
    }

    // 创建场景特定的可视化器
    createVisualizer(canvasId) {
        if (this.config.visualizerClass) {
            return new this.config.visualizerClass(canvasId);
        }
        return null;
    }
}

// 场景扩展工厂
class ScenarioExtensionFactory {
    static createGameScenario() {
        return new ScenarioExtension('game', {
            name: '游戏开发',
            icon: '🎯',
            visualizerClass: GameCanvas,
            editorClass: GameDragEditor,
            codeBlocks: [
                { id: 0, code: 'create player at (0, 0)', text: '创建玩家' },
                { id: 1, code: 'move player right', text: '向右移动' },
                { id: 2, code: 'move player right', text: '继续向右' },
                { id: 3, code: 'move player down', text: '向下移动' }
            ]
        });
    }

    static createAlgorithmScenario() {
        return new ScenarioExtension('algorithm', {
            name: '算法可视化',
            icon: '🧩',
            visualizerClass: AlgorithmVisualizer,
            editorClass: AlgorithmDragEditor,
            codeBlocks: [
                { id: 0, code: 'array nums = [3, 1, 4, 2]', text: '创建数组' },
                { id: 1, code: 'print("排序前: " + nums)', text: '显示原数组' },
                { id: 2, code: 'sort nums', text: '排序数组' },
                { id: 3, code: 'print("排序后: " + nums)', text: '显示结果' }
            ]
        });
    }

    static createMathScenario() {
        return new ScenarioExtension('math', {
            name: '数学建模',
            icon: '📊',
            visualizerClass: MathVisualizer,
            editorClass: MathDragEditor,
            codeBlocks: [
                { id: 0, code: 'set range -5 to 5', text: '设置坐标范围' },
                { id: 1, code: 'plot y = x^2', text: '绘制抛物线' },
                { id: 2, code: 'draw circle at (0, 0) radius 2', text: '绘制圆形' },
                { id: 3, code: 'calculate 2^2 + 1', text: '计算结果' }
            ]
        });
    }

    // 扩展新场景的示例
    static createCustomScenario(scenarioId, config) {
        return new ScenarioExtension(scenarioId, {
            name: config.name,
            icon: config.icon,
            visualizerClass: config.visualizerClass,
            editorClass: config.editorClass || DragEditorCore,
            codeBlocks: config.codeBlocks
        });
    }
}
