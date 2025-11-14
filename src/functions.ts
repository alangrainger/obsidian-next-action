import { moment as momentModule } from 'obsidian'

// Fix for moment Typescript error when imported from Obsidian:
// "Type typeof moment has no call signatures"
export const moment = (momentModule as any).default || momentModule

export function debug (message: string) {
  if (process.env.NODE_ENV === 'development') console.log(message)
}
