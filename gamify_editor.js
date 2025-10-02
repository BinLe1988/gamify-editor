// 最新Python AST代码解析器
class CodeInterpreter {
    constructor(game) {
        this.game = game;
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
        // 赋值: wood = 100
        if (/^(wood|stone|food|metal)\s*=\s*(\d+)$/.test(line)) {
            const [, variable, value] = line.match(/^(wood|stone|food|metal)\s*=\s*(\d+)$/);
            return this.assign(variable, parseInt(value));
        }
        
        // 增强赋值: wood += 50
        if (/^(wood|stone|food|metal)\s*([\+\-])\s*=\s*(\d+)$/.test(line)) {
            const [, variable, op, value] = line.match(/^(wood|stone|food|metal)\s*([\+\-])\s*=\s*(\d+)$/);
            return this.augAssign(variable, op, parseInt(value));
        }
        
        // 表达式: wood + 50
        if (/^(wood|stone|food|metal)\s*([\+\-])\s*(\d+)$/.test(line)) {
            const [, variable, op, value] = line.match(/^(wood|stone|food|metal)\s*([\+\-])\s*(\d+)$/);
            return this.augAssign(variable, op, parseInt(value));
        }
        
        // 函数调用: move(5, 3)
        if (/^(\w+)\s*\(\s*(.*?)\s*\)$/.test(line)) {
            const [, func, args] = line.match(/^(\w+)\s*\(\s*(.*?)\s*\)$/);
            return this.callFunction(func, args);
        }
        
        throw new Error(`无法解析: ${line}`);
    }

    assign(variable, value) {
        console.log('设置资源:', variable, '=', value); // 调试日志
        console.log('游戏资源对象:', this.game.resources); // 调试日志
        this.game.resources[variable] = value;
        this.game.updateUI();
        console.log('更新后资源:', this.game.resources); // 调试日志
        return `${variable} = ${value}`;
    }

    augAssign(variable, operator, value) {
        const current = this.game.resources[variable] || 0;
        const result = operator === '+' ? current + value : current - value;
        this.game.resources[variable] = Math.max(0, result);
        this.game.updateUI();
        return `${variable} ${operator}= ${value} → ${this.game.resources[variable]}`;
    }

    callFunction(func, argsStr) {
        const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];
        
        if (func === 'move' && args.length === 2) {
            return this.moveColonist(parseInt(args[0]), parseInt(args[1]));
        }
        if (func === 'build' && args.length === 3) {
            return this.buildStructure(args[0].replace(/['"]/g, ''), parseInt(args[1]), parseInt(args[2]));
        }
        if (func === 'heal') {
            return this.healColonist();
        }
        
        throw new Error(`未知函数: ${func}`);
    }

    moveColonist(x, y) {
        if (!this.game.selectedColonist) throw new Error('未选中殖民者');
        if (x < 0 || x >= this.game.mapSize || y < 0 || y >= this.game.mapSize) {
            throw new Error(`无效位置: (${x}, ${y})`);
        }
        this.game.selectedColonist.x = x;
        this.game.selectedColonist.y = y;
        this.game.draw();
        return `殖民者移动至 (${x}, ${y})`;
    }

    buildStructure(type, x, y) {
        if (!this.game.buildingTypes[type]) throw new Error(`未知建筑: ${type}`);
        if (x < 0 || x >= this.game.mapSize || y < 0 || y >= this.game.mapSize) {
            throw new Error(`无效位置: (${x}, ${y})`);
        }
        
        const building = this.game.buildingTypes[type];
        for (const [resource, cost] of Object.entries(building.cost)) {
            if (this.game.resources[resource] < cost) {
                throw new Error(`资源不足: 需要${cost} ${resource}`);
            }
        }
        
        for (const [resource, cost] of Object.entries(building.cost)) {
            this.game.resources[resource] -= cost;
        }
        
        this.game.buildings.push({ type, x, y, hp: building.hp, maxHp: building.hp });
        this.game.updateUI();
        this.game.draw();
        return `在(${x}, ${y})建造${type}`;
    }

    healColonist() {
        if (!this.game.selectedColonist) throw new Error('未选中殖民者');
        const colonist = this.game.selectedColonist;
        colonist.hp = Math.min(colonist.maxHp, colonist.hp + 1);
        this.game.draw();
        return `殖民者血量: ${colonist.hp}`;
    }
}

window.CodeInterpreter = CodeInterpreter;
