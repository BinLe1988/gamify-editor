// 代码解析器 - 分析Python代码意图并修改游戏状态
class CodeInterpreter {
    constructor(game) {
        this.game = game;
        this.patterns = this.initializePatterns();
    }
    
    initializePatterns() {
        return {
            // 资源操作
            resources: [
                {
                    pattern: /(?:wood|木材|木头)\s*[\+\-\=]\s*(\d+)/i,
                    action: (match) => this.modifyResource('wood', match[1])
                },
                {
                    pattern: /(?:stone|石头|石材)\s*[\+\-\=]\s*(\d+)/i,
                    action: (match) => this.modifyResource('stone', match[1])
                },
                {
                    pattern: /(?:food|食物|粮食)\s*[\+\-\=]\s*(\d+)/i,
                    action: (match) => this.modifyResource('food', match[1])
                },
                {
                    pattern: /(?:metal|金属|铁)\s*[\+\-\=]\s*(\d+)/i,
                    action: (match) => this.modifyResource('metal', match[1])
                }
            ],
      
            // 殖民者操作
            colonists: [
                {
                    pattern: /(?:move|移动|走到)\s*(?:colonist|殖民者|角色)\s*(?:to\s*)?[\(\[]?(\d+)\s*,\s*(\d+)[\)\]]?/i,
                    action: (match) => this.moveColonist(parseInt(match[1]), parseInt(match[2]))
                },
                {
                    pattern: /(?:heal|治疗|恢复|加血)\s*(?:colonist|殖民者|角色)?/i,
                    action: () => this.healColonist()
                },
                {
                    pattern: /(?:revive|复活|救活)\s*(?:colonist|殖民者|角色)?/i,
                    action: () => this.reviveColonist()
                }
            ],

            // 建筑操作
            buildings: [
                {
                    pattern: /(?:build|建造|建设)\s*(wall|墙|wall)\s*(?:at\s*)?[\(\[]?(\d+)\s*,\s*(\d+)[\)\]]?/i,
                    action: (match) => this.buildStructure('wall', parseInt(match[2]), parseInt(match[3]))
                },
                {
                    pattern: /(?:build|建造|建设)\s*(house|房屋|房子)\s*(?:at\s*)?[\(\[]?(\d+)\s*,\s*(\d+)[\)\]]?/i,
                    action: (match) => this.buildStructure('house', parseInt(match[2]), parseInt(match[3]))
                },
                {
                    pattern: /(?:build|建造|建设)\s*(bed|床|床铺)\s*(?:at\s*)?[\(\[]?(\d+)\s*,\s*(\d+)[\)\]]?/i,
                    action: (match) => this.buildStructure('bed', parseInt(match[2]), parseInt(match[3]))
                },
                {
                    pattern: /(?:demolish|拆除|破坏)\s*(?:at\s*)?[\(\[]?(\d+)\s*,\s*(\d+)[\)\]]?/i,
                    action: (match) => this.demolishBuilding(parseInt(match[1]), parseInt(match[2]))
                }
            ],
      
            // 游戏控制
            gameControl: [
                {
                    pattern: /(?:auto|自动|automation)\s*(?:on|start|开始|启动)/i,
                    action: () => this.toggleAutoMode(true)
                },
                {
                    pattern: /(?:auto|自动|automation)\s*(?:off|stop|停止|关闭)/i,
                    action: () => this.toggleAutoMode(false)
                },
                {
                    pattern: /(?:pause|暂停|停止)/i,
                    action: () => this.pauseGame()
                },
                {
                    pattern: /(?:resume|继续|恢复)/i,
                    action: () => this.resumeGame()
                }
            ],
      
            // 环境控制
            environment: [
                {
                    pattern: /(?:weather|天气)\s*=\s*['"](sunny|rainy|stormy|晴天|雨天|暴风雨)['"]?/i,
                    action: (match) => this.changeWeather(match[1])
                },
                {
                    pattern: /(?:temperature|温度)\s*=\s*(\d+)/i,
                    action: (match) => this.changeTemperature(parseInt(match[1]))
                },
                {
                    pattern: /(?:disaster|灾害|灾难)\s*(flood|earthquake|洪水|地震)/i,
                    action: (match) => this.triggerDisaster(match[1])
                }
            ]
        };
    }
      
    // 解析代码的主要方法
    interpretCode(code) {
        const results = [];
        const lines = code.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) continue;

            const result = this.parseLine(trimmedLine);
            if (result) {
                results.push(result);
            }
        }

