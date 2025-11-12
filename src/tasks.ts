import { CachedMetadata, TFile } from 'obsidian'
import { Task } from './classes/task'

export interface CacheUpdate {
  file: TFile, data: string, cache: CachedMetadata
}

export function processTasksFromCacheUpdate (cacheUpdate: CacheUpdate) {

  console.log('file', cacheUpdate.file)
  console.log('data', cacheUpdate.data)
  console.log('cache', cacheUpdate.cache)

  const tasks = cacheUpdate.cache.listItems?.filter(x => x.task) || []
  const task = new Task()
  task.initFromListItem(tasks[1], cacheUpdate)
}
