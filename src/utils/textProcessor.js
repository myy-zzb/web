// 处理文本文件的工具函数
export function processTextFile(text) {
  // 按章节分割文本
  const chapters = {}
  // 将文本按行分割，并移除 BOM 标记
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/)
  let currentChapter = ''
  let currentContent = ''
  let emptyLineCount = 0

  for (const line of lines) {
    const trimmedLine = line.trim()

    // 匹配章节标题
    const chapterMatch = trimmedLine.match(/^(\d+)\s*([^\n]+)$/) ||
                        trimmedLine.match(/^第[一二三四五六七八九十百千]+章\s*([^\n]+)$/)

    if (chapterMatch) {
      // 保存前一章节内容
      if (currentChapter && currentContent) {
        chapters[currentChapter] = currentContent.trim()
      }
      // 更新当前章节
      currentChapter = trimmedLine
      // 添加居中的章节标题
      currentContent = ''
      emptyLineCount = 0
    } else if (trimmedLine) {
      // 处理正文内容
      if (emptyLineCount > 0) {
        // 最多添加一个换行
        currentContent += '<br />'
      }
      // 添加两个全角空格作为缩进
      currentContent += trimmedLine + '<br />'
      emptyLineCount = 0
    } else {
      emptyLineCount++
    }
  }

  // 保存最后一个章节
  if (currentChapter && currentContent) {
    chapters[currentChapter] = currentContent.trim()
  }

  // 如果没有识别到任何章节，将整个文本作为单章节
  if (Object.keys(chapters).length === 0 && currentContent) {
    chapters['正文'] = currentContent.trim()
  }

  return chapters
}

// 将数字转换为中文数字（如果需要）
export function numberToChinese(num) {
  const chinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  if (num <= 10) return chinese[num]
  if (num < 20) return '十' + (num > 10 ? chinese[num - 10] : '')
  const digit = num % 10
  return chinese[Math.floor(num / 10)] + '十' + (digit ? chinese[digit] : '')
}
