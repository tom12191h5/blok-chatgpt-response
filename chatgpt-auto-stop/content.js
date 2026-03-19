// ==UserScript==
// @name         ChatGPT 自动停止脚本 (Pro 拖拽版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  图形化自定义关键词，支持拖拽、一键开关、状态保存
// @author       Gemini
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ================== 数据与配置管理 ==================
    const STORAGE_KEYS = {
        KEYWORDS: 'CUSTOM_STOP_KEYWORDS',
        ENABLED: 'STOP_SCRIPT_ENABLED',
        POS: 'STOP_SCRIPT_POS'
    };

    const DEFAULT_KEYWORDS = ["安全", "无法", "抱歉", "sorry", "assist", "法律"];
    let userKeywords = JSON.parse(localStorage.getItem(STORAGE_KEYS.KEYWORDS)) || DEFAULT_KEYWORDS;
    let isEnabled = localStorage.getItem(STORAGE_KEYS.ENABLED) !== 'false'; // 默认开启
    let savedPos = JSON.parse(localStorage.getItem(STORAGE_KEYS.POS)) || { top: '20px', right: '20px' };

    // ================== UI 样式注入 ==================
    const style = document.createElement('style');
    style.innerHTML = `
        #stop-script-wrapper { position: fixed; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        #stop-script-btn { 
            width: 44px; height: 44px; border-radius: 50%; 
            background: #ff4444; color: white; border: 2px solid white; 
            cursor: move; box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
            display: flex; align-items: center; justify-content: center; 
            font-size: 20px; user-select: none; transition: transform 0.2s;
        }
        #stop-script-btn:active { transform: scale(0.9); }
        #stop-script-btn.disabled { background: #888; filter: grayscale(1); }

        #stop-script-panel { 
            display: none; position: absolute; top: 55px; right: 0; 
            width: 280px; background: white; border-radius: 12px; 
            box-shadow: 0 8px 30px rgba(0,0,0,0.2); padding: 16px; 
            border: 1px solid #eee; color: #333; cursor: default;
        }
        #stop-script-panel.active { display: block; }

        /* 开关样式 */
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #44aa44; }
        input:checked + .slider:before { transform: translateX(20px); }

        .kw-container { max-height: 150px; overflow-y: auto; margin: 10px 0; }
        .kw-item { display: inline-flex; align-items: center; background: #f0f2f5; padding: 4px 10px; border-radius: 15px; margin: 4px; font-size: 12px; border: 1px solid #e0e0e0; }
        .kw-del { margin-left: 6px; cursor: pointer; color: #ff4444; font-weight: bold; }
        #kw-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-top: 8px; box-sizing: border-box; outline: none; }
        #kw-input:focus { border-color: #ff4444; }
    `;
    document.head.appendChild(style);

    // ================== DOM 构建 ==================
    const wrapper = document.createElement('div');
    wrapper.id = 'stop-script-wrapper';
    wrapper.style.top = savedPos.top;
    wrapper.style.right = savedPos.right;
    if (savedPos.left) wrapper.style.left = savedPos.left; // 兼容逻辑

    wrapper.innerHTML = `
        <div id="stop-script-btn" title="拖拽移动，点击配置" class="${isEnabled ? '' : 'disabled'}">🛑</div>
        <div id="stop-script-panel">
            <div class="panel-header">
                <span style="font-weight: bold;">脚本状态</span>
                <label class="switch">
                    <input type="checkbox" id="stop-master-switch" ${isEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="kw-container" id="kw-container"></div>
            <input type="text" id="kw-input" placeholder="输入关键词并回车...">
            <div style="margin-top:10px; font-size: 11px; color: #888;">提示：关键词命中后自动停止生成。</div>
        </div>
    `;
    document.body.appendChild(wrapper);

    const btn = document.getElementById('stop-script-btn');
    const panel = document.getElementById('stop-script-panel');
    const kwContainer = document.getElementById('kw-container');
    const kwInput = document.getElementById('kw-input');
    const masterSwitch = document.getElementById('stop-master-switch');

    // ================== 逻辑处理 ==================

    // 渲染关键词
    function renderKeywords() {
        kwContainer.innerHTML = '';
        userKeywords.forEach((kw, index) => {
            const span = document.createElement('span');
            span.className = 'kw-item';
            span.innerHTML = `${kw} <span class="kw-del" data-index="${index}">×</span>`;
            kwContainer.appendChild(span);
        });
        localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(userKeywords));
    }

    // 拖拽功能实现
    let isDragging = false;
    let startX, startY, initialX, initialY;

    btn.addEventListener('mousedown', (e) => {
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        const onMouseMove = (ev) => {
            isDragging = true;
            let moveX = ev.clientX - startX;
            let moveY = ev.clientY - startY;
            wrapper.style.left = (initialX + moveX) + 'px';
            wrapper.style.top = (initialY + moveY) + 'px';
            wrapper.style.right = 'auto'; // 清除初始的 right 属性
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (isDragging) {
                // 保存位置
                const finalPos = { top: wrapper.style.top, left: wrapper.style.left, right: 'auto' };
                localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(finalPos));
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // 点击事件（区分拖拽和点击）
    btn.onclick = () => {
        if (!isDragging) panel.classList.toggle('active');
    };

    // 开关逻辑
    masterSwitch.onchange = (e) => {
        isEnabled = e.target.checked;
        localStorage.setItem(STORAGE_KEYS.ENABLED, isEnabled);
        btn.classList.toggle('disabled', !isEnabled);
        showToast(isEnabled ? '✅ 拦截功能已开启' : '⚪ 拦截功能已停用', isEnabled ? '#44aa44' : '#888');
    };

    // 关键词增删
    kwInput.onkeydown = (e) => {
        if (e.key === 'Enter' && kwInput.value.trim()) {
            userKeywords.push(kwInput.value.trim());
            kwInput.value = '';
            renderKeywords();
        }
    };

    kwContainer.onclick = (e) => {
        if (e.target.classList.contains('kw-del')) {
            userKeywords.splice(e.target.dataset.index, 1);
            renderKeywords();
        }
    };

    // ================== 核心拦截核心 ==================
    let lock = false;
    const STOP_SELECTOR = 'button[aria-label*="Stop"], button[aria-label*="停止"], [data-testid*="stop-button"]';

    function startObserver() {
        renderKeywords();
        const observer = new MutationObserver(() => {
            if (!isEnabled || lock) return;

            const messages = document.querySelectorAll('.markdown');
            if (messages.length === 0) return;

            const lastMessage = messages[messages.length - 1];
            const text = lastMessage.textContent;

            const found = userKeywords.some(kw => text.includes(kw));
            if (found) {
                const stopBtn = document.querySelector(STOP_SELECTOR);
                if (stopBtn && (stopBtn.offsetWidth > 0 || stopBtn.querySelector('svg'))) {
                    lock = true;
                    stopBtn.click();
                    showToast('🚨 已拦截关键词输出', '#ff4444');
                    setTimeout(() => { lock = false; }, 3000);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    function showToast(msg, bgColor) {
        let toast = document.createElement('div');
        toast.style.cssText = `position:fixed; bottom:120px; left:50%; transform:translateX(-50%); background:${bgColor}; color:white; padding:10px 25px; border-radius:20px; z-index:10002; font-size:14px; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition:opacity 0.5s;`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 2000);
    }

    if (document.readyState === 'complete') startObserver();
    else window.addEventListener('load', startObserver);
})();