class BrilliantEditor {
  constructor(container) {
    this.container = container;
    this.code = '';
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="editor-wrapper">
        <div class="editor-header">
          <span class="editor-title">代码编辑器</span>
          <button class="run-btn">运行</button>
        </div>
        <div class="editor-content">
          <div class="line-numbers"></div>
          <textarea class="code-input" placeholder="在这里输入代码..."></textarea>
          <div class="syntax-highlight"></div>
        </div>
        <div class="output-panel">
          <div class="output-header">输出结果</div>
          <div class="output-content"></div>
        </div>
      </div>
    `;

    this.input = this.container.querySelector('.code-input');
    this.highlight = this.container.querySelector('.syntax-highlight');
    this.lineNumbers = this.container.querySelector('.line-numbers');
    this.output = this.container.querySelector('.output-content');
    this.runBtn = this.container.querySelector('.run-btn');

    this.bindEvents();
    this.updateLineNumbers();
  }

  bindEvents() {
    this.input.addEventListener('input', () => {
      this.code = this.input.value;
      this.updateHighlight();
      this.updateLineNumbers();
    });

    this.input.addEventListener('scroll', () => {
      this.highlight.scrollTop = this.input.scrollTop;
      this.lineNumbers.scrollTop = this.input.scrollTop;
    });

    this.runBtn.addEventListener('click', () => {
      this.executeCode();
    });
  }

  updateHighlight() {
    const highlighted = this.syntaxHighlight(this.code);
    this.highlight.innerHTML = highlighted;
  }

  syntaxHighlight(code) {
    return code
      .replace(/\b(function|var|let|const|if|else|for|while|return)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/\n/g, '<br>');
  }

  updateLineNumbers() {
    const lines = this.code.split('\n').length;
    this.lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
  }

  executeCode() {
    try {
      // 简单的代码意图理解，而非真正执行
      const result = this.interpretCode(this.code);
      this.output.innerHTML = `<div class="success">${result}</div>`;
    } catch (error) {
      this.output.innerHTML = `<div class="error">错误: ${error.message}</div>`;
    }
  }

  interpretCode(code) {
    // 基础的代码意图理解
    if (code.includes('console.log')) {
      const matches = code.match(/console\.log\(['"`]([^'"`]*)['"`]\)/g);
      if (matches) {
        return matches.map(match => {
          const content = match.match(/['"`]([^'"`]*)['"`]/)[1];
          return content;
        }).join('\n');
      }
    }
    
    if (code.includes('alert')) {
      const matches = code.match(/alert\(['"`]([^'"`]*)['"`]\)/g);
      if (matches) {
        return '弹窗: ' + matches.map(match => {
          const content = match.match(/['"`]([^'"`]*)['"`]/)[1];
          return content;
        }).join(', ');
      }
    }

    return '代码已解析，意图理解完成 ✓';
  }
}
