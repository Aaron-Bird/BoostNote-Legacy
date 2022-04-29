import attachmentManagement from './attachmentManagement'
import yaml from 'js-yaml'
import path from 'path'
import ConfigManager from 'browser/main/lib/ConfigManager'

const delimiterRegExp = /^\-{3}/

/**
 * ```
 * {
 *   storagePath,
 *   export
 * }
 * ```
 */
export default function formatMarkdown(props) {
  return function(note, targetPath, exportTasks) {
    let result = note.content

    if (props.storagePath && note.key) {
      const attachmentsAbsolutePaths = attachmentManagement.getAbsolutePathsOfAttachmentsInContent(
        result,
        props.storagePath
      )

      const config = ConfigManager.get()
      attachmentsAbsolutePaths.forEach(attachment => {
        exportTasks.push({
          src: attachment,
          dst: path.resolve(config.export.hexo.attachmentFolder)
        })
      })
      result = attachmentManagement.replaceStorageReferences(
        result,
        note.key,
        config.export.hexo.attachmentPathInMd
      )
    }

    if (props.export.metadata === 'MERGE_HEADER') {
      const metadata = getFrontMatter(result)

      const values = Object.assign({}, note)
      delete values.content
      delete values.isTrashed

      for (const key in values) {
        metadata[key] = values[key]
      }

      result = replaceFrontMatter(result, metadata)
    } else if (props.export.metadata === 'MERGE_VARIABLE') {
      const metadata = getFrontMatter(result)

      const values = Object.assign({}, note)
      delete values.content
      delete values.isTrashed

      if (props.export.variable) {
        metadata[props.export.variable] = values
      } else {
        for (const key in values) {
          metadata[key] = values[key]
        }
      }

      result = replaceFrontMatter(result, metadata)
    }

    return result
  }
}

function getFrontMatter(markdown) {
  const lines = markdown.split('\n')

  if (delimiterRegExp.test(lines[0])) {
    let line = 0
    while (++line < lines.length && !delimiterRegExp.test(lines[line])) {}

    return yaml.load(lines.slice(1, line).join('\n')) || {}
  } else {
    return {}
  }
}

function replaceFrontMatter(markdown, metadata) {
  const lines = markdown.split('\n')

  if (delimiterRegExp.test(lines[0])) {
    let line = 0
    while (++line < lines.length && !delimiterRegExp.test(lines[line])) {}

    return `---\n${yaml.dump(metadata)}---\n${lines.slice(line + 1).join('\n')}`
  } else {
    return `---\n${yaml.dump(metadata)}---\n\n${markdown}`
  }
}
