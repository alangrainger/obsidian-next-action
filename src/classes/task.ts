import { type ListItemCache } from 'obsidian'
import { type CacheUpdate, Tasks } from './tasks'
import { moment } from '../functions'

export enum TaskStatus {
  Todo = ' ',
  Complete = 'x'
}

export enum TaskEmoji {
  Due = '📅',
  Created = '➕',
  Scheduled = '⏳'
}

export interface TaskRow {
  id: number,
  status: string,
  text: string,
  path: string,
  /**
   * If the task is not present in any note
   */
  orphaned: number,
  created: string
}

const DEFAULT_ROW: TaskRow = {
  id: 0,
  status: ' ',
  text: '',
  path: '',
  orphaned: 0,
  created: ''
}

interface MarkdownTaskElements {
  id?: number,
  status: string,
  text: string
}

export class Task {
  tasks: Tasks

  id = 0
  status = ' '
  text = ''
  path = ''
  orphaned = 0

  constructor (tasks: Tasks) {
    this.tasks = tasks
  }

  reset () {
    this.setData(DEFAULT_ROW)
  }

  valid () {
    return !!this.id
  }

  getData (): TaskRow {
    return {
      id: this.id,
      status: this.status,
      text: this.text,
      path: this.path,
      orphaned: this.orphaned,
      created: moment().format()
    }
  }

  setData (data: TaskRow) {
    // @ts-ignore
    Object.keys(data).forEach(key => this[key] = data[key])
  }

  completed () {
    return this.status === TaskStatus.Complete
  }

  initFromId (id: number) {
    const row = this.tasks.db.getRow(id)
    if (row) {
      this.initFromRow(row)
    } else {
      this.reset()
    }
    return this
  }

  initFromRow (row: TaskRow) {
    this.setData(row)
    return this
  }

  initFromListItem (item: ListItemCache, cacheUpdate: CacheUpdate, blacklistIds: number[]) {
    // Get the original task line
    const lines = cacheUpdate.data.split('\n')
    const originalLine = lines[item.position.start.line] || ''
    const parsed = parseMarkdownTaskString(originalLine, this.tasks.plugin.settings.taskBlockPrefix)
    if (!parsed) {
      // Not able to find a task in this line
      return this
    }

    // Check if this ID has already been used on this page (duplicate ID)
    if (parsed.id && blacklistIds.includes(parsed.id)) parsed.id = 0

    const record = Object.assign({}, DEFAULT_ROW)
    record.created = moment().format()

    // Get task from DB
    if (parsed.id) {
      // Existing row
      const existing = this.tasks.db.getRow(parsed.id)
      if (existing) Object.assign(record, existing)
    }
    // Update the record from the parsed data
    Object.assign(record, {
      status: parsed.status,
      text: parsed.text,
      path: cacheUpdate.file.path,
      orphaned: 0
    })
    const result = this.tasks.db.insertOrUpdate(record)
    if (!result) {
      // Unable to insert data - reset to default data
      // Which will show task.valid() === false
      this.reset()
      return this
    } else {
      this.setData(result)
    }
    return this
  }

  generateMarkdownTask () {
    const parts = [
      `- [${this.status}]`,
      this.text,
      '^' + this.tasks.plugin.settings.taskBlockPrefix + this.id
    ]
    return parts.join(' ')
  }

  /**
   * Updates the database and markdown note
   */
  async update () {
    if (!this.id || !this.path) {
      console.log('Unable to update task ' + this.text + ' as there is no ID or path for it')
      return
    }
    // Update the DB with the new data
    this.tasks.db.update(this.getData())
    // Queue the task for update in the original markdown note
    this.tasks.addTaskToUpdateQueue(this.id)
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

/**
 * Parse a markdown task line into its component elements
 */
function parseMarkdownTaskString (text: string, prefix: string): MarkdownTaskElements | false {
  // Get task ID
  let id
  [id, text] = getAndRemoveMatch(text, new RegExp(`\\^${prefix}(\\d+)\\s*$`))
  id = id ? parseInt(id, 10) : undefined

  // Get status
  let status
  [status, text] = getAndRemoveMatch(text, /^\s*-\s+\[(.)]\s+/)

  if (status && text) {
    return {
      id,
      status,
      text
    }
  } else {
    return false
  }
}
