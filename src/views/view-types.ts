import type { TaskRow } from '../classes/task'

export interface State {
  activeIndex: number;
  tasks: TaskRow[];
  sidebar: {
    open: boolean;
    element?: HTMLElement;
  }
}
