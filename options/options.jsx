import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function Options() {
  const [settings, setSettings] = useState({
    enabled: true,
    theme: 'light',
    autoOpen: false
  });

  // 加载设置
  useEffect(() => {
    chrome.storage.sync.get(settings, (result) => {
      setSettings(result);
    });
  }, []);

  const saveSettings = async () => {
    await chrome.storage.sync.set(settings);
    alert('设置已保存！');
  };

  const resetSettings = async () => {
    const defaultSettings = {
      enabled: true,
      theme: 'light',
      autoOpen: false
    };
    setSettings(defaultSettings);
    await chrome.storage.sync.set(defaultSettings);
  };

  return (
    <div className="options-container">
      <h1 className="text-3xl font-bold mb-6">../cookiejar 设置</h1>

      <div className="card bg-base-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">基本设置</h2>

        <div className="form-control mb-4">
          <label className="label cursor-pointer">
            <span className="label-text">启用扩展</span>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
              className="checkbox"
            />
          </label>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">主题</span>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({...settings, theme: e.target.value})}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="light">浅色主题</option>
              <option value="dark">深色主题</option>
            </select>
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">自动打开侧边栏</span>
            <input
              type="checkbox"
              checked={settings.autoOpen}
              onChange={(e) => setSettings({...settings, autoOpen: e.target.checked})}
              className="checkbox"
            />
          </label>
        </div>
      </div>

      <div className="card bg-base-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">使用说明</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>点击扩展图标或使用右键菜单打开侧边栏</li>
          <li>在侧边栏中可以使用各种功能</li>
          <li>选中文本后可以通过扩展处理</li>
          <li>所有设置都会自动同步保存</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button onClick={saveSettings} className="btn btn-primary">
          保存设置
        </button>
        <button onClick={resetSettings} className="btn btn-ghost">
          重置默认
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Options />);