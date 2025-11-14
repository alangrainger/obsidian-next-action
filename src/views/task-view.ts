import { ItemView, WorkspaceLeaf } from 'obsidian'
import Table from './components/TaskTable.svelte'
import type GtdPlugin from '../main'
import { mount, unmount } from 'svelte'

export const GTD_VIEW_TYPE = 'gtd-view'

export class GtdView extends ItemView {
  plugin: GtdPlugin
  table?: ReturnType<typeof Table>

  constructor (leaf: WorkspaceLeaf, plugin: GtdPlugin) {
    super(leaf)
    this.plugin = plugin
  }

  getViewType () {
    return GTD_VIEW_TYPE
  }

  getDisplayText () {
    return 'GTD view'
  }

  async onOpen () {
    this.table = mount(Table, {
      target: this.contentEl,
      props: {
        plugin: this.plugin
      }
    })
  }

  update () {
    this.table?.updateView()
  }

  async onClose () {
    console.log('unmounting')
    return unmount(Table)
  }
}
