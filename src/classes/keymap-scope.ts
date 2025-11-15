import { App, type Modifier, Scope } from 'obsidian'
import type DoPlugin from '../main'

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

  registerHotkey (modifiers: Modifier[], key: string, callback: () => void) {
    this.scope.register(modifiers, key, _ => {
      callback()
      // Return false to preventDefault
      return false
    })
  }
}
