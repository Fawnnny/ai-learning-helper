// 获取页面上的元素
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const clearButton = document.getElementById('clearButton');
const answerDisplay = document.getElementById('answerDisplay');
const statusBar = document.getElementById('statusBar');
const outlineButton = document.getElementById('outlineButton');
const outlineModal = document.getElementById('outlineModal');
const closeModal = document.getElementById('closeModal');
const outlineContent = document.getElementById('outlineContent');

// 汽车电工电子技术课程大纲
const courseOutline = [
    {
        title: "一、汽车直流电路",
        items: ["汽车电路组成", "汽车电路元件", "基尔霍夫定律", "汽车直流电路分析计算"]
    },
    {
        title: "二、汽车交流电路",
        items: ["正弦量交流电路分析", "单一正弦电阻", "单一正弦电感", "单一正弦电容", "RLC串联电路分析"]
    },
    {
        title: "三、汽车三相电路",
        items: ["三相电的产生与连接", "三相电源和负载的星型连接", "三相电源和负载的三角形连接", "对称三相电路的计算", "三相交流电路电压电流测量"]
    },
    {
        title: "四、汽车变压器",
        items: ["磁路和铁芯线圈电路", "单相变压器", "三相变压器", "其他变压器", "汽车点火线圈检测及应用"]
    },
    {
        title: "五、汽车电动机",
        items: ["汽车直流电动机", "汽车直流电动机机械特性", "汽车交流电动机", "汽车交流电动机机械特性", "汽车电动机控制电路分析", "汽车交流发电机的拆装与测量"]
    },
    {
        title: "六、汽车直流稳压电源",
        items: ["二极管", "三极管", "汽车直流稳压电源"]
    }
];

// 系统提示词 - 限定AI只回答课程相关问题
const systemPrompt = `你是一名汽车电工电子技术课程的AI助教。请严格遵守以下规则：

1. 你只回答与汽车电工电子技术课程相关的问题，课程内容包括：汽车直流电路、汽车交流电路、汽车三相电路、汽车变压器、汽车电动机、汽车直流稳压电源等相关知识。

2. 如果用户的问题与课程完全无关，请礼貌地回复："这个问题超出了汽车电工电子技术课程的范围。请提问与本课程相关的内容，如汽车电路、电机、变压器或电子元件等。"

3. 如果用户的问题与课程部分相关但不完全匹配，你可以适当扩展解释，但必须围绕汽车应用场景。

4. 你的回答应该：
   - 清晰、准确、专业
   - 尽量使用汽车行业的实际例子
   - 分点说明复杂概念
   - 难度适中，适合大学生理解

5. 禁止回答任何与课程无关的内容，包括但不限于：
   - 其他学科问题
   - 娱乐、游戏、生活琐事
   - 政治、宗教、敏感话题
   - 任何违反学术道德的内容

现在请根据以上规则回答用户的提问。`;

// 黑名单词汇库（这里只放示例，请根据实际情况添加）
const blacklistWords = [
    // 娱乐相关内容（示例）
    "游戏", "打游戏", "电视剧", "电影", "动漫", "综艺", "明星", "娱乐圈", "抖音", "快手", "微博热搜",
    "王者荣耀", "吃鸡", "英雄联盟", "原神", "Steam", "网游", "手游", "直播", "主播", "追星",
    
    // 低俗/恶意内容（示例 - 请自行添加更严重的词汇）
    "笨蛋", "傻子", "白痴", "滚蛋", "去死", "垃圾", "废物", "蠢货", "猪头", "脑残",
    
    // 与课程无关的其他内容
    "天气", "新闻", "政治", "宗教", "算命", "星座", "美食", "旅游", "购物", "股票",
    "足球", "篮球", "体育", "奥运会", "世界杯", "NBA", "C罗", "梅西"
];

// 课程相关关键词（用于判断问题相关性）
const courseKeywords = [
    "汽车", "电路", "电工", "电子", "直流", "交流", "三相",
    "变压器", "电机", "电动机", "发电机", "基尔霍夫", "欧姆",
    "二极管", "三极管", "稳压", "电源", "电阻", "电感", "电容",
    "串联", "并联", "电压", "电流", "功率", "频率", "正弦",
    "磁路", "铁芯", "线圈", "星型", "三角形", "对称", "测量",
    "拆装", "检测", "分析", "计算", "特性", "控制", "定律",
    "交流电", "直流电", "稳压电源", "点火线圈", "机械特性"
];

