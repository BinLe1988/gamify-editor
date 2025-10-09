// 算法可视化组件
class AlgorithmVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 200;
        
        this.array = [];
        this.comparing = [];
        this.swapping = [];
        this.sorted = [];
        this.isAnimating = false;
        
        this.cellWidth = 40;
        this.cellHeight = 30;
        this.startX = 20;
        this.startY = 100;
    }

    setArray(arr) {
        this.array = [...arr];
        this.comparing = [];
        this.swapping = [];
        this.sorted = [];
        this.draw();
    }

    async bubbleSort() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const arr = [...this.array];
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // 高亮比较的元素
                this.comparing = [j, j + 1];
                this.draw();
                await this.delay(800);
                
                if (arr[j] > arr[j + 1]) {
                    // 高亮交换的元素
                    this.swapping = [j, j + 1];
                    this.draw();
                    await this.delay(400);
                    
                    // 执行交换
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.array = [...arr];
                    this.draw();
                    await this.delay(400);
                }
                
                this.comparing = [];
                this.swapping = [];
            }
            // 标记已排序的元素
            this.sorted.push(n - 1 - i);
        }
        
        // 标记第一个元素也已排序
        this.sorted.push(0);
        this.draw();
        this.isAnimating = false;
        
        this.showCompletionEffect();
    }

    async selectionSort() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const arr = [...this.array];
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.comparing = [i];
            
            for (let j = i + 1; j < n; j++) {
                this.comparing = [i, j, minIdx];
                this.draw();
                await this.delay(600);
                
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            
            if (minIdx !== i) {
                this.swapping = [i, minIdx];
                this.draw();
                await this.delay(600);
                
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                this.array = [...arr];
            }
            
            this.sorted.push(i);
            this.comparing = [];
            this.swapping = [];
            this.draw();
            await this.delay(400);
        }
        
        this.sorted.push(n - 1);
        this.draw();
        this.isAnimating = false;
        
        this.showCompletionEffect();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制数组标题
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('数组可视化:', 20, 30);
        
        // 绘制数组元素
        this.array.forEach((value, index) => {
            const x = this.startX + index * (this.cellWidth + 5);
            const y = this.startY;
            
            // 确定颜色
            let color = '#e2e8f0'; // 默认颜色
            if (this.sorted.includes(index)) {
                color = '#48bb78'; // 已排序 - 绿色
            } else if (this.swapping.includes(index)) {
                color = '#e53e3e'; // 交换中 - 红色
            } else if (this.comparing.includes(index)) {
                color = '#ed8936'; // 比较中 - 橙色
            }
            
            // 绘制方格
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
            
            // 绘制边框
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
            
            // 绘制数值
            this.ctx.fillStyle = this.sorted.includes(index) ? 'white' : '#2d3748';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value, x + this.cellWidth / 2, y + this.cellHeight / 2 + 5);
            
            // 绘制索引
            this.ctx.fillStyle = '#718096';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(index, x + this.cellWidth / 2, y + this.cellHeight + 15);
        });
        
        // 绘制图例
        this.drawLegend();
    }

    drawLegend() {
        const legendY = 160;
        const legendItems = [
            { color: '#e2e8f0', text: '未排序', textColor: '#2d3748' },
            { color: '#ed8936', text: '比较中', textColor: 'white' },
            { color: '#e53e3e', text: '交换中', textColor: 'white' },
            { color: '#48bb78', text: '已排序', textColor: 'white' }
        ];
        
        legendItems.forEach((item, index) => {
            const x = 20 + index * 90;
            
            // 绘制颜色块
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(x, legendY, 20, 15);
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.strokeRect(x, legendY, 20, 15);
            
            // 绘制文字
            this.ctx.fillStyle = '#4a5568';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(item.text, x + 25, legendY + 12);
        });
    }

    showCompletionEffect() {
        // 简单的完成效果
        const originalArray = [...this.array];
        let flash = 0;
        
        const flashInterval = setInterval(() => {
            if (flash % 2 === 0) {
                this.sorted = [];
            } else {
                this.sorted = originalArray.map((_, i) => i);
            }
            this.draw();
            flash++;
            
            if (flash >= 6) {
                clearInterval(flashInterval);
                this.sorted = originalArray.map((_, i) => i);
                this.draw();
            }
        }, 200);
    }

    reset() {
        this.comparing = [];
        this.swapping = [];
        this.sorted = [];
        this.isAnimating = false;
        this.draw();
    }

    search(target) {
        if (this.isAnimating) return;
        this.linearSearch(target);
    }

    async linearSearch(target) {
        this.isAnimating = true;
        this.reset();
        
        for (let i = 0; i < this.array.length; i++) {
            this.comparing = [i];
            this.draw();
            await this.delay(800);
            
            if (this.array[i] === target) {
                this.sorted = [i]; // 用绿色表示找到
                this.comparing = [];
                this.draw();
                this.isAnimating = false;
                return;
            }
        }
        
        this.comparing = [];
        this.draw();
        this.isAnimating = false;
    }
}
