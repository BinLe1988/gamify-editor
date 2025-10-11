// 拖拽编辑器核心模块
class DragEditorCore {
    constructor(scenario, gameState, scenarioManager) {
        this.scenario = scenario;
        this.gameState = gameState;
        this.scenarioManager = scenarioManager;
        this.blocks = scenarioManager.getCodeBlocks(scenario);
        this.correctOrder = this.blocks.map((_, i) => i);
        this.currentOrder = [];
        this.interpreter = new CodeInterpreter(gameState, scenario);
    }

    render() {
        const scenarioConfig = this.scenarioManager.getScenario(this.scenario);
        const hasVisualizer = scenarioConfig.visualizer;
        
        return `
            <div class="drag-editor ${hasVisualizer ? this.scenario + '-mode' : ''}">
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
                
                ${hasVisualizer ? this.renderVisualizerPanel() : this.renderOutputPanel()}
            </div>
        `;
    }

    renderVisualizerPanel() {
        const scenarioConfig = this.scenarioManager.getScenario(this.scenario);
        const canvasId = this.scenario + 'Canvas';
        const statusId = this.scenario + 'Status';
        
        return `
            <div class="${this.scenario}-panel">
                <h3>${scenarioConfig.name}</h3>
                <div class="${this.scenario}-info">
                    <span id="${statusId}">准备就绪</span>
                    <button onclick="window.${this.scenario}Visualizer?.reset()" class="reset-btn">重置</button>
                </div>
                <canvas id="${canvasId}" class="${this.scenario}-canvas"></canvas>
                <div class="${this.scenario}-controls">
                    <div class="control-hint">💡 观察${scenarioConfig.name}的执行过程</div>
                </div>
            </div>
        `;
    }

    renderOutputPanel() {
        return `
            <div class="output-panel">
                <h3>执行结果</h3>
                <div id="dragOutput" class="output-content"></div>
            </div>
        `;
    }

    initializeDragAndDrop() {
        const blocksContainer = document.getElementById('blocksContainer');
        const dropArea = document.getElementById('dropArea');
        const executeBtn = document.getElementById('executeBtn');

        // 拖拽事件处理
        blocksContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('code-block')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                e.target.style.opacity = '0.5';
            }
        });

        blocksContainer.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('code-block')) {
                e.target.style.opacity = '1';
            }
        });

        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('drag-over');
        });

        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('drag-over');
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('drag-over');
            
            const blockId = parseInt(e.dataTransfer.getData('text/plain'));
            this.addBlockToDropArea(blockId);
        });

        executeBtn.addEventListener('click', () => {
            this.executeCode();
        });

        // 初始化可视化器
        this.initializeVisualizer();
    }

    initializeVisualizer() {
        const scenarioConfig = this.scenarioManager.getScenario(this.scenario);
        if (scenarioConfig.visualizer) {
            setTimeout(() => {
                const canvasId = this.scenario + 'Canvas';
                const VisualizerClass = window[scenarioConfig.visualizer];
                if (VisualizerClass) {
                    window[this.scenario + 'Visualizer'] = new VisualizerClass(canvasId);
                }
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

        document.getElementById('executeBtn').disabled = this.currentOrder.length === 0;
    }

    removeBlock(blockId) {
        const index = this.currentOrder.indexOf(blockId);
        if (index > -1) {
            this.currentOrder.splice(index, 1);
            
            const dropArea = document.getElementById('dropArea');
            const blockElement = dropArea.querySelector(`[data-id="${blockId}"]`);
            if (blockElement) blockElement.remove();

            dropArea.querySelectorAll('.dropped-block').forEach((el, i) => {
                el.querySelector('.block-order').textContent = i + 1;
            });

            if (this.currentOrder.length === 0) {
                dropArea.innerHTML = '<div class="drop-placeholder">将代码块拖拽到这里</div>';
                document.getElementById('executeBtn').disabled = true;
            }
        }
    }

    executeCode() {
        const scenarioConfig = this.scenarioManager.getScenario(this.scenario);
        const hasVisualizer = scenarioConfig.visualizer;
        
        if (this.checkOrder()) {
            const code = this.currentOrder.map(id => this.blocks.find(b => b.id === id).code).join('\n');
            
            try {
                const results = this.interpreter.interpretCode(code);
                
                if (hasVisualizer) {
                    this.executeVisualizerActions(results);
                } else {
                    this.displayResults(results);
                }
                
                this.completeLesson();
            } catch (error) {
                console.error('执行错误:', error);
            }
        }
    }

    executeVisualizerActions(results) {
        results.forEach(result => {
            if (result.success) {
                const visualizer = window[this.scenario + 'Visualizer'];
                if (visualizer) {
                    this.executeScenarioAction(result.line, visualizer);
                }
            }
        });
    }

    executeScenarioAction(codeLine, visualizer) {
        // 由具体场景实现类重写此方法
        console.log('执行场景动作:', codeLine);
    }

    displayResults(results) {
        const output = document.getElementById('dragOutput');
        let outputHtml = '<div class="success-message">✅ 代码顺序正确！执行成功</div>';
        
        results.forEach(result => {
            if (result.success) {
                outputHtml += `<div class="success-line">✓ ${result.action}</div>`;
            } else {
                outputHtml += `<div class="error-line">✗ ${result.error}</div>`;
            }
        });
        
        output.innerHTML = outputHtml;
    }

    checkOrder() {
        return this.currentOrder.length === this.correctOrder.length &&
               this.currentOrder.every((id, index) => id === this.correctOrder[index]);
    }

    completeLesson() {
        const lessonId = progressSystem.getCurrentLesson(this.scenario);
        const reward = progressSystem.completeLesson(this.scenario, lessonId);
        
        if (reward && !reward.alreadyCompleted) {
            progressSystem.showReward(reward);
            this.updateProgressDisplay();
        }
    }

    updateProgressDisplay() {
        const progressHeader = document.querySelector('.progress-header');
        if (progressHeader) {
            progressHeader.outerHTML = progressSystem.renderProgressBar();
        }
    }
}
