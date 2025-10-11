// 场景管理器模块
class ScenarioManager {
    constructor() {
        this.scenarios = {
            programming: {
                name: '编程入门',
                icon: '💻',
                visualizer: null,
                codeBlocks: [
                    { id: 0, code: 'print("开始程序")', text: '输出开始信息' },
                    { id: 1, code: 'x = 10', text: '设置变量x为10' },
                    { id: 2, code: 'if x > 5:', text: '判断x是否大于5' },
                    { id: 3, code: 'print("x大于5")', text: '输出结果' }
                ]
            },
            algorithm: {
                name: '算法可视化',
                icon: '🧩',
                visualizer: 'AlgorithmVisualizer',
                codeBlocks: [
                    { id: 0, code: 'array nums = [3, 1, 4, 2]', text: '创建数组' },
                    { id: 1, code: 'print("排序前: " + nums)', text: '显示原数组' },
                    { id: 2, code: 'sort nums', text: '排序数组' },
                    { id: 3, code: 'print("排序后: " + nums)', text: '显示结果' }
                ]
            },
            datastructure: {
                name: '数据结构',
                icon: '🏗️',
                visualizer: 'DataStructureVisualizer',
                codeBlocks: [
                    { id: 0, code: 'stack.push(1)', text: '入栈: 1' },
                    { id: 1, code: 'stack.push(2)', text: '入栈: 2' },
                    { id: 2, code: 'stack.pop()', text: '出栈' },
                    { id: 3, code: 'print("栈顶: " + stack.top())', text: '显示栈顶' }
                ]
            },
            math: {
                name: '数学建模',
                icon: '📊',
                visualizer: 'MathVisualizer',
                codeBlocks: [
                    { id: 0, code: 'set range -5 to 5', text: '设置坐标范围' },
                    { id: 1, code: 'plot y = x^2', text: '绘制抛物线' },
                    { id: 2, code: 'draw circle at (0, 0) radius 2', text: '绘制圆形' },
                    { id: 3, code: 'calculate 2^2 + 1', text: '计算结果' }
                ]
            },
            physics: {
                name: '物理仿真',
                icon: '⚡',
                visualizer: 'PhysicsSimulator',
                codeBlocks: [
                    { id: 0, code: 'set gravity 9.8', text: '设置重力' },
                    { id: 1, code: 'create ball at (50, 10)', text: '创建球体' },
                    { id: 2, code: 'apply force 5 to ball', text: '施加力' },
                    { id: 3, code: 'start simulation', text: '开始仿真' }
                ]
            },
            game: {
                name: '游戏开发',
                icon: '🎯',
                visualizer: 'GameCanvas',
                codeBlocks: [
                    { id: 0, code: 'create player at (0, 0)', text: '创建玩家' },
                    { id: 1, code: 'move player right', text: '向右移动' },
                    { id: 2, code: 'move player right', text: '继续向右' },
                    { id: 3, code: 'move player down', text: '向下移动' }
                ]
            }
        };
    }

    getScenario(scenarioId) {
        return this.scenarios[scenarioId];
    }

    getAllScenarios() {
        return this.scenarios;
    }

    addScenario(id, config) {
        this.scenarios[id] = config;
    }

    getCodeBlocks(scenarioId) {
        return this.scenarios[scenarioId]?.codeBlocks || [];
    }

    getVisualizerClass(scenarioId) {
        return this.scenarios[scenarioId]?.visualizer;
    }
}
