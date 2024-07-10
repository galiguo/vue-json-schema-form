import message from './message'
import Clipboard from 'clipboard'

function clipboardSuccess(successText = '复制成功！') {
  message.success(successText)
}

function clipboardError(failText = '复制失败！') {
  message.error(failText)
}

export default function handleClipboard(text, event, successText, failText) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(successText)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(failText)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
  return clipboard
}
