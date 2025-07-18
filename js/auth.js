(function() {
    'use strict';
    
    const AUTH_CONFIG = {
        password: 'demo2024',
        sessionKey: 'prototypeAuth',
        sessionDuration: 24 * 60 * 60 * 1000 // 24時間
    };
    
    function isAuthenticated() {
        const authData = localStorage.getItem(AUTH_CONFIG.sessionKey);
        if (!authData) return false;
        
        try {
            const { timestamp } = JSON.parse(authData);
            return Date.now() - timestamp < AUTH_CONFIG.sessionDuration;
        } catch {
            return false;
        }
    }
    
    function authenticate() {
        const password = prompt('このプロトタイプにアクセスするにはパスワードが必要です:');
        
        if (password === AUTH_CONFIG.password) {
            localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify({
                timestamp: Date.now()
            }));
            return true;
        }
        
        alert('パスワードが正しくありません。');
        return false;
    }
    
    function showAccessDenied() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
            ">
                <div style="
                    text-align: center;
                    padding: 40px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h2 style="color: #333; margin-bottom: 20px;">アクセス制限</h2>
                    <p style="color: #666; margin-bottom: 30px;">このページにアクセスするには認証が必要です。</p>
                    <button onclick="location.reload()" style="
                        background-color: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    ">認証する</button>
                </div>
            </div>
        `;
    }
    
    function initAuth() {
        if (!isAuthenticated()) {
            if (!authenticate()) {
                showAccessDenied();
                return false;
            }
        }
        return true;
    }
    
    // ページ読み込み時に認証チェック
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
    
    // ログアウト機能をグローバルに公開
    window.logout = function() {
        localStorage.removeItem(AUTH_CONFIG.sessionKey);
        location.reload();
    };
})();