// 后台服务 - 处理标签页切换和消息传递
console.log('Cookie Jar background script loaded');

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-sidebar',
    title: '打开 Cookie Jar',
    contexts: ['page']
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-sidebar') {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// 处理扩展图标点击
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 监听标签页切换 - 通知侧边栏刷新
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // 向所有打开的侧边栏发送消息
    await chrome.runtime.sendMessage({
      action: 'tabChanged',
      tabId: activeInfo.tabId
    }).catch(() => {
      // 侧边栏可能未打开，忽略错误
    });
  } catch (err) {
    console.log('Tab change notification failed:', err);
  }
});

// 监听标签页更新 - 通知侧边栏刷新
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 只在页面完成加载时通知
  if (changeInfo.status === 'complete') {
    try {
      await chrome.runtime.sendMessage({
        action: 'tabUpdated',
        tabId: tabId,
        url: tab.url
      }).catch(() => {
        // 侧边栏可能未打开，忽略错误
      });
    } catch (err) {
      console.log('Tab update notification failed:', err);
    }
  }
});

// 处理来自侧边栏的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  switch (request.action) {
    case 'openSidebar':
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
      sendResponse({ success: true });
      break;
      
    case 'getCookies':
      // 获取指定 URL 的 Cookie
      if (request.url) {
        chrome.cookies.getAll({ url: request.url })
          .then(cookies => {
            sendResponse({ success: true, cookies });
          })
          .catch(err => {
            sendResponse({ success: false, error: err.message });
          });
        return true; // 保持消息通道开放
      }
      break;
      
    default:
      console.log('Unknown action:', request.action);
  }
});
