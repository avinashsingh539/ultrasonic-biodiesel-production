import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function UltrasonicVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    const width = Math.min(containerRef.current.clientWidth, 300)
    const height = width

    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 3

    // Create a sphere for the liquid
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      emissive: 0x003366,
      shininess: 100,
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // Create wave animation using custom shader
    const waveGeometry = new THREE.IcosahedronGeometry(0.8, 5)
    const waveMaterial = new THREE.MeshPhongMaterial({
      color: 0x0066ff,
      emissive: 0x0033ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
    const waves = new THREE.Mesh(waveGeometry, waveMaterial)
    scene.add(waves)

    // Lighting
    const light1 = new THREE.PointLight(0x00ffff, 1, 100)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x0066ff, 0.8, 100)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Animation loop
    let animationId: number
    let time = 0
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.01

      // Animate sphere
      sphere.rotation.x += 0.002
      sphere.rotation.y += 0.003
      sphere.scale.z = 1 + Math.sin(time) * 0.1

      // Animate waves
      waves.rotation.x += 0.005
      waves.rotation.y += 0.008
      const scale = 1 + Math.sin(time * 2) * 0.15
      waves.scale.set(scale, scale, scale)
      waves.material.opacity = 0.3 + Math.sin(time * 1.5) * 0.2

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      waveGeometry.dispose()
      waveMaterial.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-[300px] mx-auto" />
}

export default function UltrasonicWorkingSection() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const cavitationSteps = [
    { title: 'Bubble Formation', desc: 'Ultrasonic waves create low-pressure zones that form tiny bubbles in the liquid' },
    { title: 'Bubble Growth', desc: 'Bubbles grow as more liquid evaporates into them during compression cycles' },
    { title: 'Collapse', desc: 'High-pressure zones collapse the bubbles violently, creating shock waves' },
    { title: 'Energy Release', desc: 'Collapse releases immense energy that breaks molecular bonds and accelerates reactions' },
  ]

  return (
    <section ref={ref} className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-14 text-center"
        >
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-glow">Ultrasonic Cavitation Mechanism</h2>
          <p className="font-inter text-sm sm:text-base md:text-lg text-white/60">How acoustic cavitation accelerates the transesterification reaction</p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-12">
          {/* Visualization */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 glow-border"
          >
            <UltrasonicVisualization />
          </motion.div> */}
          <img src="http://localhost:8000/OIP.webp" width="100%" className='rounded-lg' alt="avinash bsdk" />

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-8">Cavitation Process</h3>

            {cavitationSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: 0.3 + idx * 0.15, duration: 0.6 }}
                className="mb-6"
              >
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 font-bold text-lg"
                  >
                    {idx + 1}
                  </motion.div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{step.title}</h4>
                    <p className="text-white/70 text-sm sm:text-base">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
        >
          {[
            { title: 'Reduced Reaction Time', desc: 'Reaction completed in 20–30 min vs 2–3 hrs by conventional stirring', icon: '⚡' },
            { title: 'Enhanced Mass Transfer', desc: 'Cavitation improves contact between oil and methanol phases', icon: '🌊' },
            { title: 'Lower Energy Input', desc: 'Reaction proceeds at 50°C, lower than conventional heating', icon: '🔋' },
            { title: 'Improved Yield', desc: 'Observed biodiesel yield of ~90–95% at lab scale', icon: '📈' },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.8 + idx * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 glow-border text-center"
            >
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">{benefit.title}</h4>
              <p className="text-white/70 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Frequency Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 sm:mt-12 glass rounded-xl sm:rounded-2xl p-5 sm:p-8 glow-border"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Lab Equipment Parameters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            <div>
              <p className="text-white/60 mb-2">Reaction Temperature</p>
              <p className="text-3xl font-bold text-blue-400">50°C</p>
              <p className="text-white/50 text-sm mt-2">Maintained throughout reaction</p>
            </div>
            <div>
              <p className="text-white/60 mb-2">Reaction Duration</p>
              <p className="text-3xl font-bold text-cyan-400">20–30 min</p>
              <p className="text-white/50 text-sm mt-2">vs 2–3 hrs conventional</p>
            </div>
            <div>
              <p className="text-white/60 mb-2">Feedstock Volume</p>
              <p className="text-3xl font-bold text-purple-400">50 mL</p>
              <p className="text-white/50 text-sm mt-2">Castor oil (lab scale)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
