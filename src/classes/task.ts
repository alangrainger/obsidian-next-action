import { ListItemCache } from 'obsidian'
import DoPlugin from '../main'
import { CacheUpdate } from './tasks'

export enum TaskStatus {
  Todo = ' ',
  Complete = 'x'
}

interface MarkdownTaskElements {
  id?: number,
  status: string,
  text: string
}

export class Task {
  plugin: DoPlugin
  id: number
  status: string
  text: string

  constructor (plugin: DoPlugin) {
    this.plugin = plugin
  }

  valid () {
    return !!this.id
  }

  complete () {
    return this.status === TaskStatus.Complete
  }

  initFromListItem (item: ListItemCache, cacheUpdate: CacheUpdate) {
    // Get the original task line
    const lines = cacheUpdate.data.split('\n')
    const parsed = this.parseMarkdownTaskString(lines[item.position.start.line] || '')
    if (!parsed) {
      // Not able to find a task in this line
      return
    }

    if (!parsed.id) {
      // TODO: Need to get a new id
      parsed.id = 0
    }
    this.id = parsed.id
    this.status = parsed.status
    this.text = parsed.text
  }

  /**
   * Parse a markdown task line into its component elements
   */
  parseMarkdownTaskString (text: string): MarkdownTaskElements | false {
    // Get task ID
    let id
    [id, text] = getAndRemoveMatch(text, new RegExp(`\\^${this.plugin.settings.taskBlockPrefix}(\\d+)\\s*$`))
    id = id ? parseInt(id, 10) : undefined

    // Get status
    let status
    [status, text] = getAndRemoveMatch(text, /^\s*-\s+\[(.)]\s+/)

    if (status && text) {
      return {
        id, status, text
      }
    } else {
      return false
    }
  }
}

/**
 * Find a matching element via regex, and remove
 * the entire search query from the original string
 */
function getAndRemoveMatch (text: string, regex: RegExp): [string | undefined, string] {
  let foundText
  const match = text.match(regex)
  if (match) {
    foundText = match[1]
    text = text.replace(regex, '')
  }
  return [foundText, text.trim()]
}
