import type { Task } from '../classes/task.svelte'

export interface State {
  activeIndex: number;
  tasks: Task[];
  sidebar: {
    open: boolean;
    fields: {
      text: HTMLInputElement;
    }
  }
  viewIsActive: boolean;
}