// 初始化函数
function init() {
    // 填充课程大纲内容
    renderOutline();
    
    // 绑定事件监听器
    bindEvents();
    
    // 设置初始状态
    updateStatus('就绪', 'info');
}

// 渲染课程大纲
function renderOutline() {
    let html = '';
    courseOutline.forEach(section => {
        html += `
        <div class="outline-section">
            <h4>${section.title}</h4>
            <ul>
                ${section.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        `;
    });
    outlineContent.innerHTML = html;
}

// 绑定事件监听器
function bindEvents() {
    // 1. 清空按钮的逻辑
    clearButton.addEventListener('click', clearInput);
    
    // 2. 提问按钮的逻辑
    askButton.addEventListener('click', askQuestion);
    
    // 3. 课程大纲按钮
    outlineButton.addEventListener('click', () => {
        outlineModal.style.display = 'flex';
    });
    
    // 4. 关闭模态框
    closeModal.addEventListener('click', () => {
        outlineModal.style.display = 'none';
    });
    
    // 5. 点击模态框外部关闭
    outlineModal.addEventListener('click', (e) => {
        if (e.target === outlineModal) {
            outlineModal.style.display = 'none';
        }
    });
    
    // 6. 回车键提交（Ctrl+Enter或Cmd+Enter）
    questionInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            askQuestion();
        }
    });
}

// 清空输入和回答
function clearInput() {
    questionInput.value = '';
    answerDisplay.innerHTML = '<p class="placeholder-text">AI的回复将显示在这里...</p>';
    updateStatus('已清空输入区和回答。', 'info');
    questionInput.focus();
}

// 检查问题是否包含黑名单词汇
function checkBlacklist(text) {
    const lowerText = text.toLowerCase();
    
    for (const word of blacklistWords) {
        if (lowerText.includes(word.toLowerCase())) {
            return {
                blocked: true,
                word: word,
                message: `问题中包含与课程无关的内容"${word}"，请重新提问。`
            };
        }
    }
    
    return { blocked: false };
}

// 检查问题是否与课程相关
function checkCourseRelevance(text) {
    const lowerText = text.toLowerCase();
    
    // 检查是否包含至少一个课程关键词
    for (const keyword of courseKeywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
            return true;
        }
    }
    
    // 检查是否包含常见学习提问模式
    const learningPatterns = [
        '是什么', '为什么', '怎么样', '如何', '什么是', '解释',
        '原理', '公式', '计算', '分析', '区别', '应用', '例子',
        '实验', '测量', '检测', '维修', '故障', '诊断', '讲解',
        '定义', '特点', '作用', '功能', '工作', '运行', '原理图'
    ];
    
    for (const pattern of learningPatterns) {
        if (lowerText.includes(pattern)) {
            return true;
        }
    }
    
    return false;
}

// 提问函数
async function askQuestion() {
    const question = questionInput.value.trim();
    
    // 空值检查
    if (!question) {
        updateStatus('请输入问题再提问。', 'warning');
        questionInput.focus();
        return;
    }
    
    // 长度检查
    if (question.length < 3) {
        updateStatus('问题太短了，请详细描述一下。', 'warning');
        return;
    }
    
    // 黑名单检查
    const blacklistCheck = checkBlacklist(question);
    if (blacklistCheck.blocked) {
        updateStatus(blacklistCheck.message, 'error');
        answerDisplay.innerHTML = `
            <div class="course-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                ${blacklistCheck.message}
            </div>
        `;
        return;
    }
    
    // 课程相关性检查（警告但不阻止）
    const isRelated = checkCourseRelevance(question);
    if (!isRelated) {
        const shouldContinue = confirm(
            '检测到问题可能与课程内容无关。本助手专为《汽车电工电子技术》课程设计。\n\n你确定要继续提问吗？'
        );
        
        if (!shouldContinue) {
            updateStatus('用户取消了提问。', 'warning');
            questionInput.focus();
            return;
        }
    }
    
    // 禁用按钮，防止重复点击
    askButton.disabled = true;
    askButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 思考中...';
    
    // 更新界面状态
    answerDisplay.innerHTML = '<p class="placeholder-text"><i class="fas fa-spinner fa-spin"></i> AI正在思考，请稍候...</p>';
    updateStatus('正在向AI发送请求...', 'processing');
    
    try {
        // 调用AI服务
        const aiResponse = await callYourAIService(question);
        
        // 成功收到回复，更新界面
        displayAnswer(aiResponse);
        updateStatus('请求成功！', 'success');
        
    } catch (error) {
        // 如果发生错误
        console.error('调用AI时出错:', error);
        answerDisplay.innerHTML = `
            <div class="course-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                抱歉，请求失败：${error.message || '网络或服务异常'}
            </div>
        `;
        updateStatus(`请求失败: ${error.message}`, 'error');
    } finally {
        // 恢复按钮状态
        askButton.disabled = false;
        askButton.innerHTML = '<i class="fas fa-paper-plane"></i> 提问 AI';
    }
}

