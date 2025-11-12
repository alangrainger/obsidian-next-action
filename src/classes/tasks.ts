import { Task } from './task'
import DoPlugin from '../main'
import { CachedMetadata, TFile } from 'obsidian'

export interface CacheUpdate {
  file: TFile,
  data: string,
  cache: CachedMetadata
}

export class Tasks {
  plugin: DoPlugin

  constructor (plugin: DoPlugin) {
    this.plugin = plugin
  }

  processTasksFromCacheUpdate (cacheUpdate: CacheUpdate) {
    // console.log('file', cacheUpdate.file)
    // console.log('data', cacheUpdate.data)
    // console.log('cache', cacheUpdate.cache)

    (cacheUpdate.cache.listItems?.filter(x => x.task) || [])
      .forEach(item => {
        const task = new Task(this.plugin)
        task.initFromListItem(item, cacheUpdate)
        console.log(task)

      })

  }
}
