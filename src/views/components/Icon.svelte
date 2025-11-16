<script lang="ts">
  import { setIcon } from 'obsidian'
  import { onMount } from 'svelte'

  interface Props {
    icon: string
  }

  let { icon }: Props = $props()
  let element: HTMLElement

  onMount(() => {
    setIcon(element, icon)
  })
</script>

<span bind:this={element}></span>
