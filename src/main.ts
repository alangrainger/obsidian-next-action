import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS, DoPluginSettings, DoSettingTab } from './settings'
import { Tasks } from './classes/tasks'

export default class DoPlugin extends Plugin {
  tasks: Tasks
  settings: DoPluginSettings

  async onload () {
    // Settings
    await this.loadSettings()
    this.addSettingTab(new DoSettingTab(this.app, this))

    // Init classes
    this.tasks = new Tasks(this)

    this.registerEvent(this.app.metadataCache.on('changed', (file, data, cache) => {
      this.tasks.processTasksFromCacheUpdate({ file, data, cache })
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
