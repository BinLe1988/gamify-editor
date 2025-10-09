// 拖拽代码块功能
class DragBlocksEditor {
    constructor(scenario, gameState) {
        this.scenario = scenario;
        this.gameState = gameState;
        this.blocks = this.getScenarioBlocks(scenario);
        this.correctOrder = this.blocks.map((_, i) => i);
        this.currentOrder = [];
        this.interpreter = new CodeInterpreter(gameState, scenario);
    }

    getScenarioBlocks(scenario) {
        const blocks = {
            programming: [
                { id: 0, code: 'print("开始程序")', text: '输出开始信息' },
                { id: 1, code: 'x = 10', text: '设置变量x为10' },
                { id: 2, code: 'if x > 5:', text: '判断x是否大于5' },
                { id: 3, code: 'print("x大于5")', text: '输出结果' }
            ],
            algorithm: [
                { id: 0, code: 'array nums = [3, 1, 4, 2]', text: '创建数组' },
                { id: 1, code: 'print("排序前: " + nums)', text: '显示原数组' },
                { id: 2, code: 'sort nums', text: '排序数组' },
                { id: 3, code: 'print("排序后: " + nums)', text: '显示结果' }
            ],
            datastructure: [
                { id: 0, code: 'stack.push(1)', text: '入栈: 1' },
                { id: 1, code: 'stack.push(2)', text: '入栈: 2' },
                { id: 2, code: 'stack.pop()', text: '出栈' },
                { id: 3, code: 'print("栈顶: " + stack.top())', text: '显示栈顶' }
            ],
            math: [
                { id: 0, code: 'set range -5 to 5', text: '设置坐标范围' },
                { id: 1, code: 'plot y = x^2', text: '绘制抛物线' },
                { id: 2, code: 'draw circle at (0, 0) radius 2', text: '绘制圆形' },
                { id: 3, code: 'calculate 2^2 + 1', text: '计算结果' }
            ],
            physics: [
                { id: 0, code: 'set gravity 9.8', text: '设置重力' },
                { id: 1, code: 'create ball at (50, 10)', text: '创建球体' },
                { id: 2, code: 'apply force 5 to ball', text: '施加力' },
                { id: 3, code: 'start simulation', text: '开始仿真' }
            ],
            game: [
                { id: 0, code: 'create player at (0, 0)', text: '创建玩家' },
                { id: 1, code: 'move player right', text: '向右移动' },
                { id: 2, code: 'move player right', text: '继续向右' },
                { id: 3, code: 'move player down', text: '向下移动' }
            ]
        };
        return blocks[scenario] || blocks.programming;
    }

