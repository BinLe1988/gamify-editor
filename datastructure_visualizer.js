// 数据结构可视化组件
class DataStructureVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 450;
        this.canvas.height = 350;
        
        this.stack = [];
        this.queue = [];
        this.tree = null;
        this.graph = { nodes: [], edges: [] };
        this.heap = [];
        
        this.animating = false;
        this.highlightedElements = [];
        
        this.draw();
    }

    // 栈操作
    async pushStack(value) {
        this.highlightedElements = ['stack-new'];
        this.stack.push({ value, highlight: 'new' });
        this.draw();
        await this.delay(800);
        
        this.stack[this.stack.length - 1].highlight = null;
        this.highlightedElements = [];
        this.draw();
        this.updateStatus(`入栈: ${value}`);
    }

    async popStack() {
        if (this.stack.length === 0) {
            this.updateStatus('栈为空，无法出栈');
            return null;
        }
        
        this.stack[this.stack.length - 1].highlight = 'removing';
        this.draw();
        await this.delay(800);
        
        const popped = this.stack.pop();
        this.draw();
        this.updateStatus(`出栈: ${popped.value}`);
        return popped.value;
    }

    // 队列操作
    async enqueue(value) {
        this.queue.push({ value, highlight: 'new' });
        this.draw();
        await this.delay(800);
        
        this.queue[this.queue.length - 1].highlight = null;
        this.draw();
        this.updateStatus(`入队: ${value}`);
    }

    async dequeue() {
        if (this.queue.length === 0) {
            this.updateStatus('队列为空，无法出队');
            return null;
        }
        
        this.queue[0].highlight = 'removing';
        this.draw();
        await this.delay(800);
        
        const dequeued = this.queue.shift();
        // 重新绘制队列位置
        this.draw();
        this.updateStatus(`出队: ${dequeued.value}`);
        return dequeued.value;
    }

    // 树操作
    async insertTree(value) {
        if (!this.tree) {
            this.tree = { value, left: null, right: null, highlight: 'new' };
        } else {
            this.insertNode(this.tree, value);
        }
        this.draw();
        await this.delay(800);
        
        this.clearTreeHighlights(this.tree);
        this.draw();
        this.updateStatus(`插入节点: ${value}`);
    }

    insertNode(node, value) {
        if (value < node.value) {
            if (!node.left) {
                node.left = { value, left: null, right: null, highlight: 'new' };
            } else {
                this.insertNode(node.left, value);
            }
        } else {
            if (!node.right) {
                node.right = { value, left: null, right: null, highlight: 'new' };
            } else {
                this.insertNode(node.right, value);
            }
        }
    }

    clearTreeHighlights(node) {
        if (node) {
            node.highlight = null;
            this.clearTreeHighlights(node.left);
            this.clearTreeHighlights(node.right);
        }
    }

    // 堆操作
    async insertHeap(value) {
        this.heap.push({ value, highlight: 'new' });
        this.heapifyUp(this.heap.length - 1);
        this.draw();
        await this.delay(800);
        
        this.heap.forEach(item => item.highlight = null);
        this.draw();
        this.updateStatus(`堆插入: ${value}`);
    }

    heapifyUp(index) {
        if (index === 0) return;
        
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].value > this.heap[parentIndex].value) {
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            this.heap[index].highlight = 'swapped';
            this.heap[parentIndex].highlight = 'swapped';
            this.heapifyUp(parentIndex);
        }
    }

    // 图操作
    addGraphNode(value) {
        const node = {
            id: value,
            x: 50 + (this.graph.nodes.length % 4) * 80,
            y: 50 + Math.floor(this.graph.nodes.length / 4) * 60,
            highlight: 'new'
        };
        this.graph.nodes.push(node);
        this.draw();
        
        setTimeout(() => {
            node.highlight = null;
            this.draw();
        }, 800);
        
        this.updateStatus(`添加节点: ${value}`);
    }

    addGraphEdge(from, to) {
        const fromNode = this.graph.nodes.find(n => n.id === from);
        const toNode = this.graph.nodes.find(n => n.id === to);
        
        if (fromNode && toNode) {
            this.graph.edges.push({ from: fromNode, to: toNode, highlight: 'new' });
            this.draw();
            
            setTimeout(() => {
                this.graph.edges[this.graph.edges.length - 1].highlight = null;
                this.draw();
            }, 800);
            
            this.updateStatus(`添加边: ${from} -> ${to}`);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制标题
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('数据结构可视化', 10, 25);
        
        // 绘制各种数据结构
        this.drawStack();
        this.drawQueue();
        this.drawTree();
        this.drawHeap();
        this.drawGraph();
    }

    drawStack() {
        const startX = 20;
        const startY = 50;
        const boxWidth = 60;
        const boxHeight = 30;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('栈 (Stack)', startX, startY - 5);
        
        this.stack.forEach((item, index) => {
            const y = startY + (this.stack.length - 1 - index) * (boxHeight + 5);
            
            // 选择颜色
            let color = '#e2e8f0';
            if (item.highlight === 'new') color = '#48bb78';
            if (item.highlight === 'removing') color = '#e53e3e';
            
            // 绘制方框
            this.ctx.fillStyle = color;
            this.ctx.fillRect(startX, y, boxWidth, boxHeight);
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.strokeRect(startX, y, boxWidth, boxHeight);
            
            // 绘制数值
            this.ctx.fillStyle = item.highlight ? 'white' : '#2d3748';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.value, startX + boxWidth/2, y + boxHeight/2 + 5);
        });
        
        // 绘制栈顶指针
        if (this.stack.length > 0) {
            const topY = startY + (this.stack.length - 1) * (boxHeight + 5);
            this.ctx.fillStyle = '#e53e3e';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('← TOP', startX + boxWidth + 10, topY + boxHeight/2 + 5);
        }
    }

    drawQueue() {
        const startX = 120;
        const startY = 50;
        const boxWidth = 40;
        const boxHeight = 30;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('队列 (Queue)', startX, startY - 5);
        
        this.queue.forEach((item, index) => {
            const x = startX + index * (boxWidth + 5);
            
            // 选择颜色
            let color = '#e2e8f0';
            if (item.highlight === 'new') color = '#48bb78';
            if (item.highlight === 'removing') color = '#e53e3e';
            
            // 绘制方框
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, startY, boxWidth, boxHeight);
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.strokeRect(x, startY, boxWidth, boxHeight);
            
            // 绘制数值
            this.ctx.fillStyle = item.highlight ? 'white' : '#2d3748';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.value, x + boxWidth/2, startY + boxHeight/2 + 4);
        });
        
        // 绘制队头队尾指针
        if (this.queue.length > 0) {
            this.ctx.fillStyle = '#e53e3e';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('FRONT', startX + boxWidth/2, startY + boxHeight + 15);
            
            const rearX = startX + (this.queue.length - 1) * (boxWidth + 5);
            this.ctx.fillText('REAR', rearX + boxWidth/2, startY + boxHeight + 15);
        }
    }

    drawTree() {
        const startX = 300;
        const startY = 120;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('二叉树 (Binary Tree)', startX, 55);
        
        if (this.tree) {
            this.drawTreeNode(this.tree, startX + 50, startY, 40);
        }
    }

    drawTreeNode(node, x, y, spacing) {
        if (!node) return;
        
        // 绘制连线到子节点
        if (node.left) {
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - spacing, y + 40);
            this.ctx.stroke();
            this.drawTreeNode(node.left, x - spacing, y + 40, spacing / 2);
        }
        
        if (node.right) {
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + spacing, y + 40);
            this.ctx.stroke();
            this.drawTreeNode(node.right, x + spacing, y + 40, spacing / 2);
        }
        
        // 绘制节点
        let color = '#e2e8f0';
        if (node.highlight === 'new') color = '#48bb78';
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#a0aec0';
        this.ctx.stroke();
        
        // 绘制数值
        this.ctx.fillStyle = node.highlight ? 'white' : '#2d3748';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.value, x, y + 4);
    }

    drawHeap() {
        const startX = 20;
        const startY = 200;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('堆 (Heap)', startX, startY - 5);
        
        this.heap.forEach((item, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const posInLevel = index - (Math.pow(2, level) - 1);
            const maxInLevel = Math.pow(2, level);
            
            const x = startX + 100 + (posInLevel - maxInLevel/2) * 40 + 20;
            const y = startY + level * 40;
            
            // 绘制连线到父节点
            if (index > 0) {
                const parentIndex = Math.floor((index - 1) / 2);
                const parentLevel = Math.floor(Math.log2(parentIndex + 1));
                const parentPosInLevel = parentIndex - (Math.pow(2, parentLevel) - 1);
                const parentMaxInLevel = Math.pow(2, parentLevel);
                const parentX = startX + 100 + (parentPosInLevel - parentMaxInLevel/2) * 40 + 20;
                const parentY = startY + parentLevel * 40;
                
                this.ctx.strokeStyle = '#a0aec0';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(parentX, parentY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }
            
            // 选择颜色
            let color = '#e2e8f0';
            if (item.highlight === 'new') color = '#48bb78';
            if (item.highlight === 'swapped') color = '#ed8936';
            
            // 绘制节点
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.stroke();
            
            // 绘制数值
            this.ctx.fillStyle = item.highlight ? 'white' : '#2d3748';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.value, x, y + 4);
        });
    }

    drawGraph() {
        const startX = 300;
        const startY = 220;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('图 (Graph)', startX, startY - 5);
        
        // 绘制边
        this.graph.edges.forEach(edge => {
            this.ctx.strokeStyle = edge.highlight === 'new' ? '#48bb78' : '#a0aec0';
            this.ctx.lineWidth = edge.highlight === 'new' ? 3 : 2;
            this.ctx.beginPath();
            this.ctx.moveTo(edge.from.x, edge.from.y);
            this.ctx.lineTo(edge.to.x, edge.to.y);
            this.ctx.stroke();
            
            // 绘制箭头
            const angle = Math.atan2(edge.to.y - edge.from.y, edge.to.x - edge.from.x);
            const arrowLength = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(edge.to.x, edge.to.y);
            this.ctx.lineTo(
                edge.to.x - arrowLength * Math.cos(angle - Math.PI/6),
                edge.to.y - arrowLength * Math.sin(angle - Math.PI/6)
            );
            this.ctx.moveTo(edge.to.x, edge.to.y);
            this.ctx.lineTo(
                edge.to.x - arrowLength * Math.cos(angle + Math.PI/6),
                edge.to.y - arrowLength * Math.sin(angle + Math.PI/6)
            );
            this.ctx.stroke();
        });
        
        // 绘制节点
        this.graph.nodes.forEach(node => {
            let color = '#e2e8f0';
            if (node.highlight === 'new') color = '#48bb78';
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#a0aec0';
            this.ctx.stroke();
            
            // 绘制标签
            this.ctx.fillStyle = node.highlight ? 'white' : '#2d3748';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.id, node.x, node.y + 4);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStatus(message) {
        const statusElement = document.getElementById('datastructureStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    reset() {
        this.stack = [];
        this.queue = [];
        this.tree = null;
        this.heap = [];
        this.graph = { nodes: [], edges: [] };
        this.highlightedElements = [];
        this.draw();
        this.updateStatus('数据结构已重置');
    }
}
