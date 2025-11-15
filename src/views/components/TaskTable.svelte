<script lang="ts">
  import NoteLink from './NoteLink.svelte'
  import Sidebar from './Sidebar.svelte'
  import Checkbox from './Checkbox.svelte'

  import { onDestroy, onMount } from 'svelte'
  import type DoPlugin from '../../main'
  import type { State } from '../view-types'
  import { DatabaseEvent, dbEvents } from '../../classes/database-events'
  import type { Task } from '../../classes/task.svelte'
  import {moment} from '../../functions'

  interface Props {
    plugin: DoPlugin;
  }

  let {
    plugin
  }: Props = $props()

  let state: State = $state({
    activeId: 0,
    tasks: [],
    sidebar: {
      open: true,
      element: undefined
    }
  })

  /**
   * Refresh the list of tasks
   */
  export function refresh () {
    console.log('Refresh task list')
    state.tasks = plugin.tasks.getActiveTasks()
  }

  function toggleSidebar (selectedTask: Task) {
    if (state.activeId === selectedTask.id && state.sidebar.open) {
      state.sidebar.open = false
      state.activeId = 0
    } else {
      state.sidebar.open = true
      state.activeId = selectedTask.id
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
  })
</script>

<div class="gtd-view">
    <Sidebar {state}/>
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
        {#each state.tasks as task}
            <tr onclick={() => toggleSidebar(task)}>
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
