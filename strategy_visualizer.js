// 策略游戏可视化组件
class StrategyVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 450;
        this.canvas.height = 350;
        
        this.gameBoard = this.initializeBoard();
        this.resources = { gold: 100, wood: 50, food: 30 };
        this.units = [];
        this.buildings = [];
        this.currentStrategy = null;
        this.turn = 1;
        
        this.draw();
    }

    initializeBoard() {
        const board = [];
        for (let y = 0; y < 8; y++) {
            board[y] = [];
            for (let x = 0; x < 10; x++) {
                board[y][x] = { type: 'empty', unit: null, building: null };
            }
        }
        return board;
    }

    async defineStrategy(name) {
        this.currentStrategy = { name, steps: [] };
        this.updateStatus(`定义策略: ${name}`);
        await this.delay(500);
        this.draw();
    }

    async setGoal(goal) {
        if (this.currentStrategy) {
            this.currentStrategy.goal = goal;
        }
        this.updateStatus(`设定目标: ${goal}`);
        await this.delay(500);
        this.draw();
    }

    async collectResources(type, amount) {
        this.resources[type] = (this.resources[type] || 0) + amount;
        this.updateStatus(`收集资源: ${type} +${amount}`);
        await this.delay(500);
        this.draw();
    }

    async buildStructure(type, x, y) {
        if (this.canBuild(type, x, y)) {
            const building = { type, x, y, level: 1 };
            this.buildings.push(building);
            this.gameBoard[y][x].building = building;
            
            // 消耗资源
            this.consumeResources(type);
            
            this.updateStatus(`建造 ${type} 在 (${x}, ${y})`);
            await this.delay(500);
            this.draw();
        }
    }

    async trainUnit(type, x, y) {
        if (this.canTrain(type)) {
            const unit = { type, x, y, health: 100, attack: this.getUnitStats(type).attack };
            this.units.push(unit);
            this.gameBoard[y][x].unit = unit;
            
            // 消耗资源
            this.consumeResources(type);
            
            this.updateStatus(`训练 ${type} 在 (${x}, ${y})`);
            await this.delay(500);
            this.draw();
        }
    }

    async executeStrategy() {
        if (!this.currentStrategy) return;
        
        this.updateStatus(`执行策略: ${this.currentStrategy.name}`);
        await this.delay(500);
        
        // 模拟策略执行
        this.turn++;
        this.resources.gold += 20;
        this.resources.wood += 10;
        this.resources.food += 5;
        
        this.draw();
    }

    canBuild(type, x, y) {
        if (x < 0 || x >= 10 || y < 0 || y >= 8) return false;
        if (this.gameBoard[y][x].building) return false;
        
        const costs = this.getBuildingCosts(type);
        return Object.keys(costs).every(resource => 
            this.resources[resource] >= costs[resource]
        );
    }

    canTrain(type) {
        const costs = this.getUnitCosts(type);
        return Object.keys(costs).every(resource => 
            this.resources[resource] >= costs[resource]
        );
    }

    consumeResources(type) {
        const costs = this.getBuildingCosts(type) || this.getUnitCosts(type);
        Object.keys(costs).forEach(resource => {
            this.resources[resource] -= costs[resource];
        });
    }

    getBuildingCosts(type) {
        const costs = {
            'farm': { gold: 30, wood: 20 },
            'barracks': { gold: 50, wood: 40 },
            'tower': { gold: 40, wood: 30 }
        };
        return costs[type] || {};
    }

    getUnitCosts(type) {
        const costs = {
            'soldier': { gold: 25, food: 10 },
            'archer': { gold: 30, food: 8 },
            'knight': { gold: 60, food: 15 }
        };
        return costs[type] || {};
    }

    getUnitStats(type) {
        const stats = {
            'soldier': { attack: 20, defense: 15 },
            'archer': { attack: 25, defense: 10 },
            'knight': { attack: 35, defense: 25 }
        };
        return stats[type] || { attack: 10, defense: 10 };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawTitle();
        this.drawGameBoard();
        this.drawResources();
        this.drawStrategy();
        this.drawUnits();
    }

    drawTitle() {
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('策略游戏', 10, 20);
        
        this.ctx.fillStyle = '#718096';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`回合: ${this.turn}`, 350, 20);
    }

    drawGameBoard() {
        const startX = 10;
        const startY = 30;
        const cellSize = 25;
        
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 10; x++) {
                const cellX = startX + x * cellSize;
                const cellY = startY + y * cellSize;
                
                // 绘制网格
                this.ctx.strokeStyle = '#e2e8f0';
                this.ctx.strokeRect(cellX, cellY, cellSize, cellSize);
                
                // 绘制建筑
                const building = this.gameBoard[y][x].building;
                if (building) {
                    this.drawBuilding(building, cellX, cellY, cellSize);
                }
                
                // 绘制单位
                const unit = this.gameBoard[y][x].unit;
                if (unit) {
                    this.drawUnit(unit, cellX, cellY, cellSize);
                }
            }
        }
    }

    drawBuilding(building, x, y, size) {
        const colors = {
            'farm': '#48bb78',
            'barracks': '#ed8936',
            'tower': '#667eea'
        };
        
        this.ctx.fillStyle = colors[building.type] || '#a0aec0';
        this.ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
        
        // 建筑图标
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        const icons = { 'farm': '🌾', 'barracks': '🏠', 'tower': '🗼' };
        this.ctx.fillText(icons[building.type] || '■', x + size/2, y + size/2 + 3);
    }

    drawUnit(unit, x, y, size) {
        const colors = {
            'soldier': '#e53e3e',
            'archer': '#38b2ac',
            'knight': '#805ad5'
        };
        
        this.ctx.fillStyle = colors[unit.type] || '#4a5568';
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 单位图标
        this.ctx.fillStyle = 'white';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        const icons = { 'soldier': '⚔️', 'archer': '🏹', 'knight': '🛡️' };
        this.ctx.fillText(icons[unit.type] || '●', x + size/2, y + size/2 + 2);
    }

    drawResources() {
        const startX = 280;
        const startY = 40;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('资源:', startX, startY);
        
        const resources = [
            { name: 'gold', icon: '💰', color: '#f6ad55' },
            { name: 'wood', icon: '🪵', color: '#68d391' },
            { name: 'food', icon: '🍞', color: '#fc8181' }
        ];
        
        resources.forEach((resource, index) => {
            const y = startY + 20 + index * 20;
            
            // 资源背景
            this.ctx.fillStyle = resource.color;
            this.ctx.fillRect(startX, y - 12, 120, 16);
            
            // 资源文本
            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`${resource.icon} ${resource.name}: ${this.resources[resource.name]}`, 
                startX + 5, y);
        });
    }

    drawStrategy() {
        const startX = 280;
        const startY = 140;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('当前策略:', startX, startY);
        
        if (this.currentStrategy) {
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = '11px Arial';
            this.ctx.fillText(`名称: ${this.currentStrategy.name}`, startX, startY + 20);
            
            if (this.currentStrategy.goal) {
                this.ctx.fillText(`目标: ${this.currentStrategy.goal}`, startX, startY + 35);
            }
        } else {
            this.ctx.fillStyle = '#a0aec0';
            this.ctx.font = '10px Arial';
            this.ctx.fillText('未定义策略', startX, startY + 20);
        }
    }

    drawUnits() {
        const startX = 280;
        const startY = 200;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('军队:', startX, startY);
        
        const unitCounts = {};
        this.units.forEach(unit => {
            unitCounts[unit.type] = (unitCounts[unit.type] || 0) + 1;
        });
        
        let y = startY + 20;
        Object.keys(unitCounts).forEach(type => {
            this.ctx.fillStyle = '#718096';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`${type}: ${unitCounts[type]}`, startX, y);
            y += 15;
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStatus(message) {
        const statusElement = document.getElementById('strategyStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    reset() {
        this.gameBoard = this.initializeBoard();
        this.resources = { gold: 100, wood: 50, food: 30 };
        this.units = [];
        this.buildings = [];
        this.currentStrategy = null;
        this.turn = 1;
        this.draw();
        this.updateStatus('策略游戏已重置');
    }
}
