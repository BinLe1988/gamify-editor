// 学习进度和XP系统
class ProgressSystem {
    constructor() {
        this.loadProgress();
        this.initializeCourses();
    }

    initializeCourses() {
        this.courses = {
            programming: {
                name: '编程入门',
                icon: '💻',
                lessons: [
                    { id: 'basic_output', name: '基础输出', xp: 10 },
                    { id: 'variables', name: '变量赋值', xp: 15 },
                    { id: 'conditions', name: '条件判断', xp: 20 },
                    { id: 'loops', name: '循环结构', xp: 25 }
                ]
            },
            algorithm: {
                name: '算法可视化',
                icon: '🧩',
                lessons: [
                    { id: 'array_basics', name: '数组基础', xp: 15 },
                    { id: 'sorting', name: '排序算法', xp: 25 },
                    { id: 'searching', name: '搜索算法', xp: 20 },
                    { id: 'complexity', name: '复杂度分析', xp: 30 }
                ]
            },
            datastructure: {
                name: '数据结构',
                icon: '🏗️',
                lessons: [
                    { id: 'stack_ops', name: '栈操作', xp: 20 },
                    { id: 'queue_ops', name: '队列操作', xp: 20 },
                    { id: 'tree_basics', name: '树结构', xp: 30 },
                    { id: 'graph_intro', name: '图论入门', xp: 35 }
                ]
            },
            math: {
                name: '数学建模',
                icon: '📊',
                lessons: [
                    { id: 'functions', name: '函数绘制', xp: 15 },
                    { id: 'geometry', name: '几何图形', xp: 20 },
                    { id: 'calculations', name: '数学计算', xp: 25 },
                    { id: 'modeling', name: '数学建模', xp: 30 }
                ]
            },
            physics: {
                name: '物理仿真',
                icon: '⚡',
                lessons: [
                    { id: 'gravity', name: '重力模拟', xp: 25 },
                    { id: 'forces', name: '力学分析', xp: 30 },
                    { id: 'collisions', name: '碰撞检测', xp: 35 },
                    { id: 'particles', name: '粒子系统', xp: 40 }
                ]
            },
            game: {
                name: '游戏开发',
                icon: '🎯',
                lessons: [
                    { id: 'player_control', name: '角色控制', xp: 20 },
                    { id: 'scoring', name: '得分系统', xp: 25 },
                    { id: 'entities', name: '实体管理', xp: 30 },
                    { id: 'game_loop', name: '游戏循环', xp: 35 }
                ]
            }
        };
    }

    loadProgress() {
        const saved = localStorage.getItem('gamify_progress');
        this.progress = saved ? JSON.parse(saved) : {
            totalXP: 0,
            level: 1,
            completedLessons: {},
            stars: 0,
            completedCourses: []
        };
    }

    saveProgress() {
        localStorage.setItem('gamify_progress', JSON.stringify(this.progress));
    }

    completeLesson(courseId, lessonId) {
        const course = this.courses[courseId];
        const lesson = course?.lessons.find(l => l.id === lessonId);
        
        if (!lesson) return null;

        const lessonKey = `${courseId}_${lessonId}`;
        
        // 如果已完成，不重复奖励
        if (this.progress.completedLessons[lessonKey]) {
            return { alreadyCompleted: true };
        }

        // 标记完成并获得XP
        this.progress.completedLessons[lessonKey] = true;
        this.progress.totalXP += lesson.xp;
        
        // 检查等级提升
        const newLevel = Math.floor(this.progress.totalXP / 100) + 1;
        const levelUp = newLevel > this.progress.level;
        this.progress.level = newLevel;

        // 检查课程完成
        const courseCompleted = this.checkCourseCompletion(courseId);
        if (courseCompleted && !this.progress.completedCourses.includes(courseId)) {
            this.progress.completedCourses.push(courseId);
            this.progress.stars++;
        }

        this.saveProgress();

        return {
            xpGained: lesson.xp,
            totalXP: this.progress.totalXP,
            level: this.progress.level,
            levelUp,
            courseCompleted,
            stars: this.progress.stars
        };
    }

    checkCourseCompletion(courseId) {
        const course = this.courses[courseId];
        if (!course) return false;

        return course.lessons.every(lesson => 
            this.progress.completedLessons[`${courseId}_${lesson.id}`]
        );
    }

    getCourseProgress(courseId) {
        const course = this.courses[courseId];
        if (!course) return { completed: 0, total: 0, percentage: 0 };

        const completed = course.lessons.filter(lesson => 
            this.progress.completedLessons[`${courseId}_${lesson.id}`]
        ).length;

        return {
            completed,
            total: course.lessons.length,
            percentage: Math.round((completed / course.lessons.length) * 100)
        };
    }

    renderProgressBar() {
        const currentLevelXP = (this.progress.level - 1) * 100;
        const nextLevelXP = this.progress.level * 100;
        const progressInLevel = this.progress.totalXP - currentLevelXP;
        const progressPercentage = (progressInLevel / 100) * 100;

        return `
            <div class="progress-header">
                <div class="player-info">
                    <span class="level">Lv.${this.progress.level}</span>
                    <span class="xp">${this.progress.totalXP} XP</span>
                    <span class="stars">⭐ ${this.progress.stars}</span>
                </div>
                <div class="xp-bar">
                    <div class="xp-fill" style="width: ${progressPercentage}%"></div>
                    <span class="xp-text">${progressInLevel}/100 XP</span>
                </div>
            </div>
        `;
    }

    renderCourseProgress() {
        return Object.entries(this.courses).map(([courseId, course]) => {
            const progress = this.getCourseProgress(courseId);
            const isCompleted = this.progress.completedCourses.includes(courseId);
            
            return `
                <div class="course-progress ${isCompleted ? 'completed' : ''}">
                    <div class="course-header">
                        <span class="course-icon">${course.icon}</span>
                        <span class="course-name">${course.name}</span>
                        ${isCompleted ? '<span class="course-star">⭐</span>' : ''}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        <span class="progress-text">${progress.completed}/${progress.total}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    showReward(reward) {
        const rewardDiv = document.createElement('div');
        rewardDiv.className = 'reward-popup';
        rewardDiv.innerHTML = `
            <div class="reward-content">
                <div class="reward-icon">🎉</div>
                <div class="reward-text">
                    <div class="xp-reward">+${reward.xpGained} XP</div>
                    ${reward.levelUp ? `<div class="level-up">等级提升！Lv.${reward.level}</div>` : ''}
                    ${reward.courseCompleted ? `<div class="course-complete">课程完成！获得 ⭐</div>` : ''}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-reward">继续</button>
            </div>
        `;
        
        document.body.appendChild(rewardDiv);
        
        // 自动关闭
        setTimeout(() => {
            if (rewardDiv.parentElement) {
                rewardDiv.remove();
            }
        }, 5000);
    }

    getCurrentLesson(scenario) {
        // 根据当前场景返回对应的课程ID
        const lessonMap = {
            'programming': 'basic_output',
            'algorithm': 'array_basics', 
            'datastructure': 'stack_ops',
            'math': 'functions',
            'physics': 'gravity',
            'game': 'player_control'
        };
        
        return lessonMap[scenario] || 'basic_output';
    }
}

// 全局进度系统实例
let progressSystem = new ProgressSystem();
