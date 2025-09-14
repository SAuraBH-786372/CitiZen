type Callback = () => void

const waiters = new Map<string, Set<Callback>>()

export function waitForUser(userId: string, cb: Callback) {
  const set = waiters.get(userId) ?? new Set<Callback>()
  set.add(cb)
  waiters.set(userId, set)
  return () => {
    const s = waiters.get(userId)
    if (!s) return
    s.delete(cb)
    if (s.size === 0) waiters.delete(userId)
  }
}

export function notifyUser(userId: string) {
  const set = waiters.get(userId)
  if (!set || set.size === 0) return
  for (const cb of Array.from(set)) {
    try { cb() } catch {}
  }
  waiters.delete(userId)
}