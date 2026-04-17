import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FaProjectDiagram, FaTimes } from 'react-icons/fa'

interface FlowNode {
  id: string
  label: string
  icon: string
  color: string
  inputs: string[]
  outputs: string[]
  explanation: string
  col: number
  row: number
  type: 'process' | 'product' | 'waste'
}

const nodes: FlowNode[] = [
  {
    id: 'reactor', label: 'Reactor & Mixing\n(Ultrasonic)', icon: '⚡', color: 'from-blue-500 to-cyan-500', type: 'process',
    inputs: ['Castor Oil — 50 mL', 'Methanol — 12 mL', 'NaOH Catalyst — 5 gm'],
    outputs: ['Reaction mixture (FAME + Glycerol + unreacted methanol)'],
    explanation: 'Castor oil, methanol, and NaOH are combined in the ultrasonic reactor at 50°C. Ultrasonic cavitation creates micro-bubbles that collapse violently, generating intense local energy that accelerates the transesterification reaction from hours to 20–30 minutes.',
    col: 1, row: 1,
  },
  {
    id: 'settling1', label: 'Gravity Settling (1)', icon: '⏱️', color: 'from-purple-500 to-blue-500', type: 'process',
    inputs: ['Reaction mixture from reactor'],
    outputs: ['Top layer: Raw Biodiesel', 'Bottom layer: Glycerol'],
    explanation: 'The reaction mixture is transferred to a separating funnel and allowed to settle for 30–60 minutes. Due to density difference, glycerol (denser) sinks to the bottom while raw biodiesel (lighter) floats on top.',
    col: 1, row: 2,
  },
  {
    id: 'glycerol', label: 'Glycerol', icon: '🧴', color: 'from-pink-500 to-purple-500', type: 'product',
    inputs: ['Bottom layer from Gravity Settling (1)'],
    outputs: ['Glycerol byproduct (can be used in soap/cosmetics)'],
    explanation: 'Glycerol is a valuable byproduct of transesterification. It is drained from the bottom of the separating funnel. It may contain residual methanol and catalyst and can be purified for use in cosmetics, pharmaceuticals, or soap making.',
    col: 0, row: 3,
  },
  {
    id: 'rawbiodiesel', label: 'Raw Biodiesel', icon: '⛽', color: 'from-amber-500 to-yellow-500', type: 'product',
    inputs: ['Top layer from Gravity Settling (1)'],
    outputs: ['Raw FAME containing residual methanol, catalyst, soap'],
    explanation: 'The top layer after first settling is raw biodiesel (FAME — Fatty Acid Methyl Ester). It still contains impurities: residual methanol, NaOH catalyst, and soap formed as a side product. It must be washed before use.',
    col: 2, row: 3,
  },
  {
    id: 'washing', label: 'Washing Phase', icon: '💧', color: 'from-cyan-500 to-teal-500', type: 'process',
    inputs: ['Raw Biodiesel', 'Warm distilled water'],
    outputs: ['Washed biodiesel + wastewater mixture'],
    explanation: 'Warm distilled water is gently added to the raw biodiesel to dissolve and remove water-soluble impurities: residual methanol, NaOH catalyst, and soap. The wash is repeated 2–3 times until the wash water runs clear.',
    col: 2, row: 4,
  },
  {
    id: 'settling2', label: 'Gravity Settling (2)', icon: '⚖️', color: 'from-indigo-500 to-purple-500', type: 'process',
    inputs: ['Washed biodiesel + wastewater mixture'],
    outputs: ['Top: Purified Biodiesel', 'Bottom: Wastewater + excess methanol'],
    explanation: 'After washing, the mixture is again allowed to settle. The purified biodiesel (FAME) rises to the top while wastewater containing dissolved impurities and excess methanol sinks to the bottom and is drained away.',
    col: 2, row: 5,
  },
  {
    id: 'biodiesel', label: 'Final Biodiesel\n(FAME)', icon: '✅', color: 'from-green-500 to-emerald-500', type: 'product',
    inputs: ['Top layer from Gravity Settling (2)'],
    outputs: ['Purified FAME — ~90–95% yield, ~95–99% purity'],
    explanation: 'The final product is purified Fatty Acid Methyl Ester (FAME) — biodiesel. It is optionally dried at 60°C to remove residual water, then filtered. Yield is approximately 90–95% from 50 mL castor oil input.',
    col: 1, row: 6,
  },
  {
    id: 'waste', label: 'Wastewater\n+ Excess Methanol', icon: '🚰', color: 'from-red-500 to-orange-500', type: 'waste',
    inputs: ['Bottom layer from Gravity Settling (2)'],
    outputs: ['Wastewater (to be treated)', 'Methanol (can be recovered by distillation)'],
    explanation: 'The wastewater from the second settling contains dissolved impurities, soap, and excess methanol. Methanol can be recovered by distillation for reuse. The remaining wastewater must be treated before disposal as per lab safety protocols.',
    col: 3, row: 5,
  },
]

