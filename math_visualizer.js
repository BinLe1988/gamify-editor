// 数学建模可视化组件
class MathVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 350;
        
        this.range = { min: -10, max: 10 };
        this.functions = [];
        this.shapes = [];
        this.points = [];
        this.animations = [];
        this.isAnimating = false;
        
        this.setupCoordinateSystem();
        this.draw();
    }

    setupCoordinateSystem() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.scaleX = (this.canvas.width - 60) / (this.range.max - this.range.min);
        this.scaleY = (this.canvas.height - 60) / (this.range.max - this.range.min);
    }

    async setRange(min, max) {
        this.range = { min, max };
        this.setupCoordinateSystem();
        this.draw();
        await this.delay(500);
        this.updateStatus(`设置坐标范围: [${min}, ${max}]`);
    }

    async plotFunction(funcStr) {
        this.updateStatus(`正在绘制函数: ${funcStr}`);
        
        const func = this.parseFunction(funcStr);
        const points = [];
        
        // 计算函数点
        for (let x = this.range.min; x <= this.range.max; x += 0.1) {
            try {
                const y = func(x);
                if (!isNaN(y) && isFinite(y)) {
                    points.push({ x, y });
                }
            } catch (e) {
                // 忽略计算错误的点
            }
        }
        
        // 动画绘制函数
        const functionObj = { 
            expression: funcStr, 
            points: [], 
            color: this.getRandomColor(),
            complete: false 
        };
        this.functions.push(functionObj);
        
        for (let i = 0; i < points.length; i += 5) {
            functionObj.points.push(...points.slice(i, i + 5));
            this.draw();
            await this.delay(50);
        }
        
        functionObj.complete = true;
        this.draw();
        await this.delay(500);
        this.updateStatus(`函数绘制完成: ${funcStr}`);
    }

    async drawCircle(x, y, radius) {
        this.updateStatus(`绘制圆形: 中心(${x}, ${y}), 半径${radius}`);
        
        const circle = { 
            type: 'circle', 
            x, y, radius, 
            color: this.getRandomColor(),
            animationProgress: 0 
        };
        this.shapes.push(circle);
        
        // 动画绘制圆形
        for (let progress = 0; progress <= 1; progress += 0.1) {
            circle.animationProgress = progress;
            this.draw();
            await this.delay(50);
        }
        
        circle.animationProgress = 1;
        this.draw();
        await this.delay(500);
        this.updateStatus(`圆形绘制完成`);
    }

    async drawRectangle(x, y, width, height) {
        this.updateStatus(`绘制矩形: (${x}, ${y}), 宽${width}, 高${height}`);
        
        const rect = { 
            type: 'rectangle', 
            x, y, width, height, 
            color: this.getRandomColor(),
            animationProgress: 0 
        };
        this.shapes.push(rect);
        
        // 动画绘制矩形
        for (let progress = 0; progress <= 1; progress += 0.1) {
            rect.animationProgress = progress;
            this.draw();
            await this.delay(50);
        }
        
        rect.animationProgress = 1;
        this.draw();
        await this.delay(500);
        this.updateStatus(`矩形绘制完成`);
    }

    async addPoint(x, y, label = '') {
        this.updateStatus(`添加点: (${x}, ${y})`);
        
        const point = { 
            x, y, label, 
            color: '#e53e3e',
            scale: 0 
        };
        this.points.push(point);
        
        // 动画显示点
        for (let scale = 0; scale <= 1; scale += 0.2) {
            point.scale = scale;
            this.draw();
            await this.delay(100);
        }
        
        point.scale = 1;
        this.draw();
        await this.delay(500);
        this.updateStatus(`点添加完成`);
    }

    async calculate(expression) {
        this.updateStatus(`计算: ${expression}`);
        
        try {
            // 简单的数学表达式计算
            const result = this.evaluateExpression(expression);
            
            // 在画布上显示计算过程
            await this.showCalculation(expression, result);
            
            this.updateStatus(`计算结果: ${expression} = ${result}`);
            return result;
        } catch (error) {
            this.updateStatus(`计算错误: ${expression}`);
            throw error;
        }
    }

    async showCalculation(expression, result) {
        const calcDisplay = {
            expression,
            result,
            opacity: 0,
            y: 50
        };
        
        // 淡入动画
        for (let opacity = 0; opacity <= 1; opacity += 0.2) {
            calcDisplay.opacity = opacity;
            this.drawCalculation(calcDisplay);
            await this.delay(100);
        }
        
        await this.delay(1000);
        
        // 淡出动画
        for (let opacity = 1; opacity >= 0; opacity -= 0.2) {
            calcDisplay.opacity = opacity;
            this.drawCalculation(calcDisplay);
            await this.delay(100);
        }
    }

    drawCalculation(calcDisplay) {
        this.draw();
        
        this.ctx.save();
        this.ctx.globalAlpha = calcDisplay.opacity;
        
        // 绘制计算框
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(50, calcDisplay.y, 300, 60);
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, calcDisplay.y, 300, 60);
        
        // 绘制文字
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(calcDisplay.expression, 200, calcDisplay.y + 25);
        this.ctx.fillText(`= ${calcDisplay.result}`, 200, calcDisplay.y + 45);
        
        this.ctx.restore();
    }

    parseFunction(funcStr) {
        // 解析常见的数学函数
        const normalized = funcStr.toLowerCase()
            .replace(/y\s*=\s*/, '')
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/log/g, 'Math.log')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs');
        
        return new Function('x', `return ${normalized}`);
    }

    evaluateExpression(expr) {
        // 简单的数学表达式求值
        const normalized = expr
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
        
        return eval(normalized);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.drawAxes();
        this.drawFunctions();
        this.drawShapes();
        this.drawPoints();
        this.drawLabels();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;
        
        // 垂直网格线
        for (let x = this.range.min; x <= this.range.max; x++) {
            const canvasX = this.centerX + x * this.scaleX;
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, 30);
            this.ctx.lineTo(canvasX, this.canvas.height - 30);
            this.ctx.stroke();
        }
        
        // 水平网格线
        for (let y = this.range.min; y <= this.range.max; y++) {
            const canvasY = this.centerY - y * this.scaleY;
            this.ctx.beginPath();
            this.ctx.moveTo(30, canvasY);
            this.ctx.lineTo(this.canvas.width - 30, canvasY);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // X轴
        this.ctx.beginPath();
        this.ctx.moveTo(30, this.centerY);
        this.ctx.lineTo(this.canvas.width - 30, this.centerY);
        this.ctx.stroke();
        
        // Y轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 30);
        this.ctx.lineTo(this.centerX, this.canvas.height - 30);
        this.ctx.stroke();
        
        // 坐标轴标签
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X轴刻度
        for (let x = this.range.min; x <= this.range.max; x += 2) {
            if (x !== 0) {
                const canvasX = this.centerX + x * this.scaleX;
                this.ctx.fillText(x.toString(), canvasX, this.centerY + 20);
            }
        }
        
        // Y轴刻度
        for (let y = this.range.min; y <= this.range.max; y += 2) {
            if (y !== 0) {
                const canvasY = this.centerY - y * this.scaleY;
                this.ctx.fillText(y.toString(), this.centerX - 20, canvasY + 4);
            }
        }
    }

    drawFunctions() {
        this.functions.forEach(func => {
            if (func.points.length < 2) return;
            
            this.ctx.strokeStyle = func.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            
            let firstPoint = true;
            func.points.forEach(point => {
                const canvasX = this.centerX + point.x * this.scaleX;
                const canvasY = this.centerY - point.y * this.scaleY;
                
                if (canvasY >= 30 && canvasY <= this.canvas.height - 30) {
                    if (firstPoint) {
                        this.ctx.moveTo(canvasX, canvasY);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(canvasX, canvasY);
                    }
                }
            });
            
            this.ctx.stroke();
        });
    }

    drawShapes() {
        this.shapes.forEach(shape => {
            const canvasX = this.centerX + shape.x * this.scaleX;
            const canvasY = this.centerY - shape.y * this.scaleY;
            
            this.ctx.strokeStyle = shape.color;
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = shape.color + '30';
            
            if (shape.type === 'circle') {
                const radius = shape.radius * this.scaleX * shape.animationProgress;
                this.ctx.beginPath();
                this.ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (shape.type === 'rectangle') {
                const width = shape.width * this.scaleX * shape.animationProgress;
                const height = shape.height * this.scaleY * shape.animationProgress;
                this.ctx.fillRect(canvasX - width/2, canvasY - height/2, width, height);
                this.ctx.strokeRect(canvasX - width/2, canvasY - height/2, width, height);
            }
        });
    }

    drawPoints() {
        this.points.forEach(point => {
            const canvasX = this.centerX + point.x * this.scaleX;
            const canvasY = this.centerY - point.y * this.scaleY;
            
            this.ctx.fillStyle = point.color;
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 5 * point.scale, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (point.label && point.scale > 0.5) {
                this.ctx.fillStyle = '#333';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(point.label, canvasX, canvasY - 10);
            }
        });
    }

    drawLabels() {
        // 绘制函数标签
        let labelY = 20;
        this.functions.forEach(func => {
            if (func.complete) {
                this.ctx.fillStyle = func.color;
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(func.expression, 10, labelY);
                labelY += 15;
            }
        });
    }

    getRandomColor() {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStatus(message) {
        const statusElement = document.getElementById('mathStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    reset() {
        this.functions = [];
        this.shapes = [];
        this.points = [];
        this.range = { min: -10, max: 10 };
        this.setupCoordinateSystem();
        this.draw();
        this.updateStatus('数学画布已重置');
    }
}
