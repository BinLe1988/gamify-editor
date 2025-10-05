# 场景适配使用示例

## 🎯 各场景代码示例

### 1. 编程入门场景
```python
# 基础输出
print("Hello World")
print("学习编程很有趣")

# 变量赋值
name = "小明"
age = 18
score = 95

# 条件判断
if score > 90:
    print("优秀")

# 循环结构
for i in range(5):
    print("循环第" + str(i) + "次")
```

### 2. 算法可视化场景
```python
# 创建数组
array nums = [64, 34, 25, 12, 22, 11, 90]
array sorted = [1, 2, 3, 4, 5]

# 排序算法
sort nums

# 搜索算法
search nums for 25
search sorted for 3

# 单步执行
step
```

### 3. 数据结构场景
```python
# 栈操作
stack.push(10)
stack.push(20)
stack.push(30)
stack.pop()

# 队列操作
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)
queue.dequeue()

# 树操作
tree.insert(50)
tree.insert(30)
tree.insert(70)
```

### 4. 数学建模场景
```python
# 函数绘制
plot y = x^2
plot y = sin(x)
plot y = 2*x + 1

# 设置范围
set range -10 to 10
set range 0 to 100

# 几何图形
draw circle at (0, 0) radius 5
draw circle at (10, 10) radius 3

# 数学计算
calculate 2 + 3 * 4
calculate (5 + 3) * 2
```

### 5. 物理仿真场景
```python
# 创建物体
create ball at (100, 50)
create ball at (200, 100)

# 设置物理参数
set gravity 9.8
set gravity 5

# 施加力
apply force 10 to ball1
apply force 15 to ball2

# 开始仿真
start simulation
```

### 6. 游戏开发场景
```python
# 创建玩家
create player at (50, 50)

# 角色移动
move player up
move player right
move player down
move player left

# 得分系统
score + 10
score + 25

# 生成实体
spawn enemy at (100, 100)
spawn coin at (75, 25)
spawn powerup at (150, 75)
```

## 🔧 技术实现特点

### 场景切换机制
- 每个场景有独立的解析模式
- 自动初始化对应的游戏状态
- 提供场景特定的占位符代码

### 状态管理
- 实时显示游戏状态变化
- 支持复杂数据结构可视化
- 提供调试信息输出

### 错误处理
- 场景特定的错误提示
- 详细的执行结果反馈
- 友好的用户界面

### 扩展性设计
- 模块化的场景管理
- 易于添加新场景类型
- 灵活的状态初始化机制

## 🎮 使用流程

1. **选择场景**: 在首页点击对应的场景卡片
2. **编写代码**: 在代码编辑器中输入指令
3. **运行代码**: 点击"运行代码"按钮执行
4. **查看结果**: 在右侧面板查看执行结果
5. **观察状态**: 在底部查看游戏状态变化

## 📈 教育价值

### 渐进式学习
- 从简单的print语句开始
- 逐步引入复杂概念
- 每个场景专注特定知识点

### 可视化反馈
- 立即看到代码执行效果
- 直观理解抽象概念
- 增强学习动机

### 实践导向
- 通过实际操作学习
- 培养编程思维
- 建立代码与结果的联系
