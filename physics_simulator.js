// 物理仿真组件
class PhysicsSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 300;
        
        this.balls = [];
        this.gravity = 9.8;
        this.isRunning = false;
        this.animationId = null;
        this.timeScale = 0.02; // 时间缩放因子
        
        this.draw();
    }

    createBall(x, y, mass = 1) {
        const ball = {
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            mass: mass,
            radius: Math.max(8, Math.min(20, mass * 8)),
            color: this.getRandomColor(),
            trail: [] // 轨迹点
        };
        
        this.balls.push(ball);
        this.draw();
        return ball;
    }

    setGravity(g) {
        this.gravity = g;
        this.updateStatus(`重力设置为 ${g} m/s²`);
    }

    applyForce(ballIndex, forceX, forceY) {
        if (ballIndex < this.balls.length) {
            const ball = this.balls[ballIndex];
            // F = ma, 所以 a = F/m
            const ax = forceX / ball.mass;
            const ay = forceY / ball.mass;
            
            // 施加瞬时速度变化
            ball.vx += ax * 0.5;
            ball.vy += ay * 0.5;
            
            this.updateStatus(`对球体 ${ballIndex + 1} 施加力 (${forceX}, ${forceY}) N`);
        }
    }

    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateStatus('物理仿真运行中...');
        this.animate();
    }

    stopSimulation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.updateStatus('仿真已停止');
    }

    animate() {
        if (!this.isRunning) return;
        
        this.updatePhysics();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updatePhysics() {
        this.balls.forEach(ball => {
            // 应用重力
            ball.vy += this.gravity * this.timeScale;
            
            // 更新位置
            ball.x += ball.vx;
            ball.y += ball.vy;
            
            // 添加轨迹点
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 30) {
                ball.trail.shift();
            }
            
            // 边界碰撞检测
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= this.canvas.width) {
                ball.vx *= -0.8; // 能量损失
                ball.x = Math.max(ball.radius, Math.min(this.canvas.width - ball.radius, ball.x));
            }
            
            if (ball.y + ball.radius >= this.canvas.height) {
                ball.vy *= -0.7; // 弹跳能量损失
                ball.y = this.canvas.height - ball.radius;
                
                // 摩擦力
                ball.vx *= 0.9;
            }
            
            if (ball.y - ball.radius <= 0) {
                ball.vy *= -0.8;
                ball.y = ball.radius;
            }
        });
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f0f8ff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制球体轨迹
        this.balls.forEach(ball => {
            this.drawTrail(ball);
        });
        
        // 绘制球体
        this.balls.forEach((ball, index) => {
            this.drawBall(ball, index);
        });
        
        // 绘制信息
        this.drawInfo();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawTrail(ball) {
        if (ball.trail.length < 2) return;
        
        this.ctx.strokeStyle = ball.color + '40'; // 半透明
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        ball.trail.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        
        this.ctx.stroke();
    }

    drawBall(ball, index) {
        // 球体阴影
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.beginPath();
        this.ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 球体主体
        const gradient = this.ctx.createRadialGradient(
            ball.x - ball.radius/3, ball.y - ball.radius/3, 0,
            ball.x, ball.y, ball.radius
        );
        gradient.addColorStop(0, this.lightenColor(ball.color, 40));
        gradient.addColorStop(1, ball.color);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 球体边框
        this.ctx.strokeStyle = this.darkenColor(ball.color, 20);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 球体编号
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(index + 1, ball.x, ball.y + 4);
        
        // 速度向量
        if (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) {
            this.drawVelocityVector(ball);
        }
    }

    drawVelocityVector(ball) {
        const scale = 5;
        const endX = ball.x + ball.vx * scale;
        const endY = ball.y + ball.vy * scale;
        
        this.ctx.strokeStyle = '#ff4444';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(ball.x, ball.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // 箭头
        const angle = Math.atan2(ball.vy, ball.vx);
        const arrowLength = 8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI/6),
            endY - arrowLength * Math.sin(angle - Math.PI/6)
        );
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI/6),
            endY - arrowLength * Math.sin(angle + Math.PI/6)
        );
        this.ctx.stroke();
    }

    drawInfo() {
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`重力: ${this.gravity} m/s²`, 10, 20);
        this.ctx.fillText(`球体数量: ${this.balls.length}`, 10, 35);
        
        if (this.balls.length > 0) {
            this.ctx.fillText('红色箭头: 速度向量', 10, 55);
        }
    }

    getRandomColor() {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + 
                     (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
                     .toString(16).slice(1);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R>255?255:R<0?0:R)*0x10000 + 
                     (G>255?255:G<0?0:G)*0x100 + (B>255?255:B<0?0:B))
                     .toString(16).slice(1);
    }

    updateStatus(message) {
        const statusElement = document.getElementById('physicsStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    reset() {
        this.stopSimulation();
        this.balls = [];
        this.gravity = 9.8;
        this.draw();
        this.updateStatus('仿真已重置');
    }
}
