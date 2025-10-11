// 主应用程序模块
class GamifyEditorApp {
    constructor() {
        this.scenarioManager = null;
        this.currentEditor = null;
        this.gameState = {};
        this.currentScenario = '';
        this.isDragMode = false;
    }

    // 初始化应用程序
    async initialize() {
        try {
            // 加载核心模块
            await window.moduleLoader.loadCoreModules();
            
            // 初始化场景管理器
            this.scenarioManager = new ScenarioManager();
            
            // 加载场景模块
            await window.moduleLoader.loadScenarioModules();
            
            // 初始化进度系统
            if (typeof ProgressSystem !== 'undefined') {
                window.progressSystem = new ProgressSystem();
            }
            
            console.log('游戏化编辑器初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 打开场景
    openScenario(scenarioId) {
        this.currentScenario = scenarioId;
        this.gameState = this.initializeGameState(scenarioId);
        
        // 创建代码解释器
        this.currentInterpreter = new CodeInterpreter(this.gameState, scenarioId);
        
        // 显示编辑器
        this.showEditor(scenarioId);
    }

    // 初始化游戏状态
    initializeGameState(scenario) {
        const baseState = {
            scenario: scenario,
            draw: () => console.log('Drawing...'),
            updateUI: () => console.log('Updating UI...')
        };

        const stateConfigs = {
            programming: { output: [], variables: {} },
            algorithm: { 
                arrays: {}, 
                visualize: (type, data) => console.log(`Visualizing ${type}:`, data) 
            },
            datastructure: { 
                stack: [], queue: [], tree: { nodes: [] },
                visualizeStack: () => console.log('Stack updated'),
                visualizeQueue: () => console.log('Queue updated'),
                visualizeTree: () => console.log('Tree updated')
            },
            math: { 
                shapes: [], mathSettings: {},
                plotFunction: (func) => console.log('Plotting:', func)
            },
            physics: { 
                objects: [], physics: {},
                startPhysics: () => console.log('Starting physics')
            },
            game: { player: null, entities: {}, score: 0 }
        };

        return { ...baseState, ...(stateConfigs[scenario] || {}) };
    }

    // 显示编辑器
    showEditor(scenario) {
        const scenarioConfig = this.scenarioManager.getScenario(scenario);
        
        document.body.innerHTML = `
            <link rel="stylesheet" href="drag_blocks.css">
            <link rel="stylesheet" href="progress_system.css">
            <div style="padding: 20px; max-width: 1400px; margin: 0 auto;">
                ${window.progressSystem ? window.progressSystem.renderProgressBar() : ''}
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1>🎮 ${scenarioConfig.name} - 编辑器</h1>
                    <div>
                        <button onclick="app.toggleMode()" id="modeBtn" style="padding: 10px 20px; background: #764ba2; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">切换到拖拽模式</button>
                        <button onclick="app.goBack()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">返回首页</button>
                    </div>
                </div>
                
                <div id="textEditor" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 70vh;">
                    <div>
                        <h3>代码编辑器</h3>
                        <textarea id="codeEditor" style="width: 100%; height: 80%; font-family: monospace; padding: 10px; border: 1px solid #ccc; border-radius: 5px;" placeholder="${this.getPlaceholder(scenario)}"></textarea>
                        <button onclick="app.runCode()" style="margin-top: 10px; padding: 10px 20px; background: #48bb78; color: white; border: none; border-radius: 5px; cursor: pointer;">运行代码</button>
                    </div>
                    
                    <div>
                        <h3>执行结果</h3>
                        <div id="output" style="width: 100%; height: 80%; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background: #f8f9fa; overflow-y: auto; font-family: monospace;"></div>
                    </div>
                </div>
                
                <div id="dragEditor" style="display: none;">
                    <!-- 拖拽编辑器将在这里动态生成 -->
                </div>
                
                <div style="margin-top: 20px;">
                    <h3>游戏状态</h3>
                    <div id="gameState" style="padding: 10px; background: #e2e8f0; border-radius: 5px; font-family: monospace;"></div>
                </div>
            </div>
        `;
        
        this.updateGameStateDisplay();
    }

    // 切换编辑模式
    toggleMode() {
        this.isDragMode = !this.isDragMode;
        const textEditor = document.getElementById('textEditor');
        const dragEditorDiv = document.getElementById('dragEditor');
        const modeBtn = document.getElementById('modeBtn');
        
        if (this.isDragMode) {
            textEditor.style.display = 'none';
            dragEditorDiv.style.display = 'block';
            modeBtn.textContent = '切换到文本模式';
            
            // 创建拖拽编辑器
            this.currentEditor = new DragEditorCore(this.currentScenario, this.gameState, this.scenarioManager);
            dragEditorDiv.innerHTML = this.currentEditor.render();
            this.currentEditor.initializeDragAndDrop();
            
        } else {
            textEditor.style.display = 'grid';
            dragEditorDiv.style.display = 'none';
            modeBtn.textContent = '切换到拖拽模式';
        }
    }

    // 运行代码
    runCode() {
        const code = document.getElementById('codeEditor').value;
        const outputDiv = document.getElementById('output');
        
        if (!this.currentInterpreter) {
            outputDiv.innerHTML = '<div style="color: red;">错误: 解释器未初始化</div>';
            return;
        }
        
        try {
            const results = this.currentInterpreter.interpretCode(code);
            
            let output = '';
            let hasSuccess = false;
            results.forEach(result => {
                if (result.success) {
                    output += `<div style="color: green;">✓ ${result.line} → ${result.action}</div>`;
                    hasSuccess = true;
                } else {
                    output += `<div style="color: red;">✗ ${result.line} → ${result.error}</div>`;
                }
            });
            
            outputDiv.innerHTML = output;
            
            if (hasSuccess && window.progressSystem) {
                const lessonId = window.progressSystem.getCurrentLesson(this.currentScenario);
                const reward = window.progressSystem.completeLesson(this.currentScenario, lessonId);
                
                if (reward && !reward.alreadyCompleted) {
                    window.progressSystem.showReward(reward);
                    this.updateProgressHeader();
                }
            }
            
            this.updateGameStateDisplay();
            
        } catch (error) {
            outputDiv.innerHTML = `<div style="color: red;">执行错误: ${error.message}</div>`;
        }
    }

    // 显示进度概览
    showProgressOverview() {
        const progressDiv = document.getElementById('progressOverview');
        if (progressDiv && window.progressSystem) {
            progressDiv.innerHTML = window.progressSystem.renderProgressBar() + 
                '<div style="margin-top: 20px;">' + window.progressSystem.renderCourseProgress() + '</div>';
        }
    }

    // 更新进度头部
    updateProgressHeader() {
        const progressHeader = document.querySelector('.progress-header');
        if (progressHeader && window.progressSystem) {
            progressHeader.outerHTML = window.progressSystem.renderProgressBar();
        }
    }

    // 更新游戏状态显示
    updateGameStateDisplay() {
        const stateDiv = document.getElementById('gameState');
        if (stateDiv && this.gameState) {
            const displayState = { ...this.gameState };
            Object.keys(displayState).forEach(key => {
                if (typeof displayState[key] === 'function') {
                    delete displayState[key];
                }
            });
            stateDiv.innerHTML = `<pre>${JSON.stringify(displayState, null, 2)}</pre>`;
        }
    }

    // 获取占位符文本
    getPlaceholder(scenario) {
        const placeholders = {
            programming: 'print("Hello World")\nx = 10\nif x > 5:\n    print("x is greater than 5")',
            algorithm: 'array nums = [3, 1, 4, 1, 5]\nsort nums\nsearch nums for 4',
            datastructure: 'stack.push(10)\nstack.push(20)\nstack.pop()\nqueue.enqueue(5)',
            math: 'plot y = x^2\nset range -10 to 10\ndraw circle at (0, 0) radius 5',
            physics: 'create ball at (100, 50)\nset gravity 9.8\nstart simulation',
            game: 'create player at (50, 50)\nmove player right\nscore + 10'
        };
        return placeholders[scenario] || '# 在这里输入代码';
    }

    // 返回首页
    goBack() {
        location.reload();
    }

    // 获取场景名称
    getScenarioName(type) {
        const scenario = this.scenarioManager?.getScenario(type);
        return scenario ? scenario.name : '未知场景';
    }
}
