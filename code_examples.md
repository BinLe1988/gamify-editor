# 代码解析系统使用示例

## 概述
这个系统能够分析Python代码的意图，并直接修改游戏状态，而不需要实际执行Python代码。

## 支持的操作类型

### 1. 资源操作
```python
# 增加木材
wood + 50
wood = wood + 100

# 增加石头
stone + 30
stone = 200

# 增加食物
food + 75

# 增加金属
metal + 25
```

### 2. 殖民者操作
```python
# 移动殖民者到指定位置
move colonist to (5, 3)
移动 殖民者 到 (7, 8)

# 治疗殖民者
heal colonist
治疗 殖民者

# 复活倒地的殖民者
revive colonist
复活 殖民者
```

### 3. 建筑操作
```python
# 建造墙壁
build wall at (3, 4)
建造 墙 在 (5, 6)

# 建造房屋
build house at (2, 2)
建造 房屋 在 (8, 9)

# 建造床铺
build bed at (4, 5)

# 拆除建筑
demolish at (3, 4)
拆除 在 (5, 6)
```

### 4. 游戏控制
```python
# 启动自动模式
auto on
自动 开始

# 停止自动模式
auto off
自动 停止

# 暂停游戏
pause
暂停

# 恢复游戏
resume
继续
```

### 5. 环境控制
```python
# 改变天气
weather = "sunny"
weather = "rainy"
天气 = "晴天"

# 改变温度
temperature = 25

# 触发灾害
disaster flood
disaster earthquake
灾害 洪水
灾害 地震
```

## 使用方法

1. 在Python编辑器中输入上述任意代码
2. 点击"运行代码"按钮
3. 系统会分析代码意图并直接修改游戏状态
4. 查看执行结果和游戏变化

## 示例代码组合

### 基础资源管理
```python
# 收集资源
wood + 100
stone + 50
food + 200

# 建造基础设施
build wall at (1, 1)
build house at (3, 3)
build bed at (4, 4)
```

### 殖民者管理
```python
# 移动和治疗
move colonist to (5, 5)
heal colonist

# 启动自动工作
auto on
```

### 应急响应
```python
# 灾害来临时的应对
revive colonist
heal colonist
build wall at (2, 2)
food + 100
```

### 环境控制
```python
# 改变游戏环境
weather = "sunny"
temperature = 20
disaster earthquake
```

## 注意事项

1. 代码解析器支持中英文混合输入
2. 坐标必须在有效范围内 (0-11)
3. 建造建筑需要足够的资源
4. 某些操作需要选中殖民者才能执行
5. 系统会显示每个操作的执行结果

## 教学应用

这个系统特别适合：
- 让学生通过编写"伪代码"来理解编程逻辑
- 在没有Python环境的情况下体验编程思维
- 将抽象的编程概念与具体的游戏操作结合
- 培养学生的问题分析和解决能力
