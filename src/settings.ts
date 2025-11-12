import { App, PluginSettingTab, Setting } from 'obsidian'
import MyPlugin from './main'

export interface DoPluginSettings {
  taskBlockPrefix: string;
}

export const DEFAULT_SETTINGS: DoPluginSettings = {
  taskBlockPrefix: 'do'
}

export class DoSettingTab extends PluginSettingTab {
  plugin: MyPlugin

  constructor (app: App, plugin: MyPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display (): void {
    const { containerEl } = this

    containerEl.empty()

    new Setting(containerEl)
      .setName('Task block prefix')
      .setDesc('')
      .addText(text => text
        .setPlaceholder('do')
        .setValue(this.plugin.settings.taskBlockPrefix)
        .onChange(async (value) => {
          this.plugin.settings.taskBlockPrefix = value
          await this.plugin.saveSettings()
        }))
  }
}
