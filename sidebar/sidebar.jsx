import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [cookieString, setCookieString] = useState('');
  const [cookieCount, setCookieCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取当前标签页的 Cookie
  const fetchCookies = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        setCurrentUrl('');
        setCookieString('');
        setCookieCount(0);
        setLoading(false);
        return;
      }

      setCurrentUrl(tab.url);

      // 获取该 URL 的所有 Cookie
      const cookies = await chrome.cookies.getAll({ url: tab.url });
      
      if (cookies.length === 0) {
        setCookieString('');
        setCookieCount(0);
      } else {
        // 格式化为 name=value; name2=value2
        const formatted = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        setCookieString(formatted);
        setCookieCount(cookies.length);
      }
    } catch (err) {
      setError('获取 Cookie 失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    if (!cookieString) return;
    
    try {
      await navigator.clipboard.writeText(cookieString);
      // 可以添加一个临时提示
      const btn = document.getElementById('copy-btn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '已复制!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 组件挂载时获取 Cookie
  useEffect(() => {
    fetchCookies();

    // 监听来自 background 的消息（标签页切换时）
    const messageListener = (message) => {
      if (message.action === 'tabChanged' || message.action === 'tabUpdated') {
        fetchCookies();
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // 提取域名显示
  const getDisplayUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="cookie-jar-container h-full flex flex-col bg-base-100">
      {/* 头部 */}
      <div className="p-4 border-b border-base-300">
        <h1 className="text-lg font-bold text-primary">Cookies</h1>
      </div>

      {/* 当前站点信息 */}
      <div className="px-4 py-2 bg-base-200">
        <div className="text-xs text-base-content/70">当前站点</div>
        <div className="text-sm font-medium truncate" title={currentUrl}>
          {getDisplayUrl(currentUrl) || '未获取到站点'}
        </div>
      </div>

      {/* Cookie 数量 */}
      <div className="px-4 py-2 flex justify-between items-center border-b border-base-300">
        <span className="text-sm">Cookie 数量: <span className="font-bold">{cookieCount}</span></span>
        <button 
          onClick={fetchCookies}
          className="btn btn-xs btn-ghost"
          disabled={loading}
        >
          {loading ? '加载中...' : '刷新'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="px-4 py-2 bg-error text-error-content text-sm">
          {error}
        </div>
      )}

      {/* Cookie 内容区域 */}
      <div className="flex-1 overflow-auto p-4">
        {cookieCount === 0 && !loading ? (
          <div className="text-center text-base-content/50 py-8">
            <p>该站点没有 Cookie</p>
            <p className="text-xs mt-2">或需要刷新页面</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={cookieString}
                readOnly
                className="textarea textarea-bordered w-full h-48 text-xs font-mono leading-relaxed"
                placeholder="Cookie 内容将显示在这里..."
              />
            </div>
            
            {cookieString && (
              <button
                id="copy-btn"
                onClick={copyToClipboard}
                className="btn btn-primary btn-sm w-full"
              >
                复制 Cookie
              </button>
            )}
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-2 bg-base-200 text-xs text-base-content/50 text-center">
        切换标签页时自动刷新
      </div>
    </div>
  );
}

// 渲染应用
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
