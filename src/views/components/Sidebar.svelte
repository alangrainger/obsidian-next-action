<script lang="ts">
  import { slide } from 'svelte/transition'
  import type { State } from '../view-types'
  import { Task } from '../../classes/task'
  import type DoPlugin from '../../main'

  interface Props {
    state: State;
    plugin: DoPlugin;
  }

  let { state, plugin }: Props = $props()

  let activeTask = $derived(state.tasks[state.activeIndex])

  const updateDb = () => {
    console.log('Updating DB from sidebar')
    const task = new Task(plugin.tasks).initFromRow(activeTask)
    task.update()
  }

  const toggleSidebar = () => state.sidebar.open = !state.sidebar.open
</script>

<button onclick={toggleSidebar}>Toggle Sidebar</button>

{#if state.sidebar.open && state.activeIndex > -1}
    <aside bind:this={state.sidebar.element} transition:slide={{ duration: 300, axis: 'x' }} class="gtd-sidebar">
        <!-- Sidebar content -->
        <div class="setting-item" style="display:block;">
            <div class="setting-item-name">Task</div>
            <!--<div class="setting-item-description"></div>-->
            <input type="text" spellcheck="false" bind:value={state.tasks[state.activeIndex].text} oninput={updateDb}>
            <p>{state.tasks[state.activeIndex].text}</p>
        </div>
    </aside>
{/if}
