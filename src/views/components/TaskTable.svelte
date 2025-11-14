<script lang="ts">
  import NoteLink from './NoteLink.svelte'
  import Sidebar from './Sidebar.svelte'

  import { onDestroy, onMount } from 'svelte'
  import type DoPlugin from '../../main'
  import { TaskStatus } from '../../classes/task'
  import type { State } from '../view-types'
  import { DatabaseEvent, dbEvents } from '../../classes/database-events'

  interface Props {
    plugin: DoPlugin;
  }

  let {
    plugin
  }: Props = $props();

  let state = $state({
    activeIndex: -1,
    tasks: [],
    sidebar: {
      open: true,
      element: undefined
    }
  } as State)

  function updateView () {
    console.log('Updating view')
    state.tasks = []
    plugin.tasks.db.rows()
      .filter(row => !row.orphaned && row.status !== TaskStatus.Complete)
      .forEach(row => state.tasks.push(row))
  }

  function updateCheckbox () {
  }

  // Update tasks list when tasks DB changes
  dbEvents.on(DatabaseEvent.TasksExternalChange, updateView)

  // Immediately update the tasks list on component mount
  onMount(updateView)

  onDestroy(() => {
    dbEvents.off(DatabaseEvent.TasksExternalChange, updateView)
  })
</script>

<div class="gtd-view">
    <Sidebar state={state} plugin={plugin}></Sidebar>
    <table class="gtd-table">
        <thead>
        <tr>
            <th></th>
            <th>Task</th>
            <th>Note</th>
            <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {#each state.tasks as row}
            <tr onclick={() => {state.activeIndex = state.tasks.findIndex(x => x.id === row.id)}}>
                <td class="gtd-table-checkbox">
                    <!--<Checkbox checked={row.status === 'x'} on:update={(event) => { updateCheckbox(row, event.detail) }}/>-->
                </td>
                <td class="gtd-table-task">
                    <div class="gtd-table-clip">
                        {row.text}
                    </div>
                </td>
                <td class="gtd-table-note">
                    <div class="gtd-table-clip">
                        <NoteLink app={plugin.app} path={row.path}/>
                    </div>
                </td>
                <td>{row.status}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
