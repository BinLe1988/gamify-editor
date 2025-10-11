// 基础可视化器模块
class BaseVisualizer {
    constructor(canvasId, width = 400, height = 300) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.isAnimating = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStatus(message, statusElementId) {
        const statusElement = document.getElementById(statusElementId);
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    getRandomColor() {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    reset() {
        this.clear();
        this.isAnimating = false;
    }
}
