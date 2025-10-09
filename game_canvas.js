// 游戏画面渲染组件
class GameCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 8;
        this.cellSize = 40;
        this.canvas.width = this.gridSize * this.cellSize;
        this.canvas.height = this.gridSize * this.cellSize;
        
        this.player = { x: 0, y: 0 };
        this.coins = [{ x: 2, y: 1 }];
        this.score = 0;
        this.moveQueue = [];
        this.isMoving = false;
        
        this.draw();
    }

    executeMovements(movements) {
        this.moveQueue = [...movements];
        this.processNextMove();
    }

    processNextMove() {
        if (this.moveQueue.length === 0 || this.isMoving) return;
        
        this.isMoving = true;
        const direction = this.moveQueue.shift();
        
        setTimeout(() => {
            this.movePlayer(direction);
            this.isMoving = false;
            this.processNextMove();
        }, 500);
    }

    movePlayer(direction) {
        const moves = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const move = moves[direction];
        if (move) {
            const newX = Math.max(0, Math.min(this.gridSize - 1, this.player.x + move.x));
            const newY = Math.max(0, Math.min(this.gridSize - 1, this.player.y + move.y));
            
            this.player.x = newX;
            this.player.y = newY;
            this.draw();
            this.checkCoinCollection();
        }
    }

    spawnCoin(x, y) {
        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            this.coins.push({ x, y });
            this.draw();
        }
    }

    checkCoinCollection() {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            if (coin.x === this.player.x && coin.y === this.player.y) {
                this.coins.splice(i, 1);
                this.score += 10;
                this.showCoinEffect();
                this.updateScoreDisplay();
            }
        }
    }

    showCoinEffect() {
        const effect = document.createElement('div');
        effect.textContent = '+10';
        effect.style.cssText = `
            position: absolute;
            left: ${this.player.x * this.cellSize + 20}px;
            top: ${this.player.y * this.cellSize + 10}px;
            color: #ffd700;
            font-weight: bold;
            font-size: 16px;
            pointer-events: none;
            animation: floatUp 1s ease-out forwards;
        `;
        
        this.canvas.parentElement.style.position = 'relative';
        this.canvas.parentElement.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('gameScore');
        if (scoreElement) {
            scoreElement.textContent = `得分: ${this.score}`;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
        
        // 绘制金币
        this.coins.forEach(coin => {
            const centerX = coin.x * this.cellSize + this.cellSize / 2;
            const centerY = coin.y * this.cellSize + this.cellSize / 2;
            
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#ffed4e';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 金币符号
            this.ctx.fillStyle = '#b45309';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('¥', centerX, centerY + 4);
        });
        
        // 绘制玩家
        const playerCenterX = this.player.x * this.cellSize + this.cellSize / 2;
        const playerCenterY = this.player.y * this.cellSize + this.cellSize / 2;
        
        // 玩家身体
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(playerCenterX, playerCenterY, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 玩家眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(playerCenterX - 5, playerCenterY - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(playerCenterX + 5, playerCenterY - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 玩家嘴巴
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(playerCenterX, playerCenterY + 2, 6, 0, Math.PI);
        this.ctx.stroke();
    }

    reset() {
        this.player = { x: 0, y: 0 };
        this.coins = [{ x: 2, y: 1 }];
        this.score = 0;
        this.moveQueue = [];
        this.isMoving = false;
        this.updateScoreDisplay();
        this.draw();
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-30px); opacity: 0; }
    }
`;
document.head.appendChild(style);
