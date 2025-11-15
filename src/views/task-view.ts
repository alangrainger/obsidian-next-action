import { ItemView, Scope, WorkspaceLeaf } from 'obsidian'
import Table from './components/TaskTable.svelte'
import type GtdPlugin from '../main'
import { mount, unmount } from 'svelte'

export const GTD_VIEW_TYPE = 'gtd-view'

export class GtdView extends ItemView {
  plugin: GtdPlugin
  table?: ReturnType<typeof Table>
  scopeActive = false

  constructor (leaf: WorkspaceLeaf, plugin: GtdPlugin) {
    super(leaf)
    this.plugin = plugin
    this.scope = new Scope(this.app.scope)
    this.scope.register([], 'Escape', (_: KeyboardEvent) => {
      console.log('Escape pressed by scope')
      return false // Return false to preventDefault automatically
    })
  }

  getViewType () {
    return GTD_VIEW_TYPE
  }

  getDisplayText () {
    return 'GTD view'
  }

  enableScope () {
    if (!this.scopeActive && this.scope) this.app.keymap.pushScope(this.scope)
  }

  disableScope () {
    if (this.scope) this.app.keymap.popScope(this.scope)
  }

  async onOpen () {
    this.table = mount(Table, {
      target: this.contentEl,
      props: {
        plugin: this.plugin
      }
    })
  }

  async onClose () {
    console.log('unmounting')
    this.disableScope()
    return unmount(Table)
  }
}
