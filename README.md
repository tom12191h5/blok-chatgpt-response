# blok-chatgpt-response
As we all know, ChatGPT is a moral police force that doesn't care about facts but only censors. The purpose of this Chrome extension is to block ChatGPT's "compliant" responses.

## Language
[English version](EADME.md)
[简体中文](README_CN.md)


## Introduce
This is a Chrome extension whose main function is to block useless compliance replies from ChatGPT. Specifically, it monitors ChatGPT's input in real time, and once it detects a keyword, such as "law," the script immediately stops ChatGPT's replies, protecting you from ChatGPT's "ethics police."

## How To Use
1. All you need to do is enable developer mode on the Chrome extensions page "chrome://extensions/", select "Load unpackaged extensions", select the folder "chatgpt-auto-stop" and upload it. The code will then run as expected!
2. The script provides a visual interface; you can drag the red dot in the upper right corner to change the tray position, choose to temporarily stop the script, and add custom content.

## Demonstration
Turn Off:
Here you can see that the idiot moral police ChatGPT is still talking!
<img width="1119" height="773" alt="截屏2026-03-19 22 17 01" src="https://github.com/user-attachments/assets/8a5b7369-5afa-489c-9a3b-a566ec24c649" />

Turn On:
Here we can see that we successfully silenced ChatGPT.
<img width="1119" height="773" alt="截屏2026-03-19 22 16 12" src="https://github.com/user-attachments/assets/a3fae62d-ace7-4a19-833e-c6adbf6a1d9c" />

## Others
If you find the code is unusable, it means ChatGPT has updated their website. Please let me know in the Issues section. You will need to provide the following information:

1. Button element content

2. ChatGPT output element content

You can obtain this information as follows:

Go to ChatGPT:

1. First, open the developer options.

2. Right-click the button in the lower right corner and select "Inspect". This will locate the button element content. Then, quickly switch to the "Sources" tab and immediately pause the page (click the pause icon)! Otherwise, the button will disappear! Then send it to me.

3. Restart a session and ask ChatGPT any question. You must be quick! Select the text output by ChatGPT and immediately right-click and select "Inspect"! Then, locate the element containing the text output by ChatGPT and send me the complete div! (It looks like something like: <div class="markdown prose dark:prose-invert w-full wrap-break-word dark markdown-new-styling"><p data-start="0" data-end="91">)
