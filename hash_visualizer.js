// 哈希算法可视化组件
class HashVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 450;
        this.canvas.height = 350;
        
        this.algorithmStep = 0;
        this.currentInput = 'apple'; // 示例输入
        this.sum = 0;
        this.currentCharIndex = 0;
        this.modulus = 8;
        this.result = null;
        
        // 启动动画循环
        this.startAnimationLoop();
        this.draw();
    }

    startAnimationLoop() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }

    async showDefineFunction() {
        this.algorithmStep = 1;
        this.draw();
        await this.delay(500);
        this.updateStatus('定义哈希函数: hash(key)');
    }

    async showInitializeSum() {
        this.algorithmStep = 2;
        this.sum = 0;
        this.draw();
        await this.delay(500);
        this.updateStatus('初始化累加器: sum = 0');
    }

    async showStartLoop() {
        this.algorithmStep = 3;
        this.currentCharIndex = 0;
        this.draw();
        await this.delay(500);
        this.updateStatus('开始遍历字符串中的每个字符');
    }

    async showAddAscii() {
        this.algorithmStep = 4;
        
        // 逐个字符处理
        for (let i = 0; i < this.currentInput.length; i++) {
            this.currentCharIndex = i;
            const char = this.currentInput[i];
            const ascii = char.charCodeAt(0);
            
            this.draw();
            this.drawCurrentCalculation(char, ascii);
            await this.delay(500);
            
            this.sum += ascii;
            this.draw();
            await this.delay(500);
        }
        
        this.updateStatus(`累加完成: sum = ${this.sum}`);
    }

    async showReturnModulo() {
        this.algorithmStep = 5;
        this.result = this.sum % this.modulus;
        this.draw();
        await this.delay(500);
        this.updateStatus(`返回结果: ${this.sum} % ${this.modulus} = ${this.result}`);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制标题
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('哈希算法实现', 10, 25);
        
        // 绘制算法步骤
        this.drawAlgorithmSteps();
        
        // 绘制当前执行状态
        this.drawExecutionState();
        
        // 绘制示例输入
        this.drawInputExample();
    }

    drawAlgorithmSteps() {
        const steps = [
            'function hash(key)',
            'sum = 0',
            'for char in key',
            'sum += ascii(char)',
            'return sum % 8'
        ];
        
        const startX = 20;
        const startY = 50;
        
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        
        steps.forEach((step, index) => {
            const y = startY + index * 30;
            
            // 高亮当前步骤 - 添加动画效果
            if (index + 1 === this.algorithmStep) {
                // 绘制高亮背景
                this.ctx.fillStyle = '#48bb78';
                this.ctx.fillRect(startX - 5, y - 20, 220, 25);
                
                // 添加闪烁效果
                const time = Date.now();
                const opacity = 0.7 + 0.3 * Math.sin(time * 0.01);
                this.ctx.globalAlpha = opacity;
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(startX - 5, y - 20, 220, 25);
                this.ctx.globalAlpha = 1;
            }
            
            // 绘制步骤文本
            this.ctx.fillStyle = index + 1 === this.algorithmStep ? 'white' : '#4a5568';
            this.ctx.font = index + 1 === this.algorithmStep ? 'bold 14px Arial' : '14px Arial';
            this.ctx.fillText(`${index + 1}. ${step}`, startX, y);
        });
    }

    drawExecutionState() {
        const startX = 250;
        const startY = 50;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('执行状态:', startX, startY);
        
        // 显示当前变量值
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`输入: "${this.currentInput}"`, startX, startY + 25);
        this.ctx.fillText(`sum: ${this.sum}`, startX, startY + 45);
        
        if (this.algorithmStep >= 4 && this.currentCharIndex < this.currentInput.length) {
            const char = this.currentInput[this.currentCharIndex];
            const ascii = char.charCodeAt(0);
            this.ctx.fillText(`当前字符: '${char}' (${ascii})`, startX, startY + 65);
        }
        
        if (this.result !== null) {
            this.ctx.fillStyle = '#e53e3e';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText(`结果: ${this.result}`, startX, startY + 85);
        }
    }

    drawInputExample() {
        const startX = 20;
        const startY = 220;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('示例计算:', startX, startY);
        
        // 绘制字符串 - 添加动画效果
        this.ctx.font = '12px Arial';
        let charX = startX;
        const charY = startY + 30;
        
        for (let i = 0; i < this.currentInput.length; i++) {
            const char = this.currentInput[i];
            const ascii = char.charCodeAt(0);
            
            // 动画高亮当前处理的字符
            let bgColor = '#e2e8f0';
            let borderColor = '#a0aec0';
            let borderWidth = 1;
            
            if (this.algorithmStep >= 4 && i === this.currentCharIndex) {
                // 当前字符 - 金色高亮 + 脉动效果
                const time = Date.now();
                const pulse = 0.8 + 0.2 * Math.sin(time * 0.02);
                bgColor = '#ffd700';
                borderColor = '#f6ad55';
                borderWidth = 3;
                
                // 脉动效果
                this.ctx.save();
                this.ctx.globalAlpha = pulse;
            } else if (this.algorithmStep >= 4 && i < this.currentCharIndex) {
                // 已处理字符 - 绿色
                bgColor = '#c6f6d5';
                borderColor = '#48bb78';
            }
            
            // 字符框
            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(charX, charY, 30, 30);
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = borderWidth;
            this.ctx.strokeRect(charX, charY, 30, 30);
            
            // 字符
            this.ctx.fillStyle = '#2d3748';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(char, charX + 15, charY + 20);
            
            // ASCII值
            this.ctx.fillStyle = '#718096';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(ascii.toString(), charX + 15, charY + 40);
            
            if (this.algorithmStep >= 4 && i === this.currentCharIndex) {
                this.ctx.restore();
            }
            
            charX += 35;
        }
        
        // 显示计算过程 - 添加动画效果
        if (this.algorithmStep >= 4) {
            this.ctx.fillStyle = '#4a5568';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            
            let formula = 'sum = ';
            let runningSum = 0;
            
            for (let i = 0; i <= Math.min(this.currentCharIndex, this.currentInput.length - 1); i++) {
                const ascii = this.currentInput[i].charCodeAt(0);
                runningSum += ascii;
                formula += ascii;
                if (i < Math.min(this.currentCharIndex, this.currentInput.length - 1)) {
                    formula += ' + ';
                }
            }
            
            formula += ` = ${runningSum}`;
            
            // 动画显示公式
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(formula, startX, startY + 80);
            
            if (this.algorithmStep >= 5) {
                // 最终结果 - 闪烁效果
                const time = Date.now();
                const opacity = 0.6 + 0.4 * Math.sin(time * 0.015);
                this.ctx.globalAlpha = opacity;
                this.ctx.fillStyle = '#e53e3e';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.fillText(`${runningSum} % ${this.modulus} = ${this.result}`, startX, startY + 100);
                this.ctx.globalAlpha = 1;
            }
        }
    }

    drawCurrentCalculation(char, ascii) {
        const startX = 20;
        const startY = 280;
        
        // 添加动画背景
        const time = Date.now();
        const opacity = 0.3 + 0.2 * Math.sin(time * 0.02);
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#fed7d7';
        this.ctx.fillRect(startX - 5, startY - 15, 400, 35);
        this.ctx.globalAlpha = 1;
        
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`正在处理: '${char}' (ASCII: ${ascii})`, startX, startY);
        this.ctx.fillText(`sum = ${this.sum - ascii} + ${ascii} = ${this.sum}`, startX, startY + 20);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStatus(message) {
        const statusElement = document.getElementById('hashStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    reset() {
        this.algorithmStep = 0;
        this.sum = 0;
        this.currentCharIndex = 0;
        this.result = null;
        this.draw();
        this.updateStatus('哈希算法已重置');
    }
}
