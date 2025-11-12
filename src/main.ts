import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS, MyPluginSettings } from './settings'
import { processTasksFromCacheUpdate } from './tasks'

export default class TasklistPlugin extends Plugin {
  settings: MyPluginSettings

  async onload () {
    await this.loadSettings()

    this.registerEvent(this.app.metadataCache.on('changed', (file, data, cache) => {
      processTasksFromCacheUpdate({ file, data, cache })
    }))
  }

  onunload () {

  }

  async loadSettings () {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings () {
    await this.saveData(this.settings)
  }
}