const timeline = [
  { step: 'Reactor & Mixing (Ultrasonic)', time: '20–30 min', color: 'text-blue-400' },
  { step: 'Gravity Settling (1)', time: '30–60 min', color: 'text-purple-400' },
  { step: 'Separation (Glycerol drain)', time: '5 min', color: 'text-pink-400' },
  { step: 'Washing Phase (2–3 washes)', time: '15–20 min', color: 'text-cyan-400' },
  { step: 'Gravity Settling (2)', time: '20–30 min', color: 'text-indigo-400' },
  { step: 'Total Estimated Time', time: '90–145 min', color: 'text-green-400' },
]

const metrics = [
  { label: 'Biodiesel Yield', value: '~90–95%', bar: 92, color: 'from-green-400 to-emerald-400' },
  { label: 'Purity (FAME)', value: '~95–99%', bar: 97, color: 'from-blue-400 to-cyan-400' },
  { label: 'Reaction Time', value: '20–30 min', bar: 25, color: 'from-purple-400 to-blue-400' },
  { label: 'Settling Time', value: '30–60 min', bar: 45, color: 'from-cyan-400 to-teal-400' },
]

export default function ProcessFlowSection() {
  const [inView, setInView] = useState(false)
  const [selected, setSelected] = useState<FlowNode | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const typeStyle: Record<string, string> = {
    process: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
    product: 'from-green-500/20 to-emerald-500/10 border-green-500/30',
    waste:   'from-red-500/20 to-orange-500/10 border-red-500/30',
  }

  return (
    <section ref={ref} className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-14 text-center"
        >
          <span className="section-tag"><FaProjectDiagram className="w-3 h-3" />Experiment Flow</span>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-glow">Process Flow Diagram</h2>
          <p className="font-inter text-sm sm:text-base md:text-lg text-white/50">Transesterification process flow — click any block for details</p>
          <div className="h-px w-24 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mt-6" />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-6 sm:mb-10"
        >
          {[
            { label: 'Process Step', color: 'bg-blue-500/30 border-blue-500/50' },
            { label: 'Product / Output', color: 'bg-green-500/30 border-green-500/50' },
            { label: 'Waste Stream', color: 'bg-red-500/30 border-red-500/50' },
          ].map(l => (
            <div key={l.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${l.color} text-xs font-inter text-white/70`}>
              <span className={`w-2 h-2 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </motion.div>

        {/* Flow Diagram — vertical linear layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 glow-border mb-8 sm:mb-12 overflow-x-auto"
        >
          {/* Main vertical flow */}
          <div className="flex flex-col items-center gap-0 min-w-[320px]">

            {/* Step 1: Reactor */}
            <FlowBlock node={nodes[0]} inView={inView} delay={0} onClick={setSelected} typeStyle={typeStyle} />
            <Arrow inView={inView} delay={0.15} label="Reaction mixture" />

            {/* Step 2: Settling 1 */}
            <FlowBlock node={nodes[1]} inView={inView} delay={0.2} onClick={setSelected} typeStyle={typeStyle} />

            {/* Branch: Glycerol left, Raw Biodiesel right */}
            <div className="flex items-start justify-center gap-4 md:gap-16 w-full mt-0">
              {/* Left branch — Glycerol */}
              <div className="flex flex-col items-center">
                <BranchArrow inView={inView} delay={0.35} label="Bottom layer" />
                <FlowBlock node={nodes[2]} inView={inView} delay={0.4} onClick={setSelected} typeStyle={typeStyle} small />
              </div>

              {/* Right branch — Raw Biodiesel → Washing → Settling 2 */}
              <div className="flex flex-col items-center">
                <BranchArrow inView={inView} delay={0.35} label="Top layer" />
                <FlowBlock node={nodes[3]} inView={inView} delay={0.4} onClick={setSelected} typeStyle={typeStyle} small />
                <Arrow inView={inView} delay={0.5} label="+ Distilled water" />
                <FlowBlock node={nodes[4]} inView={inView} delay={0.55} onClick={setSelected} typeStyle={typeStyle} small />
                <Arrow inView={inView} delay={0.65} label="Washed mixture" />
                <FlowBlock node={nodes[5]} inView={inView} delay={0.7} onClick={setSelected} typeStyle={typeStyle} small />

                {/* Sub-branch from Settling 2 */}
                <div className="flex items-start justify-center gap-4 md:gap-12 w-full">
                  <div className="flex flex-col items-center">
                    <BranchArrow inView={inView} delay={0.8} label="Top layer" />
                    <FlowBlock node={nodes[6]} inView={inView} delay={0.85} onClick={setSelected} typeStyle={typeStyle} small />
                  </div>
                  <div className="flex flex-col items-center">
                    <BranchArrow inView={inView} delay={0.8} label="Bottom layer" />
                    <FlowBlock node={nodes[7]} inView={inView} delay={0.85} onClick={setSelected} typeStyle={typeStyle} small />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img src="http://localhost:8000/super_2.jpeg" className="p-10 w-[69%] rounded-[69px]" />
          </div>
        </motion.div>

        {/* Timeline + Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8 glow-border"
          >
            <h3 className="font-orbitron text-base sm:text-lg font-bold mb-4 sm:mb-6 text-glow-sm">Process Timeline</h3>
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={i} className={`flex justify-between items-center ${i === timeline.length - 1 ? 'pt-3 border-t border-white/10' : 'pb-3 border-b border-white/5'}`}>
                  <span className="font-inter text-white/60 text-sm">{t.step}</span>
                  <span className={`font-orbitron text-sm font-bold ${t.color}`}>{t.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8 glow-border"
          >
            <h3 className="font-orbitron text-base sm:text-lg font-bold mb-4 sm:mb-6 text-glow-sm">Lab-Scale Performance</h3>
            <div className="space-y-5">
              {metrics.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-inter text-white/60 text-sm">{m.label}</span>
                    <span className="font-orbitron text-sm font-bold text-white/80">{m.value}</span>
                  </div>
                  <div className="w-full bg-white/8 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${m.bar}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${m.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Info Panel Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="glass-lg rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              style={{ boxShadow: '0 0 60px rgba(0,102,255,0.2)' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-xl sm:text-2xl shrink-0`}>
                    {selected.icon}
                  </div>
                  <div>
                    <h3 className="font-orbitron text-base sm:text-xl font-bold whitespace-pre-line">{selected.label}</h3>
                    <span className={`font-inter text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      selected.type === 'process' ? 'bg-blue-500/20 text-blue-400' :
                      selected.type === 'product' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{selected.type.toUpperCase()}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors p-1">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <p className="font-inter text-white/70 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{selected.explanation}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 glow-border">
                  <h4 className="font-orbitron text-xs text-blue-400 uppercase tracking-wider mb-3">Inputs</h4>
                  <ul className="space-y-2">
                    {selected.inputs.map((inp, i) => (
                      <li key={i} className="flex items-start gap-2 font-inter text-sm text-white/70">
                        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>{inp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-xl p-4 glow-border">
                  <h4 className="font-orbitron text-xs text-green-400 uppercase tracking-wider mb-3">Outputs</h4>
                  <ul className="space-y-2">
                    {selected.outputs.map((out, i) => (
                      <li key={i} className="flex items-start gap-2 font-inter text-sm text-white/70">
                        <span className="text-green-400 mt-0.5 shrink-0">▸</span>{out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function FlowBlock({ node, inView, delay, onClick, typeStyle, small = false }: {
  node: FlowNode; inView: boolean; delay: number
  onClick: (n: FlowNode) => void; typeStyle: Record<string, string>; small?: boolean
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(node)}
      className={`bg-gradient-to-br ${typeStyle[node.type]} border rounded-xl cursor-pointer text-center transition-all duration-300 hover:shadow-lg ${
        small ? 'px-3 py-2 min-w-[90px] max-w-[140px] sm:min-w-[120px] sm:max-w-[160px]' : 'px-4 py-3 min-w-[160px] max-w-[240px] sm:min-w-[200px] sm:max-w-[280px]'
      }`}
    >
      <div className={`mb-1 ${small ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>{node.icon}</div>
      <p className={`font-orbitron font-bold whitespace-pre-line leading-tight ${small ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>{node.label}</p>
    </motion.button>
  )
}

function Arrow({ inView, delay, label }: { inView: boolean; delay: number; label?: string }) {
  return (
    <div className="flex flex-col items-center my-1">
      {label && <span className="font-inter text-xs text-white/30 mb-0.5">{label}</span>}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        className="w-px h-8 bg-gradient-to-b from-blue-400 to-cyan-400 origin-top"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: delay + 0.3 }}
        className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-cyan-400"
        style={{ borderTopWidth: 6 }}
      />
    </div>
  )
}

function BranchArrow({ inView, delay, label }: { inView: boolean; delay: number; label?: string }) {
  return (
    <div className="flex flex-col items-center my-1">
      {label && <span className="font-inter text-xs text-white/30 mb-0.5">{label}</span>}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        className="w-px h-6 bg-gradient-to-b from-cyan-400/60 to-cyan-400/20 origin-top"
      />
    </div>
  )
}
