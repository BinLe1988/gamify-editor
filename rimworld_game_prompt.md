# RimWorld风格沙盒游戏制作提示词

## 基础架构（基于现有推箱子游戏）

### 1. 游戏核心系统
```javascript
class RimWorldGame extends MultiplayerSokobanGame {
    constructor() {
        super();
        this.colonists = [];
        this.resources = {wood: 100, stone: 50, food: 200, metal: 30};
        this.buildings = [];
        this.weather = 'sunny';
        this.temperature = 20;
        this.season = 'spring';
        this.dayTime = 0; // 0-24小时制
    }
}
```

### 2. 地图系统扩展
- 保留现有网格系统
- 添加地形类型：草地、岩石、树木、水源
- 添加资源点：矿物、植物、动物

### 3. 角色系统
```javascript
class Colonist {
    constructor(name, x, y) {
        this.name = name;
        this.x = x; this.y = y;
        this.skills = {mining: 1, construction: 1, cooking: 1, medical: 1};
        this.needs = {hunger: 100, rest: 100, mood: 100};
        this.task = null;
        this.inventory = [];
    }
}
```

### 4. 建筑系统
```javascript
const BUILDINGS = {
    wall: {cost: {wood: 2}, hp: 100, type: 'structure'},
    bed: {cost: {wood: 5}, hp: 50, type: 'furniture'},
    stove: {cost: {metal: 3, wood: 2}, hp: 75, type: 'production'},
    farm: {cost: {wood: 1}, hp: 25, type: 'agriculture'}
};
```

### 5. 任务系统
```javascript
class TaskManager {
    assignTask(colonist, taskType, target) {
        const tasks = {
            'mine': () => this.mineResource(colonist, target),
            'build': () => this.constructBuilding(colonist, target),
            'cook': () => this.cookFood(colonist),
            'haul': () => this.haulItems(colonist, target)
        };
        colonist.task = {type: taskType, target: target, action: tasks[taskType]};
    }
}
```

## 游戏机制设计

### 6. 时间与环境系统
- 昼夜循环：影响工作效率和心情
- 季节变化：影响农作物生长和温度
- 天气系统：雨天影响户外工作，极端天气带来挑战

### 7. 需求系统
- 饥饿：需要食物补充
- 疲劳：需要睡眠恢复
- 心情：受环境、事件影响

### 8. 生产链
```
原材料 → 加工 → 成品
树木 → 砍伐 → 木材 → 建造 → 建筑
矿石 → 开采 → 金属 → 制作 → 工具
```

### 9. 事件系统
```javascript
const EVENTS = {
    raid: {probability: 0.05, effect: 'spawn_enemies'},
    trade: {probability: 0.1, effect: 'merchant_visit'},
    weather: {probability: 0.2, effect: 'change_weather'},
    illness: {probability: 0.03, effect: 'colonist_sick'}
};
```

## 实现步骤

### 第一阶段：基础扩展
1. 修改现有地图系统，添加多种地形
2. 创建殖民者类，替换单一玩家
3. 实现基础资源收集（点击树木获得木材）
4. 添加简单建造系统（放置墙壁、床铺）

### 第二阶段：系统完善
1. 实现需求系统（饥饿、疲劳条）
2. 添加任务分配界面
3. 创建生产建筑（厨房、工作台）
4. 实现昼夜循环

### 第三阶段：深度玩法
1. 添加技能系统和经验值
2. 实现复杂生产链
3. 添加随机事件
4. 创建贸易系统

## 核心代码框架

### 游戏循环扩展
```javascript
gameLoop() {
    this.updateTime();
    this.updateColonists();
    this.updateBuildings();
    this.checkEvents();
    this.updateUI();
    this.draw();
}

updateColonists() {
    this.colonists.forEach(colonist => {
        if (colonist.task) {
            colonist.task.action();
        }
        this.updateNeeds(colonist);
        this.moveColonist(colonist);
    });
}
```

### UI界面设计
- 左侧：殖民者列表和状态
- 右侧：建筑菜单和资源显示
- 底部：任务队列和事件日志
- 中央：游戏地图（保留现有Canvas）

### 多人协作机制
- 每个玩家控制2-3个殖民者
- 共享资源池和建筑
- 实时同步殖民者行动
- 投票决定重大决策

## 特色功能

### 1. 教育元素
- 资源管理：学习经济学基础
- 任务规划：培养逻辑思维
- 团队协作：提升沟通能力

### 2. 简化设计
- 像素风格图形，降低美术要求
- 回合制或慢节奏，适合课堂环境
- 模块化系统，便于扩展和修改

### 3. 课堂应用
- 分组合作建设基地
- 角色扮演不同职业
- 讨论资源分配策略
- 应对危机的团队决策

这个设计保持了原有推箱子游戏的多人协作特性，同时引入了RimWorld的核心玩法元素，适合作为教育工具使用。

### 自定义优化

- 每当玩家接触到墙体的边缘，再往墙的方向走一步会进入下一个随机生成的地图，先生成四幅图，用于第一次生成图的上下左右四个方向的空间扩展
- 增加自动化任务系统，可以定义工作优先级，然后点击执行，殖民者会根据定义好的优先级自动在地图上采集和建造，点击停止执行，则退出自动化任务，由玩家接管控制
- 增加外敌入侵环节，游戏开始后每隔5分钟都会新增一波随机敌人入侵，会破坏玩家建造的房屋。
- 玩家有3个血量，被敌人攻击到空血倒地，另一位玩家通过长按倒地的玩家3秒能够将其救活并保持1个血，需要靠近湖泊才能慢慢恢复血量
- 增加洪水、地震等自然灾害，自然灾害来临，会减少木材，石头的产量，也会造成建筑被破坏
- 建造模式支持建造更多的元素，包括房屋、床铺、火把、储藏室、伐木屋、采石场
- 如果所有殖民者都倒地，则游戏结束
- 增加建筑拆除功能，长按2秒就会拆除建筑，花费多于1个单位的资源，回收一半（4舍5入），花费少于等于1个的资源回收不了
- 角色设定中可以分别为殖民者1和殖民者2选择展示的头像以及他们各自的属性
- 使用另一种思路：不对Python编辑器中的代码进行实际执行，而是读懂他要表达的含义，然后对游戏中的属性和行为进行改变