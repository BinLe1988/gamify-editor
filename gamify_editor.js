// 通用游戏化代码解析器 - 适配多场景
class CodeInterpreter {
    constructor(game, scenario = 'programming') {
        this.game = game;
        this.scenario = scenario;
        this.initializePatterns();
    }

    initializePatterns() {
        this.patterns = {
            // 编程入门场景
            programming: [
                { pattern: /^print\s*\(\s*["\'](.+?)["\']\s*\)$/i, action: (m) => this.printMessage(m[1]) },
                { pattern: /^(\w+)\s*=\s*(.+)$/i, action: (m) => this.setVariable(m[1], m[2]) },
                { pattern: /^if\s+(.+):$/i, action: (m) => this.startCondition(m[1]) },
                { pattern: /^for\s+(\w+)\s+in\s+range\((\d+)\):$/i, action: (m) => this.startLoop(m[1], parseInt(m[2])) }
            ],
            // 算法可视化场景
            algorithm: [
                { pattern: /^sort\s+(\w+)$/i, action: (m) => this.sortArray(m[1]) },
                { pattern: /^search\s+(\w+)\s+for\s+(.+)$/i, action: (m) => this.searchArray(m[1], m[2]) },
                { pattern: /^array\s+(\w+)\s*=\s*\[(.+)\]$/i, action: (m) => this.createArray(m[1], m[2]) },
                { pattern: /^step$/i, action: (m) => this.algorithmStep() }
            ],
            // 数据结构场景
            datastructure: [
                { pattern: /^stack\.push\((.+)\)$/i, action: (m) => this.stackPush(m[1]) },
                { pattern: /^stack\.pop\(\)$/i, action: (m) => this.stackPop() },
                { pattern: /^queue\.enqueue\((.+)\)$/i, action: (m) => this.queueEnqueue(m[1]) },
                { pattern: /^queue\.dequeue\(\)$/i, action: (m) => this.queueDequeue() },
                { pattern: /^tree\.insert\((.+)\)$/i, action: (m) => this.treeInsert(m[1]) }
            ],
            // 数学建模场景
            math: [
                { pattern: /^plot\s+(.+)$/i, action: (m) => this.plotFunction(m[1]) },
                { pattern: /^set\s+range\s+(-?\d+)\s+to\s+(-?\d+)$/i, action: (m) => this.setRange(parseInt(m[1]), parseInt(m[2])) },
                { pattern: /^draw\s+circle\s+at\s+\((\d+),\s*(\d+)\)\s+radius\s+(\d+)$/i, action: (m) => this.drawCircle(parseInt(m[1]), parseInt(m[2]), parseInt(m[3])) },
                { pattern: /^calculate\s+(.+)$/i, action: (m) => this.calculate(m[1]) }
            ],
            // 物理仿真场景
            physics: [
                { pattern: /^create\s+ball\s+at\s+\((\d+),\s*(\d+)\)$/i, action: (m) => this.createBall(parseInt(m[1]), parseInt(m[2])) },
                { pattern: /^set\s+gravity\s+(\d+)$/i, action: (m) => this.setGravity(parseInt(m[1])) },
                { pattern: /^apply\s+force\s+(\d+)\s+to\s+(\w+)$/i, action: (m) => this.applyForce(parseInt(m[1]), m[2]) },
                { pattern: /^start\s+simulation$/i, action: (m) => this.startSimulation() }
            ],
            // 游戏开发场景
            game: [
                { pattern: /^create\s+player\s+at\s+\((\d+),\s*(\d+)\)$/i, action: (m) => this.createPlayer(parseInt(m[1]), parseInt(m[2])) },
                { pattern: /^move\s+(\w+)\s+(up|down|left|right)$/i, action: (m) => this.moveEntity(m[1], m[2]) },
                { pattern: /^score\s*\+\s*(\d+)$/i, action: (m) => this.addScore(parseInt(m[1])) },
                { pattern: /^spawn\s+(\w+)\s+at\s+\((\d+),\s*(\d+)\)$/i, action: (m) => this.spawnEntity(m[1], parseInt(m[2]), parseInt(m[3])) }
            ]
        };
    }

    interpretCode(code) {
        const results = [];
        const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
        
        for (const line of lines) {
            try {
                const result = this.parseLine(line);
                if (result) results.push({ line, action: result, success: true });
            } catch (error) {
                results.push({ line, error: error.message, success: false });
            }
        }
        
        return results;
    }

    parseLine(line) {
        // 使用当前场景的模式
        const patterns = this.patterns[this.scenario] || [];
        
        for (const { pattern, action } of patterns) {
            const match = line.match(pattern);
            if (match) {
                return action(match);
            }
        }
        
        throw new Error(`场景 ${this.scenario} 中无法解析: ${line}`);
    }

    // 编程入门场景方法
    printMessage(message) {
        if (this.game.output) {
            this.game.output.push(message);
        }
        return `输出: ${message}`;
    }

    setVariable(name, value) {
        if (!this.game.variables) this.game.variables = {};
        this.game.variables[name] = value;
        return `变量 ${name} = ${value}`;
    }

    startCondition(condition) {
        return `开始条件判断: ${condition}`;
    }

    startLoop(variable, count) {
        return `开始循环: ${variable} 从 0 到 ${count-1}`;
    }

    // 算法可视化场景方法
    sortArray(arrayName) {
        if (this.game.arrays?.[arrayName]) {
            this.game.arrays[arrayName].sort((a, b) => a - b);
            this.game.visualize?.('sort', arrayName);
        }
        return `排序数组: ${arrayName}`;
    }

    searchArray(arrayName, target) {
        if (this.game.arrays?.[arrayName]) {
            const index = this.game.arrays[arrayName].indexOf(target);
            this.game.visualize?.('search', { array: arrayName, target, index });
            return `在 ${arrayName} 中搜索 ${target}: ${index >= 0 ? `找到位置 ${index}` : '未找到'}`;
        }
        return `搜索失败: 数组 ${arrayName} 不存在`;
    }

    createArray(name, values) {
        if (!this.game.arrays) this.game.arrays = {};
        this.game.arrays[name] = values.split(',').map(v => parseInt(v.trim()));
        return `创建数组 ${name}: [${this.game.arrays[name].join(', ')}]`;
    }

    algorithmStep() {
        this.game.step?.();
        return '执行算法步骤';
    }

    // 数据结构场景方法
    stackPush(value) {
        if (!this.game.stack) this.game.stack = [];
        this.game.stack.push(value);
        this.game.visualizeStack?.();
        return `入栈: ${value}`;
    }

    stackPop() {
        if (!this.game.stack || this.game.stack.length === 0) {
            throw new Error('栈为空');
        }
        const value = this.game.stack.pop();
        this.game.visualizeStack?.();
        return `出栈: ${value}`;
    }

    queueEnqueue(value) {
        if (!this.game.queue) this.game.queue = [];
        this.game.queue.push(value);
        this.game.visualizeQueue?.();
        return `入队: ${value}`;
    }

    queueDequeue() {
        if (!this.game.queue || this.game.queue.length === 0) {
            throw new Error('队列为空');
        }
        const value = this.game.queue.shift();
        this.game.visualizeQueue?.();
        return `出队: ${value}`;
    }

    treeInsert(value) {
        if (!this.game.tree) this.game.tree = { nodes: [] };
        this.game.tree.nodes.push(parseInt(value));
        this.game.visualizeTree?.();
        return `插入节点: ${value}`;
    }

    // 数学建模场景方法
    plotFunction(func) {
        this.game.plotFunction?.(func);
        return `绘制函数: ${func}`;
    }

    setRange(min, max) {
        if (!this.game.mathSettings) this.game.mathSettings = {};
        this.game.mathSettings.range = { min, max };
        return `设置范围: ${min} 到 ${max}`;
    }

    drawCircle(x, y, radius) {
        if (!this.game.shapes) this.game.shapes = [];
        this.game.shapes.push({ type: 'circle', x, y, radius });
        this.game.draw?.();
        return `绘制圆形: 中心(${x}, ${y}), 半径${radius}`;
    }

    calculate(expression) {
        try {
            const result = eval(expression.replace(/[^0-9+\-*/().\s]/g, ''));
            return `计算结果: ${expression} = ${result}`;
        } catch (error) {
            throw new Error(`计算错误: ${expression}`);
        }
    }

    // 物理仿真场景方法
    createBall(x, y) {
        if (!this.game.objects) this.game.objects = [];
        this.game.objects.push({ type: 'ball', x, y, vx: 0, vy: 0 });
        this.game.draw?.();
        return `创建球体: 位置(${x}, ${y})`;
    }

    setGravity(value) {
        if (!this.game.physics) this.game.physics = {};
        this.game.physics.gravity = value;
        return `设置重力: ${value}`;
    }

    applyForce(force, objectName) {
        const obj = this.game.objects?.find(o => o.name === objectName);
        if (obj) {
            obj.vy -= force;
            return `对 ${objectName} 施加力: ${force}`;
        }
        throw new Error(`对象 ${objectName} 不存在`);
    }

    startSimulation() {
        this.game.startPhysics?.();
        return '开始物理仿真';
    }

    // 游戏开发场景方法
    createPlayer(x, y) {
        this.game.player = { x, y, hp: 100, score: 0 };
        this.game.draw?.();
        return `创建玩家: 位置(${x}, ${y})`;
    }

    moveEntity(entity, direction) {
        const obj = entity === 'player' ? this.game.player : this.game.entities?.[entity];
        if (!obj) throw new Error(`实体 ${entity} 不存在`);
        
        const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        const [dx, dy] = moves[direction];
        obj.x += dx * 10;
        obj.y += dy * 10;
        
        this.game.draw?.();
        return `${entity} 向 ${direction} 移动`;
    }

    addScore(points) {
        if (!this.game.player) this.game.player = { score: 0 };
        this.game.player.score += points;
        this.game.updateUI?.();
        return `得分 +${points}, 总分: ${this.game.player.score}`;
    }

    spawnEntity(type, x, y) {
        if (!this.game.entities) this.game.entities = {};
        const id = `${type}_${Date.now()}`;
        this.game.entities[id] = { type, x, y };
        this.game.draw?.();
        return `生成 ${type}: 位置(${x}, ${y})`;
    }

    // 切换场景
    setScenario(scenario) {
        this.scenario = scenario;
        this.initializePatterns();
        return `切换到场景: ${scenario}`;
    }
}

window.CodeInterpreter = CodeInterpreter;



window.CodeInterpreter = CodeInterpreter;
