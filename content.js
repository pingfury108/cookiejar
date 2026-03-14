// 内容脚本 - 在页面中注入功能
console.log('Content script loaded');

// 获取选中文本的函数
function getSelectionText() {
  const selection = window.getSelection();
  return selection.toString().trim();
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSelection':
      sendResponse({
        success: true,
        text: getSelectionText(),
        url: window.location.href
      });
      break;
    default:
      console.log('Unknown action:', request.action);
  }
});

// 示例：添加页面右键菜单监听
document.addEventListener('contextmenu', (e) => {
  // 可以在这里添加自定义右键菜单逻辑
});

// 示例：监听选中文本变化
let lastSelection = '';
document.addEventListener('selectionchange', () => {
  const currentSelection = getSelectionText();
  if (currentSelection !== lastSelection && currentSelection.length > 0) {
    lastSelection = currentSelection;
    console.log('Text selected:', currentSelection);
  }
});