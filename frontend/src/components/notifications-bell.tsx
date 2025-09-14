import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell } from 'lucide-react'
import api from '@/lib/api'
import type { Notification } from '@/types'
import { Button } from './ui/button'

export default function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>([])
  const prevUnread = useRef(0)

  const fetchItems = async () => {
    try {
      const res = await api.get('/notifications')
      setItems(res.data)
    } catch {
      // ignore for now
    }
  }

  useEffect(() => {
    fetchItems()
    const id = setInterval(fetchItems, 30_000) // poll every 30s
    return () => clearInterval(id)
  }, [])

  const unread = useMemo(() => items.filter(i => !i.read).length, [items])

  useEffect(() => {
    if (unread > prevUnread.current) {
      // trigger bounce by toggling a data-attr
      const el = document.getElementById('notif-bell')
      if (el) {
        el.dataset.bump = '1'
        setTimeout(() => { if (el) el.dataset.bump = '0' }, 500)
      }
    }
    prevUnread.current = unread
  }, [unread])

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setItems(prev => prev.map(i => i._id === id ? { ...i, read: true } : i))
    } catch {}
  }

  const markAll = async () => {
    try {
      await Promise.all(items.filter(i => !i.read).map(i => api.patch(`/notifications/${i._id}/read`)))
      setItems(prev => prev.map(i => ({ ...i, read: true })))
    } catch {}
  }

  return (
    <div className="relative">
      <div 
        id="notif-bell" 
        data-bump="0" 
        className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30 backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-purple-500/25 data-[bump='1']:animate-bounce"
        onClick={() => setOpen(v => !v)}
        aria-label="Notifications"
      >
        <Bell size={20} className="text-white group-hover:text-purple-100 transition-colors duration-300" />
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1000]">
          {/* Backdrop with optional blur/dim */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          {/* Panel anchored top-right; slide down + fade in */}
          <div className="absolute right-4 top-20 w-80 max-w-[90vw] rounded-xl border border-purple-200/50 bg-white/95 backdrop-blur-xl text-gray-800 shadow-2xl overflow-hidden
                          animate-[notifIn_220ms_cubic-bezier(0.2,0.8,0.2,1)]">
            <div className="p-4 text-sm font-semibold border-b border-purple-200/30 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
              <span className="text-gray-800 flex items-center gap-2">
                <Bell size={16} className="text-purple-600" />
                Notifications
              </span>
              <button onClick={markAll} className="relative overflow-hidden text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="relative z-10 font-medium">Mark all read</span>
              </button>
            </div>
            <div className="max-h-80 overflow-auto">
              {items.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell size={32} className="text-gray-300 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">No notifications yet</div>
                  <div className="text-xs text-gray-400 mt-1">You're all caught up!</div>
                </div>
              ) : (
                items.map(n => (
                  <div key={n._id} className={`p-4 text-sm border-b border-gray-100 last:border-0 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200 cursor-pointer ${n.read ? 'opacity-60' : 'bg-gradient-to-r from-purple-50/30 to-pink-50/30'}`} onClick={() => markRead(n._id)}>
                    <div className="font-medium text-gray-800 mb-1">{n.message}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}></span>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <style>{`
              @keyframes ripple { to { transform: scale(3); opacity: 0 } }
              @keyframes notifIn { from { opacity: 0; transform: translateY(-6px);} to { opacity: 1; transform: translateY(0);} }
            `}</style>
          </div>
        </div>,
        document.getElementById('portal-root') as HTMLElement
      )}
    </div>
  )
}