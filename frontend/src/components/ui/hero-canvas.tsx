import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NOISE_GLSL = `
  vec3 _m3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 _m4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 _p4(vec4 x){return _m4(((x*34.)+1.)*x);}
  vec4 _ti(vec4 r){return 1.79284291-.85373472*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=_m3(i);
    vec4 p=_p4(_p4(_p4(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=_ti(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`

const VERT = `
  ${NOISE_GLSL}
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main(){
    vNormal=normal;
    float d=snoise(position*2.0+uTime*0.45)*0.22;
    vec3 np=position+normal*d;
    vPos=np;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.0);
  }
`

const FRAG = `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform vec3 uLight;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main(){
    vec3 n=normalize(vNormal);
    vec3 l=normalize(uLight-vPos);
    float diff=max(dot(n,l),0.0);
    float fresnel=pow(1.0-abs(dot(n,vec3(0.,0.,1.))),2.5);
    vec3 col=mix(uColor,uColor2,fresnel)*(diff*0.65+0.35);
    gl_FragColor=vec4(col,0.55+fresnel*0.3);
  }
`

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 4.5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0, 0)
    mount.appendChild(renderer.domElement)

    const lightPos = new THREE.Vector3(3, 2, 5)

    // Main icosahedron mesh
    const geo = new THREE.IcosahedronGeometry(1.5, 72)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:   { value: 0 },
        uLight:  { value: lightPos },
        uColor:  { value: new THREE.Color('#5b8dee') },
        uColor2: { value: new THREE.Color('#7c6ef5') },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      wireframe: true,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(2.6, -0.2, 0)
    scene.add(mesh)

    // Second smaller sphere — inner glow ring
    const geo2 = new THREE.IcosahedronGeometry(0.9, 4)
    const mat2 = new THREE.MeshBasicMaterial({
      color: '#5b8dee',
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
    const mesh2 = new THREE.Mesh(geo2, mat2)
    mesh2.position.copy(mesh.position)
    scene.add(mesh2)

    // Floating accent particles
    const pCount = 140
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 9
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: '#5b8dee', size: 0.022, transparent: true, opacity: 0.45 })
    scene.add(new THREE.Points(pGeo, pMat))

    let frameId: number
    let t = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      t += 0.0008
      mat.uniforms.uTime.value = t
      mesh.rotation.y += 0.0018
      mesh.rotation.x += 0.0008
      mesh2.rotation.y -= 0.002
      mesh2.rotation.z += 0.001
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      lightPos.set(x * 6 + 2, y * 4, 6)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      geo.dispose(); mat.dispose()
      geo2.dispose(); mat2.dispose()
      pGeo.dispose(); pMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <>
      {/* THREE.js mount — full viewport width, breaks out of max-w container */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          pointerEvents: 'none',
        }}
      />

      {/* Animated grid lines — also full width */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100vw', pointerEvents: 'none', overflow: 'hidden' }}>
        {[20, 50, 80].map((top, i) => (
          <div key={`h${i}`} style={{
            position: 'absolute', top: `${top}%`, left: 0, right: 0,
            height: '1px', background: 'var(--hl)', opacity: 0.4,
            transform: 'scaleX(0)', transformOrigin: '50% 50%',
            animation: `hcDrawX 900ms cubic-bezier(.22,.61,.36,1) forwards ${150 + i * 130}ms`,
          }} />
        ))}
        {[20, 50, 80].map((left, i) => (
          <div key={`v${i}`} style={{
            position: 'absolute', left: `${left}%`, top: 0, bottom: 0,
            width: '1px', background: 'var(--hl)', opacity: 0.3,
            transform: 'scaleY(0)', transformOrigin: '50% 0%',
            animation: `hcDrawY 1000ms cubic-bezier(.22,.61,.36,1) forwards ${530 + i * 120}ms`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes hcDrawX{0%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:0.4}}
        @keyframes hcDrawY{0%{transform:scaleY(0);opacity:0}100%{transform:scaleY(1);opacity:0.3}}
      `}</style>
    </>
  )
}
