import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
/// <reference types="@react-three/fiber" />

function applyGradient(geometry: THREE.BufferGeometry) {
  const positions = geometry.attributes.position
  const colors = new Float32Array(positions.count * 3)
  const colorTop = new THREE.Color('#00FFB2')
  const colorBot = new THREE.Color('#00D4FF')
  let minY = Infinity, maxY = -Infinity
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i)
    const t = maxY === minY ? 0.5 : (y - minY) / (maxY - minY)
    const c = colorBot.clone().lerp(colorTop, t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

function LogoMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.35
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12
  })

  const scale = 1 / 60
  const cx = 100, cy = 98

  const hexOuterShape = useMemo(() => {
    const outer = [[100,18],[168,58],[168,138],[100,178],[32,138],[32,58]]
    const inner = [[100,34],[152,64],[152,124],[100,154],[48,124],[48,64]]
    const shape = new THREE.Shape()
    outer.forEach(([x,y], i) => {
      const sx = (x-cx)*scale, sy = -(y-cy)*scale
      i === 0 ? shape.moveTo(sx,sy) : shape.lineTo(sx,sy)
    })
    shape.closePath()
    const hole = new THREE.Path()
    inner.forEach(([x,y], i) => {
      const sx = (x-cx)*scale, sy = -(y-cy)*scale
      i === 0 ? hole.moveTo(sx,sy) : hole.lineTo(sx,sy)
    })
    hole.closePath()
    shape.holes.push(hole)
    return shape
  }, [])

  const hexInnerFill = useMemo(() => {
    const inner = [[100,34],[152,64],[152,124],[100,154],[48,124],[48,64]]
    const shape = new THREE.Shape()
    inner.forEach(([x,y], i) => {
      const sx = (x-cx)*scale, sy = -(y-cy)*scale
      i === 0 ? shape.moveTo(sx,sy) : shape.lineTo(sx,sy)
    })
    shape.closePath()
    return shape
  }, [])

  const bracketLeft = useMemo(() => {
    const pts = [[68,72],[50,98],[68,124]], w = 0.07
    const s = new THREE.Shape()
    s.moveTo((pts[0][0]-cx)*scale-w, -(pts[0][1]-cy)*scale)
    s.lineTo((pts[1][0]-cx)*scale-w, -(pts[1][1]-cy)*scale)
    s.lineTo((pts[2][0]-cx)*scale-w, -(pts[2][1]-cy)*scale)
    s.lineTo((pts[2][0]-cx)*scale+w, -(pts[2][1]-cy)*scale)
    s.lineTo((pts[1][0]-cx)*scale+w, -(pts[1][1]-cy)*scale)
    s.lineTo((pts[0][0]-cx)*scale+w, -(pts[0][1]-cy)*scale)
    s.closePath(); return s
  }, [])

  const bracketRight = useMemo(() => {
    const pts = [[132,72],[150,98],[132,124]], w = 0.07
    const s = new THREE.Shape()
    s.moveTo((pts[0][0]-cx)*scale-w, -(pts[0][1]-cy)*scale)
    s.lineTo((pts[1][0]-cx)*scale-w, -(pts[1][1]-cy)*scale)
    s.lineTo((pts[2][0]-cx)*scale-w, -(pts[2][1]-cy)*scale)
    s.lineTo((pts[2][0]-cx)*scale+w, -(pts[2][1]-cy)*scale)
    s.lineTo((pts[1][0]-cx)*scale+w, -(pts[1][1]-cy)*scale)
    s.lineTo((pts[0][0]-cx)*scale+w, -(pts[0][1]-cy)*scale)
    s.closePath(); return s
  }, [])

  const slash = useMemo(() => {
    const x1=(114-cx)*scale, y1=-(72-cy)*scale
    const x2=(86-cx)*scale,  y2=-(124-cy)*scale
    const w=0.07, dx=x2-x1, dy=y2-y1
    const len=Math.sqrt(dx*dx+dy*dy)
    const nx=-dy/len*w, ny=dx/len*w
    const s = new THREE.Shape()
    s.moveTo(x1+nx,y1+ny); s.lineTo(x2+nx,y2+ny)
    s.lineTo(x2-nx,y2-ny); s.lineTo(x1-nx,y1-ny)
    s.closePath(); return s
  }, [])

  const eHex = { depth: 0.2, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.025, bevelSegments: 4 }
  const eFill = { depth: 0.2, bevelEnabled: false }
  const eSym = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3 }

  const hexGeo = useMemo(() => { const g = new THREE.ExtrudeGeometry(hexOuterShape, eHex); applyGradient(g); return g }, [hexOuterShape])
  const fillGeo = useMemo(() => { const g = new THREE.ExtrudeGeometry(hexInnerFill, eFill); applyGradient(g); return g }, [hexInnerFill])
  const symGeos = useMemo(() => [bracketLeft, bracketRight, slash].map(shape => { const g = new THREE.ExtrudeGeometry(shape, eSym); applyGradient(g); return g }), [bracketLeft, bracketRight, slash])

  return (
    <group ref={groupRef}>
      <pointLight position={[3, 3, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={1.5} color="#aaffee" />
      <mesh geometry={hexGeo}>
        <meshStandardMaterial vertexColors metalness={0.7} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={fillGeo}>
        <meshStandardMaterial color="#030810" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {symGeos.map((geo, i) => (
        <mesh key={i} geometry={geo} position={[0, 0, 0.18]}>
          <meshStandardMaterial vertexColors metalness={0.7} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.3, 4], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 4]} intensity={2} color="#ffffff" />
        <Environment preset="city" />
        <LogoMesh />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  )
}