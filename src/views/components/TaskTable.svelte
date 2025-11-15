<script lang="ts">
  import NoteLink from './NoteLink.svelte'
  import Sidebar from './Sidebar.svelte'
  import Checkbox from './Checkbox.svelte'

  import { onDestroy, onMount, tick } from 'svelte'
  import type DoPlugin from '../../main'
  import type { State } from '../view-types'
  import { DatabaseEvent, dbEvents } from '../../classes/database-events'
  import {moment} from '../../functions'
  import { DoTaskView, type TaskScopes } from '../task-view'

  interface Props {
    view: DoTaskView
    plugin: DoPlugin
    scopes: TaskScopes
  }

  let {
    view,
    plugin,
    scopes
  }: Props = $props()

  let state: State = $state({
    activeIndex: 0,
    tasks: [],
    sidebar: {
      open: false,
      fields: {
        text: null
      }
    },
    viewIsActive: false
  })

  $effect(() => {
    if (state.viewIsActive) {
      console.log('view is active')
      scopes.tasklist.enable()
      refresh() // Refresh the task list when the view becomes active
    } else {
      console.log('view is NOT active')
      view.disableAllScopes()
    }
  })

  async function openActiveRow () {
    state.sidebar.open = true
    await tick()
    state.sidebar.fields.text.focus()
  }

  // Register hotkeys that apply to both tasklist and sidebar views
  scopes.tasklistAndSidebar.registerHotkey([], 'Escape', () => {
    state.sidebar.open = false
  })
  scopes.tasklistAndSidebar.registerHotkey([], 'ArrowUp', () => {
    state.activeIndex = Math.max(state.activeIndex - 1, 0)
  })
  scopes.tasklistAndSidebar.registerHotkey([], 'ArrowDown', () => {
    state.activeIndex = Math.min(state.activeIndex + 1, state.tasks.length - 1)
  })

  // Hotkeys for tasklist only
  scopes.tasklist.registerHotkey([], 'Enter', openActiveRow)
  scopes.tasklist.registerHotkey([], ' ', () => {
    state.tasks[state.activeIndex].toggle()
  })

  /**
   * Refresh the list of tasks
   */
  export function refresh () {
    console.log('Refresh task list')
    state.tasks = plugin.tasks.getActiveTasks()
  }

  export function setActive (isActive: boolean) {
    state.viewIsActive = isActive
  }

  function clickRow (index: number) {
    if (state.activeIndex === index && state.sidebar.open) {
      state.sidebar.open = false
    } else {
      state.activeIndex = index
      openActiveRow()
    }
  }

  // Update tasks list when tasks DB changes
  dbEvents.on(DatabaseEvent.TasksExternalChange, refresh)

  onMount(() => {
    // I have no idea why, but refresh() would never actually do anything here
    // unless I put it after a small timeout
    setTimeout(() => { refresh() }, 200)
  })

  onDestroy(() => {
    dbEvents.off(DatabaseEvent.TasksExternalChange, refresh)
    view.disableAllScopes()
  })
</script>

<div class="gtd-view">
    <Sidebar {state} {scopes}/>
    <table class="gtd-table">
        <thead>
        <tr>
            <th></th>
            <th>Task</th>
            <th>Note</th>
            <th>Created</th>
        </tr>
        </thead>
        <tbody>
        {#each state.tasks as task, index}
            <tr onclick={() => clickRow(index)} class:do-task-active-row={index === state.activeIndex}>
                <td class="gtd-table-checkbox">
                    <Checkbox {task}/>
                </td>
                <td class="gtd-table-task">
                    <div class="gtd-table-clip">
                        {task.text}
                    </div>
                </td>
                <td class="gtd-table-note">
                    <div class="gtd-table-clip">
                        <NoteLink app={plugin.app} path={task.path}/>
                    </div>
                </td>
                <td>{moment(task.created).format('D MMM YYYY')}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
