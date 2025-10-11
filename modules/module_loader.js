// 模块加载器
class ModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.moduleQueue = [];
    }

    // 加载单个模块
    async loadModule(modulePath) {
        if (this.loadedModules.has(modulePath)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = modulePath;
            script.onload = () => {
                this.loadedModules.add(modulePath);
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load module: ${modulePath}`));
            document.head.appendChild(script);
        });
    }

    // 批量加载模块
    async loadModules(modulePaths) {
        const loadPromises = modulePaths.map(path => this.loadModule(path));
        return Promise.all(loadPromises);
    }

    // 加载核心模块
    async loadCoreModules() {
        const coreModules = [
            'modules/base_visualizer.js',
            'modules/scenario_manager.js',
            'modules/drag_editor_core.js',
            'modules/scenario_extension.js'
        ];
        
        return this.loadModules(coreModules);
    }

    // 加载场景模块
    async loadScenarioModules() {
        const scenarioModules = [
            'gamify_editor.js',
            'game_canvas.js',
            'algorithm_visualizer.js',
            'datastructure_visualizer.js',
            'math_visualizer.js',
            'physics_simulator.js',
            'progress_system.js'
        ];
        
        return this.loadModules(scenarioModules);
    }

    // 加载扩展模块
    async loadExtensionModules(extensionPaths) {
        return this.loadModules(extensionPaths);
    }

    // 检查模块是否已加载
    isModuleLoaded(modulePath) {
        return this.loadedModules.has(modulePath);
    }

    // 获取已加载的模块列表
    getLoadedModules() {
        return Array.from(this.loadedModules);
    }
}

// 全局模块加载器实例
window.moduleLoader = new ModuleLoader();
