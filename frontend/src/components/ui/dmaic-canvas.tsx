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
  varying vec2 vUv;
  void main(){
    vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
  }
`

const FRAG = `
  ${NOISE_GLSL}
  uniform float uTime;
  varying vec2 vUv;

  void main(){
    vec2 uv=vUv;
    float t=uTime*0.25;

    // Domain-warped noise layers
    float n1=snoise(vec3(uv*2.5,t));
    float n2=snoise(vec3(uv*4.0+n1*0.4,t+1.7));
    float n3=snoise(vec3(uv*1.8+n2*0.3,t*0.6+3.1));

    // Stage colors: blue, purple, green, gold
    vec3 c1=vec3(0.357,0.553,0.933); // #5b8dee
    vec3 c2=vec3(0.486,0.431,0.961); // #7c6ef5
    vec3 c3=vec3(0.133,0.773,0.369); // #22c55e
    vec3 c4=vec3(0.941,0.706,0.161); // #f0b429

    float s=uTime*0.07;
    float w1=0.5+0.5*sin(s);
    float w2=0.5+0.5*sin(s+2.09);
    float w3=0.5+0.5*sin(s+4.19);

    vec3 col=mix(c1,c2,clamp(n1*0.5+0.5,0.,1.));
    col=mix(col,c3,clamp(n2*0.5+0.5,0.,1.)*w2*0.6);
    col=mix(col,c4,clamp(n3*0.5+0.5,0.,1.)*w3*0.25);

    // Radial vignette
    float vign=smoothstep(0.85,0.2,length(uv-0.5)*1.4);

    float alpha=(abs(n1)*0.055+abs(n2)*0.035+0.02)*vign;
    alpha*=(w1*0.5+0.5);

    gl_FragColor=vec4(col,clamp(alpha,0.,0.18));
  }
`

export function DMAICCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || window.innerWidth
    const h = mount.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(1)
    renderer.setSize(w, h)
    renderer.setClearColor(0, 0)
    mount.appendChild(renderer.domElement)

    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    })
    scene.add(new THREE.Mesh(geo, mat))

    // Floating orbs (Points)
    const orbCount = 60
    const orbPos = new Float32Array(orbCount * 3)
    for (let i = 0; i < orbCount; i++) {
      orbPos[i * 3]     = (Math.random() - 0.5) * 2
      orbPos[i * 3 + 1] = (Math.random() - 0.5) * 2
      orbPos[i * 3 + 2] = 0
    }
    const orbGeo = new THREE.BufferGeometry()
    orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3))
    const orbMat = new THREE.PointsMaterial({
      color: '#7c6ef5',
      size: 0.006,
      transparent: true,
      opacity: 0.5,
    })
    scene.add(new THREE.Points(orbGeo, orbMat))

    let frameId: number
    let t = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      t += 0.001
      mat.uniforms.uTime.value = t
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = mount.clientWidth || window.innerWidth
      const nh = mount.clientHeight || window.innerHeight
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      geo.dispose(); mat.dispose()
      orbGeo.dispose(); orbMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
