/**
 * AIStudioAdapter - Google AI Studio 平台适配器
 * 负责平台特定的 DOM 操作、主题获取、按钮插入等
 */
class AIStudioAdapter {
    constructor() {
        this.modal = null
    }

    findPromptInput() {
        return document.querySelector('ms-prompt-input-wrapper textarea')
    }

    findRunButton() {
        return document.querySelector('ms-run-button button')
    }

    getCurrentTheme() {
        return document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    }

    getThemeColors() {
        const theme = this.getCurrentTheme()

        if (theme === 'dark') {
            return {
                background: '#202124',
                surface: '#303134',
                border: '#5f6368',
                text: '#e8eaed',
                textSecondary: '#9aa0a6',
                primary: '#9aa0a6',
                hover: '#414345',
                inputBg: '#303134',
                inputBorder: '#5f6368',
                shadow: 'rgba(0,0,0,0.3)'
            }
        }

        return {
            background: 'white',
            surface: 'white',
            border: '#e8eaed',
            text: '#202124',
            textSecondary: '#5f6368',
            primary: '#5f6368',
            hover: '#f8f9fa',
            inputBg: 'white',
            inputBorder: '#dadce0',
            shadow: 'rgba(0,0,0,0.12)'
        }
    }

    createButton() {
        const wrapper = document.createElement('div')
        wrapper.className = 'button-wrapper'

        const btn = document.createElement('button')
        btn.id = 'banana-btn'
        btn.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon'

        const updateButtonTheme = () => {
            const colors = this.getThemeColors()
            btn.style.cssText = `width: 40px; height: 40px; border-radius: 50%; border: none; background: ${colors.hover}; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-right: 8px; transition: background-color 0.2s;`
        }

        updateButtonTheme()
        btn.title = '快捷提示'
        btn.textContent = '🍌'

        btn.addEventListener('mouseenter', () => {
            const colors = this.getThemeColors()
            btn.style.background = colors.border
        })
        btn.addEventListener('mouseleave', () => {
            const colors = this.getThemeColors()
            btn.style.background = colors.hover
        })

        btn.addEventListener('click', () => {
            if (this.modal) {
                this.modal.show()
            }
        })

        wrapper.appendChild(btn)
        return wrapper
    }

    initButton() {
        // 如果按钮已存在,不重复添加
        if (document.getElementById('banana-btn')) {
            return true
        }

        const runButton = this.findRunButton()
        if (!runButton) {
            return false
        }

        const bananaBtn = this.createButton()
        const buttonWrapper = runButton.parentElement

        try {
            buttonWrapper.parentElement.insertBefore(bananaBtn, buttonWrapper)
        } catch (error) {
            console.error('插入香蕉按钮失败:', error)
            buttonWrapper.insertAdjacentElement('beforebegin', bananaBtn)
        }

        return true
    }

    insertPrompt(promptText) {
        const textarea = this.findPromptInput()
        if (textarea) {
            textarea.value = promptText
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            if (this.modal) {
                this.modal.hide()
            }
        }
    }

    waitForElements() {
        const checkInterval = setInterval(() => {
            const input = this.findPromptInput()

            // 只要找到输入框就尝试初始化按钮
            if (input) {
                const success = this.initButton()
                if (success) {
                    clearInterval(checkInterval)
                }
            }
        }, 1000)
    }

    startObserver() {
        const observer = new MutationObserver(() => {
            const existingBtn = document.getElementById('banana-btn')

            if (!existingBtn) {
                console.log('检测到香蕉按钮消失，重新添加')
                this.initButton()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    }
}

/**
 * 主入口
 */
function init() {
    const adapter = new AIStudioAdapter()
    const modal = new BananaModal(adapter)
    adapter.modal = modal

    adapter.waitForElements()
    adapter.startObserver()

    // 处理页面导航变化
    const handleNavigationChange = () => {
        setTimeout(() => {
            adapter.initButton()
        }, 1000)
    }

    window.addEventListener('popstate', handleNavigationChange)
    window.addEventListener('pushstate', handleNavigationChange)
    window.addEventListener('replacestate', handleNavigationChange)
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
} else {
    window.addEventListener('load', init)
}