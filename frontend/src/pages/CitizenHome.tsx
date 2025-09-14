import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CitizenHome() {
  return (
    <div className="space-y-8">
      <section className="relative rounded-xl overflow-hidden border bg-gradient-to-br from-primary/10 to-emerald-500/10">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_20%,rgba(99,102,241,.2),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,.2),transparent_40%)]" />
        <div className="relative p-8 md:p-12">
          <motion.h1 className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Report. Track. Resolve.
          </motion.h1>
          <motion.p className="mt-2 text-muted-foreground max-w-2xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>
            Empower your community by reporting issues and tracking their resolution in real-time.
          </motion.p>
          <motion.div className="mt-6 flex gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>
            <Link to="/report" className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90">
              Report an issue <ArrowRight size={16} />
            </Link>
            <Link to="/issues" className="inline-flex items-center gap-2 px-4 h-10 rounded-md border hover:bg-accent">
              Browse issues
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}