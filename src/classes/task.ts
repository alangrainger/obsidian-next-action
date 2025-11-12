import { ListItemCache } from 'obsidian'
import { CacheUpdate } from '../tasks'

export class Task {
  id: number

  initFromListItem (item: ListItemCache, cacheUpdate: CacheUpdate) {
    // Check for existing task ID
    const matchId = item.id?.match(/^do(\d+)$/)
    if (matchId) this.id = +matchId[1]

    // Get the original task line
    const lines = cacheUpdate.data.split('\n')
    console.log(this.id)
    console.log(lines[item.position.start.line])
  }
}