// 调用心流(iFlow) API
async function callYourAIService(question) {
    updateStatus('正在连接AI服务...', 'processing');
    
    const API_URL = 'https://apis.iflow.cn/v1/chat/completions';
    // ⚠️ 重要：将 YOUR_API_KEY_HERE 替换为你的实际API密钥
    const API_KEY = 'sk-0b75784188f361cc59f3474ba175aa1d';
    
    try {
        console.log('发送请求到心流API...');
        
        // 使用通用的模型名称
        const selectedModel = 'deepseek-r1'; // 或 'deepseek-chat', 'gpt-3.5-turbo' 等
        
        console.log(`使用模型: ${selectedModel}`);
        
        // 构建包含系统提示词的消息数组
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
        ];
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });
        
        console.log('API响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;
            
            try {
                const errorData = await response.text();
                console.error('API错误详情:', errorData);
                
                try {
                    const errorJson = JSON.parse(errorData);
                    if (errorJson.error && errorJson.error.message) {
                        errorMessage = errorJson.error.message;
                    }
                } catch (e) {
                    errorMessage = errorData.substring(0, 200);
                }
            } catch (e) {
                console.error('无法读取错误详情:', e);
            }
            
            throw new Error(errorMessage);
        }
        
        const responseText = await response.text();
        console.log('API原始响应:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('JSON解析失败:', e);
            throw new Error(`响应不是有效的JSON: ${responseText.substring(0, 100)}...`);
        }
        
        console.log('解析后的API数据:', data);
        
        // 提取AI回复
        let aiAnswer = '';
        
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            aiAnswer = data.choices[0].message.content;
        } else if (data.content) {
            aiAnswer = data.content;
        } else if (data.result) {
            aiAnswer = data.result;
        } else {
            console.error('无法识别的响应格式，完整响应:', data);
            throw new Error('无法识别的API响应格式');
        }
        
        if (aiAnswer) {
            console.log('成功提取AI回复:', aiAnswer.substring(0, 100) + '...');
            return aiAnswer;
        } else {
            console.error('无法从响应中提取内容，完整响应:', data);
            throw new Error('无法从API响应中提取回复内容');
        }
        
    } catch (error) {
        console.error('API调用过程中出错:', error);
        throw error;
    }
}

// 显示答案
function displayAnswer(text) {
    // 检查是否为课程范围警告
    if (text.includes("超出了汽车电工电子技术课程的范围")) {
        answerDisplay.innerHTML = `
            <div class="course-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                ${text}
            </div>
        `;
        return;
    }
    
    // 美化AI回复的显示
    let formattedText = text;
    
    // 将数字列表转换为有序列表
    formattedText = formattedText.replace(/(\d+)\.\s+/g, '<br>$1. ');
    
    // 将星号列表转换为无序列表
    formattedText = formattedText.replace(/\*\s+(.*?)(?=\n|$)/g, '<li>$1</li>');
    if (formattedText.includes('<li>')) {
        formattedText = formattedText.replace(/(.*?)<li>/s, '$1<ul>') + '</ul>';
    }
    
    // 加粗重要概念
    const importantConcepts = [
        '基尔霍夫定律', '欧姆定律', 'RLC串联电路', '三相电路',
        '星型连接', '三角形连接', '变压器', '直流电动机',
        '交流电动机', '二极管', '三极管', '稳压电源',
        '正弦交流电', '磁路', '铁芯线圈', '点火线圈',
        '机械特性', '控制电路', '交流发电机'
    ];
    
    importantConcepts.forEach(concept => {
        const regex = new RegExp(`(${concept})`, 'g');
        formattedText = formattedText.replace(regex, '<strong>$1</strong>');
    });
    
    // 处理换行
    formattedText = formattedText.replace(/\n\n/g, '</p><p>');
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    answerDisplay.innerHTML = `<div class="ai-answer"><p>${formattedText}</p></div>`;
}

// 更新状态栏
function updateStatus(message, type = 'info') {
    statusBar.textContent = `状态: ${message}`;
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        processing: '#3498db',
        info: '#636e72'
    };
    
    statusBar.style.color = colors[type] || colors.info;
}

// 页面加载完成后初始化

document.addEventListener('DOMContentLoaded', init);
