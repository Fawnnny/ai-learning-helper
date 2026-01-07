// 获取页面上的元素
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const clearButton = document.getElementById('clearButton');
const answerDisplay = document.getElementById('answerDisplay');
const statusBar = document.getElementById('statusBar');

// 1. 清空按钮的逻辑
clearButton.addEventListener('click', function() {
    questionInput.value = '';
    answerDisplay.innerHTML = '<p class="placeholder-text">AI的回复将显示在这里...</p>';
    updateStatus('已清空输入区和回答。');
});

// 2. 【核心】提问按钮的逻辑
askButton.addEventListener('click', async function() {
    const question = questionInput.value.trim();
    
    // 做一些简单的检查
    if (!question) {
        updateStatus('请输入问题再提问。', 'warning');
        questionInput.focus();
        return;
    }
    if (question.length < 3) {
        updateStatus('问题太短了，请详细描述一下。', 'warning');
        return;
    }
    
    // 禁用按钮，防止重复点击
    askButton.disabled = true;
    askButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 思考中...';
    
    // 更新界面状态
    answerDisplay.innerHTML = '<p class="placeholder-text"><i class="fas fa-spinner fa-spin"></i> AI正在思考，请稍候...</p>';
    updateStatus('正在向AI发送请求...', 'processing');
    
    try {
        // 这里是调用AI的核心函数
        const aiResponse = await callYourAIService(question);
        
        // 成功收到回复，更新界面
        displayAnswer(aiResponse);
        updateStatus('请求成功！', 'success');
        
    } catch (error) {
        // 如果发生错误
        console.error('调用AI时出错:', error);
        answerDisplay.innerHTML = `<p class="placeholder-text" style="color:#e74c3c;"><i class="fas fa-exclamation-triangle"></i> 抱歉，请求失败：${error.message || '网络或服务异常'}</p>`;
        updateStatus(`请求失败: ${error.message}`, 'error');
    } finally {
        // 无论成功失败，都恢复按钮状态
        askButton.disabled = false;
        askButton.innerHTML = '<i class="fas fa-paper-plane"></i> 提问 AI';
    }
});

// 3. 【关键函数】需要你接入自己API的地方
async function callYourAIService(question) {
    updateStatus('正在连接AI服务...', 'processing');
    
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // 【这里是你要修改的代码区域】
    // 你需要把下面的模拟函数，替换成真实的API调用代码。
    // 假设你找的API地址是 https://api.your-ai-service.com/chat
    // 你需要在这里使用 fetch 或 axios 去请求它。
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
    // 临时模拟函数：返回一个假的AI回复（用于测试）
    return simulateAIResponse(question);
    
    /* 真实API调用示例 (以Fetch为例，你需要填写URL和API Key)
    const API_URL = 'https://api.your-ai-service.com/v1/chat/completions';
    const API_KEY = 'YOUR_SECRET_API_KEY'; // 注意：前端暴露密钥不安全，正式环境请用后端
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
    }
    
    const data = await response.json();
    // 从复杂的API响应中提取文本，例如：
    const aiAnswer = data.choices[0]?.message?.content || '无返回内容';
    return aiAnswer;
    */
}

// 4. 辅助函数：模拟AI回复（测试用，可删除）
function simulateAIResponse(question) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockAnswers = [
                `这是一个关于 **“${question.substring(0, 20)}...”** 的模拟回答。\n\n在实际使用中，这里将显示来自真实AI（如GPT、Gemini）生成的、与问题相关的详细解答、步骤分析或学习建议。\n\n请将模拟函数替换为你自己的API调用代码。`,
                `我已收到你的问题：“${question}”。\n\n（此处为模拟回复）为了真正启用AI功能，你需要在 **script.js** 文件的 **callYourAIService** 函数中，接入你选择的AI服务API。`
            ];
            resolve(mockAnswers[Math.floor(Math.random() * mockAnswers.length)]);
        }, 1500); // 模拟1.5秒网络延迟
    });
}

// 5. 辅助函数：在页面上显示答案
function displayAnswer(text) {
    answerDisplay.innerHTML = `<div class="ai-answer">${text.replace(/\n/g, '<br>')}</div>`;
}

// 6. 辅助函数：更新底部的状态栏
function updateStatus(message, type = 'info') {
    statusBar.textContent = `状态: ${message}`;
    statusBar.style.color = 
        type === 'success' ? '#27ae60' :
        type === 'error' ? '#e74c3c' :
        type === 'warning' ? '#f39c12' :
        type === 'processing' ? '#3498db' :
        '#636e72';
}