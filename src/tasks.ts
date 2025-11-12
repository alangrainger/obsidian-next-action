import { CachedMetadata, TFile } from 'obsidian'

export function processTasksFromCacheUpdate (file: TFile, data: string, cache: CachedMetadata) {

  console.log('file', file)
  console.log('data', data)
  console.log('cache', cache)

  const tasks = cache.listItems?.filter(x => x.task) || []
  console.log(tasks)
}
