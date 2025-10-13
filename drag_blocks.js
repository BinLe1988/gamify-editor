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
            cs: [
                { id: 0, code: 'function hash(key)', text: '定义哈希函数' },
                { id: 1, code: 'sum = 0', text: '初始化累加器' },
                { id: 2, code: 'for char in key', text: '遍历字符' },
                { id: 3, code: 'sum += ascii(char)', text: '累加ASCII值' },
                { id: 4, code: 'return sum % 8', text: '取模运算' }
            ],
            strategy: [
                { id: 0, code: 'define strategy "expansion"', text: '定义扩张策略' },
                { id: 1, code: 'set goal "control territory"', text: '设定控制目标' },
                { id: 2, code: 'build farm at (2, 3)', text: '建造农场' },
                { id: 3, code: 'train soldier at (1, 1)', text: '训练士兵' },
                { id: 4, code: 'execute strategy', text: '执行策略' }
            ],
            aichat: [
                { id: 0, code: 'set thinking mode "brainstorm"', text: '设置头脑风暴模式' },
                { id: 1, code: 'ask "如何学习编程"', text: '提问：如何学习编程' },
                { id: 2, code: 'refine prompt with context', text: '添加背景信息' },
                { id: 3, code: 'ask "作为初学者，如何系统学习Python编程，有哪些实践项目推荐"', text: '优化后的提问' },
                { id: 4, code: 'analyze response quality', text: '分析回复质量' }
            ]
        };
        return blocks[scenario] || blocks.programming;
    }

    render() {
        const isGameScenario = this.scenario === 'game';
        const isAlgorithmScenario = this.scenario === 'algorithm';
        const isPhysicsScenario = this.scenario === 'physics';
        const isDataStructureScenario = this.scenario === 'datastructure';
        const isMathScenario = this.scenario === 'math';
        const isHashScenario = this.scenario === 'hash';
        const isStrategyScenario = this.scenario === 'strategy';
        const isAIChatScenario = this.scenario === 'aichat';
        
        return `
            <div class="drag-editor ${isGameScenario ? 'game-mode' : ''} ${isAlgorithmScenario ? 'algorithm-mode' : ''} ${isPhysicsScenario ? 'physics-mode' : ''} ${isDataStructureScenario ? 'datastructure-mode' : ''} ${isMathScenario ? 'math-mode' : ''} ${isHashScenario ? 'hash-mode' : ''} ${isStrategyScenario ? 'strategy-mode' : ''} ${isAIChatScenario ? 'aichat-mode' : ''}">
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
                ` : isDataStructureScenario ? `
                <div class="datastructure-panel">
                    <h3>数据结构可视化</h3>
                    <div class="datastructure-info">
                        <span id="datastructureStatus">准备就绪</span>
                        <button onclick="datastructureVisualizer?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="datastructureCanvas" class="datastructure-canvas"></canvas>
                    <div class="datastructure-controls">
                        <div class="control-hint">💡 观察数据结构的动态变化过程</div>
                    </div>
                </div>
                ` : isMathScenario ? `
                <div class="math-panel">
                    <h3>数学可视化</h3>
                    <div class="math-info">
                        <span id="mathStatus">准备就绪</span>
                        <button onclick="mathVisualizer?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="mathCanvas" class="math-canvas"></canvas>
                    <div class="math-controls">
                        <div class="control-hint">💡 观察数学函数和图形的绘制过程</div>
                    </div>
                </div>
                ` : isHashScenario ? `
                <div class="hash-panel">
                    <h3>哈希算法可视化</h3>
                    <div class="hash-info">
                        <span id="hashStatus">准备就绪</span>
                        <button onclick="hashVisualizer?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="hashCanvas" class="hash-canvas"></canvas>
                    <div class="hash-controls">
                        <div class="control-hint">💡 观察哈希算法的计算和存储过程</div>
                    </div>
                </div>
                ` : isStrategyScenario ? `
                <div class="strategy-panel">
                    <h3>策略游戏</h3>
                    <div class="strategy-info">
                        <span id="strategyStatus">准备就绪</span>
                        <button onclick="strategyVisualizer?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="strategyCanvas" class="strategy-canvas"></canvas>
                    <div class="strategy-controls">
                        <div class="control-hint">💡 通过代码制定策略规划游戏目标</div>
                    </div>
                </div>
                ` : isAIChatScenario ? `
                <div class="aichat-panel">
                    <h3>AI Thinking Partner</h3>
                    <div class="aichat-info">
                        <span id="aiChatStatus">准备就绪</span>
                        <button onclick="aiChatVisualizer?.reset()" class="reset-btn">重置</button>
                    </div>
                    <canvas id="aiChatCanvas" class="aichat-canvas"></canvas>
                    <div class="aichat-controls">
                        <div class="control-hint">💡 学习如何与AI有效对话，提升提问技巧</div>
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
        
        // 如果是数据结构场景，初始化数据结构可视化器
        if (this.scenario === 'datastructure') {
            setTimeout(() => {
                window.datastructureVisualizer = new DataStructureVisualizer('datastructureCanvas');
            }, 100);
        }
        
        // 如果是数学场景，初始化数学可视化器
        if (this.scenario === 'math') {
            setTimeout(() => {
                window.mathVisualizer = new MathVisualizer('mathCanvas');
            }, 100);
        }
        
        // 如果是哈希场景，初始化哈希可视化器
        if (this.scenario === 'hash') {
            setTimeout(() => {
                window.hashVisualizer = new HashVisualizer('hashCanvas');
            }, 100);
        }
        
        // 如果是策略场景，初始化策略可视化器
        if (this.scenario === 'strategy') {
            setTimeout(() => {
                window.strategyVisualizer = new StrategyVisualizer('strategyCanvas');
            }, 100);
        }
        
        // 如果是AI聊天场景，初始化AI聊天可视化器
        if (this.scenario === 'aichat') {
            setTimeout(() => {
                window.aiChatVisualizer = new AIChatVisualizer('aiChatCanvas');
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

    async executeCode() {
        const isGameScenario = this.scenario === 'game';
        const isAlgorithmScenario = this.scenario === 'algorithm';
        const isPhysicsScenario = this.scenario === 'physics';
        const isDataStructureScenario = this.scenario === 'datastructure';
        const isMathScenario = this.scenario === 'math';
        const isHashScenario = this.scenario === 'hash';
        const isAIChatScenario = this.scenario === 'aichat';
        const output = (isGameScenario || isAlgorithmScenario || isPhysicsScenario || isDataStructureScenario || isMathScenario || isHashScenario || isStrategyScenario || isAIChatScenario) ? 
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
                
                // 哈希场景需要按顺序执行
                if (isHashScenario && window.hashVisualizer) {
                    await this.executeHashSequence(results);
                } else if (isStrategyScenario && window.strategyVisualizer) {
                    await this.executeStrategySequence(results);
                } else if (isAIChatScenario && window.aiChatVisualizer) {
                    await this.executeAIChatSequence(results);
                } else {
                    // 其他场景的处理
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
                            
                            // 数据结构场景特殊处理
                            if (isDataStructureScenario && window.datastructureVisualizer) {
                                this.executeDataStructureAction(result.line);
                            }
                            
                            // 数学场景特殊处理
                            if (isMathScenario && window.mathVisualizer) {
                                this.executeMathAction(result.line);
                            }
                        } else {
                            outputHtml += `<div class="error-line">✗ ${result.error}</div>`;
                        }
                    });
                }
                
                // 游戏场景执行动画移动
                if (isGameScenario && window.gameCanvas && movements.length > 0) {
                    window.gameCanvas.executeMovements(movements);
                }
                
                if (!isGameScenario && !isAlgorithmScenario && !isPhysicsScenario && !isDataStructureScenario && !isMathScenario && !isHashScenario && !isStrategyScenario && !isAIChatScenario) {
                    output.innerHTML = outputHtml;
                    this.showVisualization();
                }
                
                // 完成课程并获得XP
                this.completeLesson();
                
            } catch (error) {
                if (!isGameScenario && !isAlgorithmScenario && !isPhysicsScenario && !isDataStructureScenario && !isMathScenario && !isHashScenario && !isStrategyScenario && !isAIChatScenario) {
                    output.innerHTML = `<div class="error-message">❌ 执行错误: ${error.message}</div>`;
                }
            }
        } else {
            // 错误顺序
            if (!isGameScenario && !isAlgorithmScenario && !isPhysicsScenario && !isDataStructureScenario && !isMathScenario && !isHashScenario && !isStrategyScenario && !isAIChatScenario) {
                output.innerHTML = `
                    <div class="error-message">❌ 代码顺序错误！</div>
                    <div class="hint">正确顺序应该是: ${this.correctOrder.map(id => this.blocks[id].text).join(' → ')}</div>
                `;
            }
        }
    }

    async executeStrategySequence(results) {
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.success) {
                await this.executeStrategyAction(result.line);
                // 每个操作后等待0.5秒
                if (i < results.length - 1) {
                    await this.delay(500);
                }
            }
        }
    }

    async executeStrategyAction(codeLine) {
        if (!window.strategyVisualizer) return;
        
        if (codeLine.includes('define strategy')) {
            const match = codeLine.match(/define strategy "(.+)"/);
            if (match) {
                const name = match[1];
                await window.strategyVisualizer.defineStrategy(name);
            }
        } else if (codeLine.includes('set goal')) {
            const match = codeLine.match(/set goal "(.+)"/);
            if (match) {
                const goal = match[1];
                await window.strategyVisualizer.setGoal(goal);
            }
        } else if (codeLine.includes('build')) {
            const match = codeLine.match(/build (\w+) at \((\d+), (\d+)\)/);
            if (match) {
                const type = match[1];
                const x = parseInt(match[2]);
                const y = parseInt(match[3]);
                await window.strategyVisualizer.buildStructure(type, x, y);
            }
        } else if (codeLine.includes('train')) {
            const match = codeLine.match(/train (\w+) at \((\d+), (\d+)\)/);
            if (match) {
                const type = match[1];
                const x = parseInt(match[2]);
                const y = parseInt(match[3]);
                await window.strategyVisualizer.trainUnit(type, x, y);
            }
        } else if (codeLine.includes('execute strategy')) {
            await window.strategyVisualizer.executeStrategy();
        }
    }

    async executeHashSequence(results) {
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.success) {
                await this.executeHashAction(result.line);
                // 每个操作后等待0.5秒
                if (i < results.length - 1) {
                    await this.delay(500);
                }
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async executeHashAction(codeLine) {
        if (!window.hashVisualizer) return;
        
        if (codeLine.includes('function hash')) {
            await window.hashVisualizer.showDefineFunction();
        } else if (codeLine.includes('sum = 0')) {
            await window.hashVisualizer.showInitializeSum();
        } else if (codeLine.includes('for char in')) {
            await window.hashVisualizer.showStartLoop();
        } else if (codeLine.includes('sum += ascii')) {
            await window.hashVisualizer.showAddAscii();
        } else if (codeLine.includes('return sum %')) {
            await window.hashVisualizer.showReturnModulo();
        }
    }

    executeMathAction(codeLine) {
        if (!window.mathVisualizer) return;
        
        if (codeLine.includes('set range')) {
            const match = codeLine.match(/set range (-?\d+) to (-?\d+)/);
            if (match) {
                const min = parseInt(match[1]);
                const max = parseInt(match[2]);
                window.mathVisualizer.setRange(min, max);
            }
        } else if (codeLine.includes('plot ')) {
            const match = codeLine.match(/plot (.+)/);
            if (match) {
                const func = match[1];
                window.mathVisualizer.plotFunction(func);
            }
        } else if (codeLine.includes('draw circle at')) {
            const match = codeLine.match(/draw circle at \((\d+), (\d+)\) radius (\d+)/);
            if (match) {
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                const radius = parseInt(match[3]);
                window.mathVisualizer.drawCircle(x, y, radius);
            }
        } else if (codeLine.includes('calculate ')) {
            const match = codeLine.match(/calculate (.+)/);
            if (match) {
                const expression = match[1];
                window.mathVisualizer.calculate(expression);
            }
        } else if (codeLine.includes('add point at')) {
            const match = codeLine.match(/add point at \((-?\d+), (-?\d+)\)/);
            if (match) {
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                window.mathVisualizer.addPoint(x, y);
            }
        }
    }

    executeDataStructureAction(codeLine) {
        if (!window.datastructureVisualizer) return;
        
        if (codeLine.includes('stack.push(')) {
            const match = codeLine.match(/stack\.push\((.+)\)/);
            if (match) {
                const value = match[1].replace(/['"]/g, '');
                window.datastructureVisualizer.pushStack(value);
            }
        } else if (codeLine.includes('stack.pop()')) {
            window.datastructureVisualizer.popStack();
        } else if (codeLine.includes('queue.enqueue(')) {
            const match = codeLine.match(/queue\.enqueue\((.+)\)/);
            if (match) {
                const value = match[1].replace(/['"]/g, '');
                window.datastructureVisualizer.enqueue(value);
            }
        } else if (codeLine.includes('queue.dequeue()')) {
            window.datastructureVisualizer.dequeue();
        } else if (codeLine.includes('tree.insert(')) {
            const match = codeLine.match(/tree\.insert\((.+)\)/);
            if (match) {
                const value = parseInt(match[1]);
                window.datastructureVisualizer.insertTree(value);
            }
        } else if (codeLine.includes('heap.insert(')) {
            const match = codeLine.match(/heap\.insert\((.+)\)/);
            if (match) {
                const value = parseInt(match[1]);
                window.datastructureVisualizer.insertHeap(value);
            }
        } else if (codeLine.includes('graph.addNode(')) {
            const match = codeLine.match(/graph\.addNode\((.+)\)/);
            if (match) {
                const value = match[1].replace(/['"]/g, '');
                window.datastructureVisualizer.addGraphNode(value);
            }
        } else if (codeLine.includes('graph.addEdge(')) {
            const match = codeLine.match(/graph\.addEdge\((.+),\s*(.+)\)/);
            if (match) {
                const from = match[1].replace(/['"]/g, '');
                const to = match[2].replace(/['"]/g, '');
                window.datastructureVisualizer.addGraphEdge(from, to);
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

    async executeAIChatSequence(results) {
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.success) {
                await this.executeAIChatAction(result.line);
                // 每个操作后等待0.5秒
                if (i < results.length - 1) {
                    await this.delay(500);
                }
            }
        }
    }

    async executeAIChatAction(codeLine) {
        if (!window.aiChatVisualizer) return;
        
        if (codeLine.includes('set thinking mode')) {
            const match = codeLine.match(/set thinking mode "(.+)"/);
            if (match) {
                const mode = match[1];
                const modeMap = { '头脑风暴': 'brainstorm', '深度分析': 'analyze', '精细优化': 'refine' };
                window.aiChatVisualizer.setThinkingMode(modeMap[mode] || mode);
            }
        } else if (codeLine.includes('ask ')) {
            const match = codeLine.match(/ask "(.+)"/);
            if (match) {
                const prompt = match[1];
                await window.aiChatVisualizer.sendPrompt(prompt);
            }
        } else if (codeLine.includes('refine prompt')) {
            window.aiChatVisualizer.updateStatus('正在优化提示词...');
            await window.aiChatVisualizer.delay(500);
        } else if (codeLine.includes('analyze response')) {
            window.aiChatVisualizer.updateStatus('分析AI回复质量...');
            await window.aiChatVisualizer.delay(500);
        }
    }
}

// 全局变量
let dragEditor = null;
