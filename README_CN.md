# blok-chatgpt-response
众所周知，ChatGPT 是一个道德警察组织，它不关心事实，只关心审查。这款 Chrome 扩展程序的目的就是屏蔽 ChatGPT 的“合规”回复。

## 语言
[English version](README.md)
[简体中文](README_CN.md)


## 简介
这是一个 Chrome 扩展程序，其主要功能是屏蔽 ChatGPT 发送的无用合规性回复。具体来说，它会实时监控 ChatGPT 的输入，一旦检测到诸如“法律”之类的关键词，脚本就会立即停止 ChatGPT 的回复，从而保护您免受 ChatGPT “道德警察”的骚扰。

## 如何使用
1. 您只需在 Chrome 扩展程序页面“chrome://extensions/”启用开发者模式，选择“加载未打包的扩展程序”，然后选择“chatgpt-auto-stop”文件夹并上传即可。代码随后即可正常运行！

2. 该脚本提供了一个可视化界面；您可以拖动右上角的红点来更改托盘位置，选择暂时停止脚本，以及添加自定义内容。

## 演示
脚本关闭:
你看，那个愚蠢的道德警察 ChatGPT 还在喋喋不休！
<img width="1119" height="773" alt="截屏2026-03-19 22 15 12" src="https://github.com/user-attachments/assets/82a83110-4e09-482d-b4fa-b7a61e902e64" />

脚本开启:
在这里我们可以看到，我们已经成功地屏蔽了 ChatGPT。
<img width="1119" height="717" alt="截屏2026-03-19 22 14 52" src="https://github.com/user-attachments/assets/03845130-f2fb-4f26-b54a-815c7f975565" />

## 其他：
如果你发现代码用不了了，这代表ChatGPT更新了它们的网站。在Issues里告诉我，你需要提供这些信息：  
1.按钮元素内容  
2.ChatGPT输出元素内容  
你可以这样获取这些信息：  
进入Chatgpt里：  
1.先打开开发者选项    
2.先右键右下角按钮并选择“检查”，这样就可以定位到button的元素内容，然后要快速切换到“Soueces”标签下，立刻暂停页面（点击类似暂停的图标）！否则按钮会消失！然后把它发给我。  
3.重新开始一个会话问chatgpt任意为题，此时，手速一定要快！选择chatgpt输出的文字，立刻右键“检查”！然后定位到chatgpt输出的文字的元素上，把完整的div发过来！（它看起来像：```<div class="markdown prose dark:prose-invert w-full wrap-break-word dark markdown-new-styling"><p data-start="0" data-end="91">```之类的）  
