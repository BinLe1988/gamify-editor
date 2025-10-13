// AI聊天可视化组件
class AIChatVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 450;
        this.canvas.height = 350;
        
        this.chatHistory = [];
        this.currentPrompt = '';
        this.promptQuality = { clarity: 0, specificity: 0, context: 0 };
        this.suggestions = [];
        this.thinkingMode = 'brainstorm'; // brainstorm, analyze, refine
        
        this.draw();
    }

    async sendPrompt(prompt) {
        this.currentPrompt = prompt;
        this.updateStatus(`分析提示词: "${prompt}"`);
        
        // 分析prompt质量
        await this.analyzePrompt(prompt);
        
        // 生成AI回复
        await this.generateResponse(prompt);
        
        // 提供改进建议
        await this.provideSuggestions();
        
        this.draw();
    }

    async analyzePrompt(prompt) {
        await this.delay(500);
        
        // 简单的prompt质量评估
        this.promptQuality = {
            clarity: this.assessClarity(prompt),
            specificity: this.assessSpecificity(prompt),
            context: this.assessContext(prompt)
        };
        
        this.updateStatus('正在分析提示词质量...');
        this.draw();
        await this.delay(500);
    }

    async generateResponse(prompt) {
        this.updateStatus('AI正在思考...');
        await this.delay(1000);
        
        // 模拟AI回复
        const response = this.simulateAIResponse(prompt);
        
        this.chatHistory.push({
            type: 'user',
            content: prompt,
            timestamp: new Date().toLocaleTimeString()
        });
        
        this.chatHistory.push({
            type: 'ai',
            content: response,
            timestamp: new Date().toLocaleTimeString()
        });
        
        this.updateStatus('AI回复完成');
        this.draw();
    }

    async provideSuggestions() {
        await this.delay(500);
        
        this.suggestions = this.generateSuggestions();
        this.updateStatus('生成改进建议');
        this.draw();
    }

    assessClarity(prompt) {
        let score = 50;
        
        // 检查问号
        if (prompt.includes('?') || prompt.includes('？')) score += 20;
        
        // 检查长度
        if (prompt.length > 10 && prompt.length < 100) score += 15;
        
        // 检查模糊词汇
        const vagueWords = ['什么', '怎么', '好的', '最好'];
        const hasVague = vagueWords.some(word => prompt.includes(word));
        if (!hasVague) score += 15;
        
        return Math.min(100, score);
    }

    assessSpecificity(prompt) {
        let score = 30;
        
        // 检查具体数字
        if (/\d+/.test(prompt)) score += 20;
        
        // 检查具体领域词汇
        const specificWords = ['算法', '数据结构', '机器学习', '前端', '后端', '设计'];
        const hasSpecific = specificWords.some(word => prompt.includes(word));
        if (hasSpecific) score += 25;
        
        // 检查动作词
        const actionWords = ['创建', '分析', '优化', '实现', '设计'];
        const hasAction = actionWords.some(word => prompt.includes(word));
        if (hasAction) score += 25;
        
        return Math.min(100, score);
    }

    assessContext(prompt) {
        let score = 40;
        
        // 检查背景信息
        if (prompt.length > 50) score += 20;
        
        // 检查约束条件
        const constraints = ['要求', '限制', '条件', '规则'];
        const hasConstraints = constraints.some(word => prompt.includes(word));
        if (hasConstraints) score += 20;
        
        // 检查目标描述
        const goals = ['目标', '希望', '需要', '想要'];
        const hasGoals = goals.some(word => prompt.includes(word));
        if (hasGoals) score += 20;
        
        return Math.min(100, score);
    }

    simulateAIResponse(prompt) {
        const responses = {
            'low': [
                '我需要更多信息来帮助您。能否提供更具体的背景？',
                '您的问题比较宽泛，能否缩小范围？',
                '请提供更多细节，这样我能给出更准确的建议。'
            ],
            'medium': [
                '基于您的问题，我建议从以下几个方面考虑...',
                '这是一个很好的问题。让我们分步骤来解决...',
                '我理解您的需求，这里有几个可行的方案...'
            ],
            'high': [
                '您的问题很清晰！基于您提供的具体信息...',
                '完美的提问！让我为您提供详细的解决方案...',
                '您的描述很准确，我可以给出针对性的建议...'
            ]
        };
        
        const avgQuality = (this.promptQuality.clarity + this.promptQuality.specificity + this.promptQuality.context) / 3;
        
        let level = 'low';
        if (avgQuality > 70) level = 'high';
        else if (avgQuality > 40) level = 'medium';
        
        const responseList = responses[level];
        return responseList[Math.floor(Math.random() * responseList.length)];
    }

    generateSuggestions() {
        const suggestions = [];
        
        if (this.promptQuality.clarity < 70) {
            suggestions.push('💡 提高清晰度: 使用更明确的问句，避免模糊表达');
        }
        
        if (this.promptQuality.specificity < 70) {
            suggestions.push('🎯 增加具体性: 提供具体的数字、领域或技术栈');
        }
        
        if (this.promptQuality.context < 70) {
            suggestions.push('📝 补充背景: 说明使用场景、约束条件和期望目标');
        }
        
        // 通用建议
        suggestions.push('🤔 思考角度: 尝试从不同角度重新表述问题');
        
        return suggestions;
    }

    setThinkingMode(mode) {
        this.thinkingMode = mode;
        this.updateStatus(`切换到${mode}模式`);
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawTitle();
        this.drawChatArea();
        this.drawQualityMetrics();
        this.drawSuggestions();
        this.drawThinkingMode();
    }

    drawTitle() {
        this.ctx.fillStyle = '#2d3748';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('AI Thinking Partner', 10, 20);
    }

    drawChatArea() {
        const startX = 10;
        const startY = 30;
        const width = 280;
        const height = 180;
        
        // 聊天框背景
        this.ctx.fillStyle = '#f7fafc';
        this.ctx.fillRect(startX, startY, width, height);
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.strokeRect(startX, startY, width, height);
        
        // 绘制聊天记录
        let y = startY + 15;
        const maxMessages = 6;
        const recentMessages = this.chatHistory.slice(-maxMessages);
        
        recentMessages.forEach(message => {
            if (y > startY + height - 20) return;
            
            // 消息气泡
            const isUser = message.type === 'user';
            const bubbleX = isUser ? startX + 50 : startX + 10;
            const bubbleWidth = width - 70;
            const bubbleHeight = 25;
            
            this.ctx.fillStyle = isUser ? '#667eea' : '#48bb78';
            this.ctx.fillRect(bubbleX, y, bubbleWidth, bubbleHeight);
            
            // 消息文本
            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'left';
            
            const maxLength = 35;
            const text = message.content.length > maxLength ? 
                message.content.substring(0, maxLength) + '...' : message.content;
            
            this.ctx.fillText(text, bubbleX + 5, y + 15);
            
            y += 30;
        });
        
        // 如果没有消息，显示提示
        if (this.chatHistory.length === 0) {
            this.ctx.fillStyle = '#a0aec0';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('开始与AI对话...', startX + width/2, startY + height/2);
        }
    }

    drawQualityMetrics() {
        const startX = 300;
        const startY = 40;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('提示词质量', startX, startY);
        
        const metrics = [
            { name: '清晰度', value: this.promptQuality.clarity, color: '#3182ce' },
            { name: '具体性', value: this.promptQuality.specificity, color: '#38a169' },
            { name: '背景性', value: this.promptQuality.context, color: '#d69e2e' }
        ];
        
        metrics.forEach((metric, index) => {
            const y = startY + 20 + index * 25;
            const barWidth = 100;
            const barHeight = 12;
            
            // 背景条
            this.ctx.fillStyle = '#e2e8f0';
            this.ctx.fillRect(startX, y, barWidth, barHeight);
            
            // 进度条
            this.ctx.fillStyle = metric.color;
            this.ctx.fillRect(startX, y, (metric.value / 100) * barWidth, barHeight);
            
            // 标签和数值
            this.ctx.fillStyle = '#4a5568';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(metric.name, startX + barWidth + 5, y + 9);
            this.ctx.fillText(`${metric.value}%`, startX + barWidth + 50, y + 9);
        });
    }

    drawSuggestions() {
        const startX = 10;
        const startY = 220;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('改进建议', startX, startY);
        
        this.suggestions.forEach((suggestion, index) => {
            const y = startY + 20 + index * 15;
            
            this.ctx.fillStyle = '#667eea';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(suggestion, startX, y);
        });
    }

    drawThinkingMode() {
        const startX = 300;
        const startY = 150;
        
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('思维模式', startX, startY);
        
        const modes = ['brainstorm', 'analyze', 'refine'];
        const modeNames = ['头脑风暴', '深度分析', '精细优化'];
        
        modes.forEach((mode, index) => {
            const y = startY + 20 + index * 20;
            const isActive = mode === this.thinkingMode;
            
            // 模式按钮
            this.ctx.fillStyle = isActive ? '#48bb78' : '#e2e8f0';
            this.ctx.fillRect(startX, y, 80, 15);
            
            // 模式文本
            this.ctx.fillStyle = isActive ? 'white' : '#4a5568';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(modeNames[index], startX + 40, y + 10);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStatus(message) {
        const statusElement = document.getElementById('aiChatStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    reset() {
        this.chatHistory = [];
        this.currentPrompt = '';
        this.promptQuality = { clarity: 0, specificity: 0, context: 0 };
        this.suggestions = [];
        this.thinkingMode = 'brainstorm';
        this.draw();
        this.updateStatus('AI聊天已重置');
    }
}