    render() {
        const isGameScenario = this.scenario === 'game';
        const isAlgorithmScenario = this.scenario === 'algorithm';
        const isPhysicsScenario = this.scenario === 'physics';
        
        return `
            <div class="drag-editor ${isGameScenario ? 'game-mode' : ''} ${isAlgorithmScenario ? 'algorithm-mode' : ''} ${isPhysicsScenario ? 'physics-mode' : ''}">
                <div class="blocks-palette">
                    <h3>代码块</h3>
                    <div class="blocks-container" id="blocksContainer">
                        ${this.blocks.map(block => `
                            <div class="code-block" draggable="true" data-id="${block.id}">
                                <div class="block-text">${block.text}</div>
                                <div class="block-code">${block.code}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="drop-zone">
                    <h3>拖拽到这里组成代码</h3>
                    <div class="drop-area" id="dropArea">
                        <div class="drop-placeholder">将代码块拖拽到这里</div>
                    </div>
                    <button id="executeBtn" class="execute-btn" disabled>执行代码</button>
                </div>
                
                ${isGameScenario ? `
                <div class="game-panel">
                    <h3>游戏画面</h3>
                    <div class="game-info">
                        <span id="gameScore">得分: 0</span>
                        <button onclick="gameCanvas?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="gameCanvas" class="game-canvas"></canvas>
                    <div class="game-controls">
                        <div class="control-hint">💡 通过代码块控制玩家移动到金币位置</div>
                    </div>
                </div>
                ` : isAlgorithmScenario ? `
                <div class="algorithm-panel">
                    <h3>算法可视化</h3>
                    <div class="algorithm-info">
                        <span id="algorithmStatus">准备就绪</span>
                        <button onclick="algorithmVisualizer?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="algorithmCanvas" class="algorithm-canvas"></canvas>
                    <div class="algorithm-controls">
                        <div class="control-hint">💡 观察排序算法的执行过程</div>
                    </div>
                </div>
                ` : isPhysicsScenario ? `
                <div class="physics-panel">
                    <h3>物理仿真</h3>
                    <div class="physics-info">
                        <span id="physicsStatus">准备就绪</span>
                        <button onclick="physicsSimulator?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="physicsCanvas" class="physics-canvas"></canvas>
                    <div class="physics-controls">
                        <div class="control-hint">💡 观察物理力学现象的真实过程</div>
                    </div>
                </div>
                ` : `
                <div class="output-panel">
                    <h3>执行结果</h3>
                    <div id="dragOutput" class="output-content"></div>
                </div>
                `}
            </div>
        `;
    }

    initializeDragAndDrop() {
        const blocksContainer = document.getElementById('blocksContainer');
        const dropArea = document.getElementById('dropArea');
        const executeBtn = document.getElementById('executeBtn');

        // 拖拽开始
        blocksContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('code-block')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                e.target.style.opacity = '0.5';
            }
        });

        // 拖拽结束
        blocksContainer.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('code-block')) {
                e.target.style.opacity = '1';
            }
        });

        // 允许放置
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('drag-over');
        });

        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('drag-over');
        });

        // 放置处理
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('drag-over');
            
            const blockId = parseInt(e.dataTransfer.getData('text/plain'));
            this.addBlockToDropArea(blockId);
        });

        // 执行按钮
        executeBtn.addEventListener('click', () => {
            this.executeCode();
        });

        // 如果是游戏场景，初始化游戏画布
        if (this.scenario === 'game') {
            setTimeout(() => {
                window.gameCanvas = new GameCanvas('gameCanvas');
            }, 100);
        }
        
        // 如果是算法场景，初始化算法可视化器
        if (this.scenario === 'algorithm') {
            setTimeout(() => {
                window.algorithmVisualizer = new AlgorithmVisualizer('algorithmCanvas');
            }, 100);
        }
        
        // 如果是物理场景，初始化物理仿真器
        if (this.scenario === 'physics') {
            setTimeout(() => {
                window.physicsSimulator = new PhysicsSimulator('physicsCanvas');
            }, 100);
        }
    }

    addBlockToDropArea(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (!block || this.currentOrder.includes(blockId)) return;

        const dropArea = document.getElementById('dropArea');
        const placeholder = dropArea.querySelector('.drop-placeholder');
        
        if (placeholder) placeholder.remove();

        const blockElement = document.createElement('div');
        blockElement.className = 'dropped-block';
        blockElement.dataset.id = blockId;
        blockElement.innerHTML = `
            <span class="block-order">${this.currentOrder.length + 1}</span>
            <span class="block-text">${block.text}</span>
            <button class="remove-btn" onclick="dragEditor.removeBlock(${blockId})">×</button>
        `;

        dropArea.appendChild(blockElement);
        this.currentOrder.push(blockId);

        // 更新执行按钮状态
        document.getElementById('executeBtn').disabled = this.currentOrder.length === 0;
    }

    removeBlock(blockId) {
        const index = this.currentOrder.indexOf(blockId);
        if (index > -1) {
            this.currentOrder.splice(index, 1);
            
            const dropArea = document.getElementById('dropArea');
            const blockElement = dropArea.querySelector(`[data-id="${blockId}"]`);
            if (blockElement) blockElement.remove();

            // 重新编号
            dropArea.querySelectorAll('.dropped-block').forEach((el, i) => {
                el.querySelector('.block-order').textContent = i + 1;
            });

            // 如果没有块了，显示占位符
            if (this.currentOrder.length === 0) {
                dropArea.innerHTML = '<div class="drop-placeholder">将代码块拖拽到这里</div>';
                document.getElementById('executeBtn').disabled = true;
            }
        }
    }

    executeCode() {
        const isGameScenario = this.scenario === 'game';
        const isAlgorithmScenario = this.scenario === 'algorithm';
        const isPhysicsScenario = this.scenario === 'physics';
        const output = (isGameScenario || isAlgorithmScenario || isPhysicsScenario) ? 
            document.createElement('div') : 
            document.getElementById('dragOutput');
        
        // 检查顺序是否正确
        const isCorrect = this.checkOrder();
        
        if (isCorrect) {
            // 正确顺序，执行代码
            const code = this.currentOrder.map(id => this.blocks.find(b => b.id === id).code).join('\n');
            
            try {
                const results = this.interpreter.interpretCode(code);
                
                let outputHtml = '<div class="success-message">✅ 代码顺序正确！执行成功</div>';
                const movements = [];
                
                results.forEach(result => {
                    if (result.success) {
                        outputHtml += `<div class="success-line">✓ ${result.action}</div>`;
                        
                        // 游戏场景特殊处理 - 收集移动命令
                        if (isGameScenario && window.gameCanvas) {
                            const movement = this.extractMovement(result.line);
                            if (movement) movements.push(movement);
                        }
                        
                        // 算法场景特殊处理
                        if (isAlgorithmScenario && window.algorithmVisualizer) {
                            this.executeAlgorithmAction(result.line);
                        }
                        
                        // 物理场景特殊处理
                        if (isPhysicsScenario && window.physicsSimulator) {
                            this.executePhysicsAction(result.line);
                        }
                    } else {
                        outputHtml += `<div class="error-line">✗ ${result.error}</div>`;
                    }
                });
                
                // 游戏场景执行动画移动
                if (isGameScenario && window.gameCanvas && movements.length > 0) {
                    window.gameCanvas.executeMovements(movements);
                }
                
                if (!isGameScenario && !isAlgorithmScenario && !isPhysicsScenario) {
                    output.innerHTML = outputHtml;
                    this.showVisualization();
                }
                
                // 完成课程并获得XP
                this.completeLesson();
                
            } catch (error) {
                if (!isGameScenario && !isAlgorithmScenario && !isPhysicsScenario) {
                    output.innerHTML = `<div class="error-message">❌ 执行错误: ${error.message}</div>`;
                }
            }
        } else {
            // 错误顺序
            if (!isGameScenario && !isAlgorithmScenario && !isPhysicsScenario) {
                output.innerHTML = `
                    <div class="error-message">❌ 代码顺序错误！</div>
                    <div class="hint">正确顺序应该是: ${this.correctOrder.map(id => this.blocks[id].text).join(' → ')}</div>
                `;
            }
        }
    }

    executePhysicsAction(codeLine) {
        if (!window.physicsSimulator) return;
        
        if (codeLine.includes('set gravity')) {
            const match = codeLine.match(/set gravity (\d+(?:\.\d+)?)/);
            if (match) {
                const gravity = parseFloat(match[1]);
                window.physicsSimulator.setGravity(gravity);
            }
        } else if (codeLine.includes('create ball at')) {
            const match = codeLine.match(/create ball at \((\d+), (\d+)\)/);
            if (match) {
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                window.physicsSimulator.createBall(x, y, 1);
            }
        } else if (codeLine.includes('apply force')) {
            const match = codeLine.match(/apply force (\d+) to (\w+)/);
            if (match) {
                const force = parseInt(match[1]);
                // 对第一个球施加水平向右的力
                window.physicsSimulator.applyForce(0, force, 0);
            }
        } else if (codeLine.includes('start simulation')) {
            window.physicsSimulator.startSimulation();
        }
    }

    executeAlgorithmAction(codeLine) {
        if (!window.algorithmVisualizer) return;
        
        const statusElement = document.getElementById('algorithmStatus');
        
        if (codeLine.includes('array nums = [')) {
            const match = codeLine.match(/array nums = \[(.+)\]/);
            if (match) {
                const numbers = match[1].split(',').map(n => parseInt(n.trim()));
                window.algorithmVisualizer.setArray(numbers);
                if (statusElement) statusElement.textContent = '数组已创建';
            }
        } else if (codeLine.includes('sort nums')) {
            if (statusElement) statusElement.textContent = '正在排序...';
            // 默认使用冒泡排序
            window.algorithmVisualizer.bubbleSort();
        } else if (codeLine.includes('search nums for')) {
            const match = codeLine.match(/search nums for (\d+)/);
            if (match) {
                const target = parseInt(match[1]);
                if (statusElement) statusElement.textContent = `搜索数字 ${target}...`;
                window.algorithmVisualizer.search(target);
            }
        }
    }

    extractMovement(codeLine) {
        if (codeLine.includes('move player right')) return 'right';
        if (codeLine.includes('move player left')) return 'left';
        if (codeLine.includes('move player up')) return 'up';
        if (codeLine.includes('move player down')) return 'down';
        return null;
    }

    completeLesson() {
        const lessonId = progressSystem.getCurrentLesson(this.scenario);
        const reward = progressSystem.completeLesson(this.scenario, lessonId);
        
        if (reward && !reward.alreadyCompleted) {
            progressSystem.showReward(reward);
            // 更新进度显示
            this.updateProgressDisplay();
        }
    }

    updateProgressDisplay() {
        const progressHeader = document.querySelector('.progress-header');
        if (progressHeader) {
            progressHeader.outerHTML = progressSystem.renderProgressBar();
        }
    }

    checkOrder() {
        if (this.currentOrder.length !== this.correctOrder.length) return false;
        return this.currentOrder.every((id, index) => id === this.correctOrder[index]);
    }

    showVisualization() {
        // 简单的可视化效果
        const output = document.getElementById('dragOutput');
        const visualization = document.createElement('div');
        visualization.className = 'visualization';
        visualization.innerHTML = `
            <div class="success-animation">
                <div class="checkmark">✓</div>
                <div class="success-text">代码执行成功！</div>
                <div class="particles"></div>
            </div>
        `;
        output.appendChild(visualization);

        // 添加粒子效果
        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 2 + 's';
                visualization.querySelector('.particles').appendChild(particle);
            }
        }, 500);
    }
}

// 全局变量
let dragEditor = null;
