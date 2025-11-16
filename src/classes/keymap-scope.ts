import { App, type Modifier, Scope } from 'obsidian'
import type DoPlugin from '../main'

type HotkeyConfig = [key: string, modifiers: Modifier[], callback: () => void]

export class KeymapScope {
  app: App
  plugin: DoPlugin
  scope: Scope
  isActive = false

  constructor (plugin: DoPlugin, parent: Scope) {
    this.plugin = plugin
    this.app = plugin.app
    this.scope = new Scope(parent)
  }

  enable () {
    if (!this.isActive) {
      this.isActive = true
      this.app.keymap.pushScope(this.scope)
    }
  }

  disable () {
    if (this.isActive) {
      this.isActive = false
      this.app.keymap.popScope(this.scope)
    }
  }

  addHotkey (...[key, modifiers, callback]: HotkeyConfig) {
    this.scope.register(modifiers, key, _ => {
      callback()
      // Return false to preventDefault
      return false
    })
  }

  /**
   * Adds an array of hotkey configurations
   */
  addHotkeys (hotkeys: HotkeyConfig[]) {
    hotkeys.forEach(hotkey => this.addHotkey(...hotkey))
  }
}
