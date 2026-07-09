"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/themeStore";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((rid) => { newPulse[rid] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const SPEED = 12; // degrees per second
    let rafId: number;
    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs !== null) {
        const delta = ts - lastTs;
        setRotationAngle((prev) => (prev + (SPEED * delta) / 1000) % 360);
      }
      lastTs = ts;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    const desired = 270 - targetAngle;

    setRotationAngle((current) => {
      const cur = ((current % 360) + 360) % 360;
      const tgt = ((desired % 360) + 360) % 360;
      let delta = tgt - cur;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      return cur + delta;
    });

    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    setIsSnapping(true);
    snapTimerRef.current = setTimeout(() => setIsSnapping(false), 700);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 192;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":   return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending":     return "text-white bg-black/40 border-white/50";
      default:            return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Center orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>

          {/* Orbit ring */}
          <div className={`absolute w-96 h-96 rounded-full border ${isLight ? "border-gray-400" : "border-white/10"}`} />

          {/* Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                  transition: isSnapping
                    ? 'transform 700ms cubic-bezier(0.32,0.72,0,1), opacity 600ms ease'
                    : 'opacity 600ms ease',
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Glow aura */}
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 transform
                  ${isExpanded
                    ? isLight
                      ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-400/40 scale-150"
                      : "bg-white text-black border-white shadow-lg shadow-white/30 scale-150"
                    : isRelated
                    ? isLight
                      ? "bg-gray-700 text-white border-gray-500 animate-pulse"
                      : "bg-white/50 text-black border-white animate-pulse"
                    : isLight
                    ? "bg-gray-800 text-white border-gray-600"
                    : "bg-black/60 text-white border-white/40"}
                `}>
                  <Icon size={20} />
                </div>

                {/* Label */}
                <div className={`
                  absolute top-14 whitespace-nowrap
                  text-xs font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded
                    ? isLight ? "text-gray-900 scale-125" : "text-white scale-125"
                    : isLight ? "text-gray-700" : "text-white/70"}
                `}>
                  {item.title}
                </div>

                {/* Expanded card */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: '80px', zIndex: 300 }}
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50" />
                      <Card className="w-72 bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                              {item.status === "completed" ? "ЗАВЕРШЁН"
                                : item.status === "in-progress" ? "В ПРОЦЕССЕ"
                                : "ОЖИДАНИЕ"}
                            </Badge>
                            <span className="text-xs font-mono text-white/50">{item.date}</span>
                          </div>
                          <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-white/80">
                          <p>{item.content}</p>

                          <div className="mt-4 pt-3 border-t border-white/10">
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className="flex items-center">
                                <Zap size={10} className="mr-1" />
                                Прогресс
                              </span>
                              <span className="font-mono">{item.energy}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.energy}%` }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                              />
                            </div>
                          </div>

                          {item.relatedIds.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/10">
                              <div className="flex items-center mb-2">
                                <Link size={10} className="text-white/70 mr-1" />
                                <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                                  Связанные этапы
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.relatedIds.map((relatedId) => {
                                  const rel = timelineData.find((i) => i.id === relatedId);
                                  return (
                                    <Button
                                      key={relatedId}
                                      variant="secondary"
                                      size="sm"
                                      className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                                      onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                    >
                                      {rel?.title}
                                      <ArrowRight size={8} className="ml-1 text-white/60" />
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