        return results;
    }

    parseLine(line) {
        // 遍历所有模式类别
        for (const [category, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                const match = line.match(pattern.pattern);
                if (match) {
                    try {
                        const result = pattern.action(match);
                        return {
                            category,
                            line,
                            action: result,
                            success: true
                        };
                    } catch (error) {
                        return {
                            category,
                            line,
                            error: error.message,
                            success: false
                        };
                    }
                }
            }
        }

        return null; // 未匹配到任何模式
    }
      
    // 资源修改方法
    modifyResource(type, amount) {
        const value = parseInt(amount);
        if (this.game.resources[type] !== undefined) {
            this.game.resources[type] = Math.max(0, this.game.resources[type] + value);
            this.game.updateUI();
            return `${type} 资源修改为 ${this.game.resources[type]}`;
        }
        throw new Error(`未知资源类型: ${type}`);
    }
      
    // 殖民者移动
    moveColonist(x, y) {
        if (this.game.selectedColonist) {
            const colonist = this.game.selectedColonist;
            if (this.isValidPosition(x, y)) {
                colonist.x = x;
                colonist.y = y;
                this.game.updateUI();
                this.game.draw();
                return `殖民者移动到 (${x}, ${y})`;
            }
            throw new Error(`无效位置: (${x}, ${y})`);
        }
        throw new Error('没有选中的殖民者');
    }
      
    // 治疗殖民者
    healColonist() {
        if (this.game.selectedColonist) {
            const colonist = this.game.selectedColonist;
            colonist.hp = Math.min(colonist.maxHp, colonist.hp + 1);
            this.game.updateUI();
            this.game.draw();
            return `殖民者血量恢复到 ${colonist.hp}`;
        }
        throw new Error('没有选中的殖民者');
    }
      
    // 复活殖民者
    reviveColonist() {
        const downedColonist = this.game.colonists.find(c => c.isDowned);
        if (downedColonist) {
            downedColonist.isDowned = false;
            downedColonist.hp = 1;
            this.game.updateUI();
            this.game.draw();
            return `殖民者 ${downedColonist.name} 已复活`;
        }
        throw new Error('没有倒地的殖民者');
    }
      
    // 建造建筑
    buildStructure(type, x, y) {
        if (!this.game.buildingTypes[type]) {
            throw new Error(`未知建筑类型: ${type}`);
        }

        if (!this.isValidPosition(x, y)) {
            throw new Error(`无效位置: (${x}, ${y})`);
        }

        const building = this.game.buildingTypes[type];
        
        // 检查资源
        for (const [resource, cost] of Object.entries(building.cost)) {
            if (this.game.resources[resource] < cost) {
                throw new Error(`资源不足: 需要 ${cost} ${resource}`);
            }
        }

        // 扣除资源
        for (const [resource, cost] of Object.entries(building.cost)) {
            this.game.resources[resource] -= cost;
        }
      
        // 添加建筑
        this.game.buildings.push({
            type,
            x,
            y,
            hp: building.hp,
            maxHp: building.hp
        });

        this.game.updateUI();
        this.game.draw();
        return `在 (${x}, ${y}) 建造了 ${type}`;
    }
      
    // 拆除建筑
    demolishBuilding(x, y) {
        const buildingIndex = this.game.buildings.findIndex(b => b.x === x && b.y === y);
        if (buildingIndex === -1) {
            throw new Error(`位置 (${x}, ${y}) 没有建筑`);
        }

        const building = this.game.buildings[buildingIndex];
        const buildingType = this.game.buildingTypes[building.type];
        
        // 回收一半资源
        for (const [resource, cost] of Object.entries(buildingType.cost)) {
            if (cost > 1) {
                const recovered = Math.round(cost / 2);
                this.game.resources[resource] += recovered;
            }
        }

        this.game.buildings.splice(buildingIndex, 1);
        this.game.updateUI();
        this.game.draw();
        return `拆除了位置 (${x}, ${y}) 的 ${building.type}`;
    }
      
    // 自动模式控制
    toggleAutoMode(enable) {
        this.game.autoMode = enable;
        if (enable) {
            this.game.startAutoTasks();
            return '自动模式已启动';
        } else {
            this.game.stopAutoTasks();
            return '自动模式已停止';
        }
    }

    // 游戏暂停/恢复
    pauseGame() {
        this.game.isPaused = true;
        return '游戏已暂停';
    }

    resumeGame() {
        this.game.isPaused = false;
        return '游戏已恢复';
    }

    // 天气控制
    changeWeather(weather) {
        const weatherMap = {
            'sunny': 'sunny', '晴天': 'sunny',
            'rainy': 'rainy', '雨天': 'rainy',
            'stormy': 'stormy', '暴风雨': 'stormy'
        };
        
        const newWeather = weatherMap[weather.toLowerCase()] || weather;
        this.game.weather = newWeather;
        this.game.updateUI();
        this.game.draw();
        return `天气改变为: ${newWeather}`;
    }

    // 温度控制
    changeTemperature(temp) {
        this.game.temperature = temp;
        this.game.updateUI();
        return `温度设置为: ${temp}°C`;
    }

    // 触发灾害
    triggerDisaster(type) {
        const disasterMap = {
            'flood': 'flood', '洪水': 'flood',
            'earthquake': 'earthquake', '地震': 'earthquake'
        };
        
        const disasterType = disasterMap[type.toLowerCase()] || type;
        this.game.triggerDisaster(disasterType);
        return `触发了 ${disasterType} 灾害`;
    }
      
    // 辅助方法：检查位置是否有效
    isValidPosition(x, y) {
        return x >= 0 && x < this.game.mapSize && y >= 0 && y < this.game.mapSize;
    }
}

// 导出类
window.CodeInterpreter = CodeInterpreter;