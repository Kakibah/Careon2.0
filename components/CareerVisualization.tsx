'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2, Info, Zap } from 'lucide-react';

interface CareerVisualizationProps {
  roadmap: any;
}

export default function CareerVisualization({ roadmap }: CareerVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !roadmap) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Prepare Data
    const nodes: any[] = [{ id: "User", type: "root", label: roadmap.profileAnalysis.analysis.substring(0, 20) + "..." }];
    const links: any[] = [];

    // Add Career Nodes
    roadmap.careerPaths.forEach((path: any, i: number) => {
      nodes.push({ id: path.title, type: "career", label: path.title, data: path });
      links.push({ source: "User", target: path.title });

      // Add Skill Nodes for this career
      const skillSet = roadmap.skillsRequired.find((s: any) => s.careerTitle === path.title);
      if (skillSet) {
        [...skillSet.technical.slice(0, 3), ...skillSet.soft.slice(0, 2)].forEach(skill => {
          const skillId = `skill-${skill}-${path.title}`;
          nodes.push({ id: skillId, type: "skill", label: skill, parent: path.title });
          links.push({ source: path.title, target: skillId });
        });
      }
    });

    // Add Roadmap Nodes
    const roadmapStages = [
      { id: "M1-3", label: "Months 1-3", data: roadmap.developmentRoadmap.months1_3 },
      { id: "M4-6", label: "Months 4-6", data: roadmap.developmentRoadmap.months4_6 },
      { id: "M7-9", label: "Months 7-9", data: roadmap.developmentRoadmap.months7_9 },
      { id: "M10-12", label: "Months 10-12", data: roadmap.developmentRoadmap.months10_12 }
    ];

    roadmapStages.forEach((stage, i) => {
      nodes.push({ id: stage.id, type: "roadmap", label: stage.label, data: stage.data });
      if (i === 0) {
        links.push({ source: "User", target: stage.id });
      } else {
        links.push({ source: roadmapStages[i-1].id, target: stage.id });
      }
    });

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Draw Links
    const link = svg.append("g")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    // Draw Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => setSelectedNode(d));

    // Node Circles
    node.append("circle")
      .attr("r", (d: any) => {
        if (d.type === "root") return 30;
        if (d.type === "career") return 25;
        if (d.type === "roadmap") return 20;
        return 15;
      })
      .attr("fill", (d: any) => {
        if (d.type === "root") return "#10b981";
        if (d.type === "career") return "#3b82f6";
        if (d.type === "roadmap") return "#6366f1";
        return "#94a3b8";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "cursor-pointer hover:brightness-110 transition-all");

    // Node Labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 0)
      .attr("y", (d: any) => (d.type === "skill" ? 25 : 35))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#475569")
      .attr("class", "pointer-events-none select-none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, [roadmap]);

  return (
    <div className={`relative bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100] m-0 rounded-none' : 'h-[600px]'}`}>
      <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
        <div className="bg-slate-900 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Interactive Career Map</span>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Root
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-blue-500" /> Career
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-indigo-500" /> Roadmap
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      <svg 
        ref={svgRef} 
        viewBox="0 0 800 600" 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-24 right-6 bottom-6 w-80 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-y-auto z-20"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg leading-tight">{selectedNode.label}</h3>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {selectedNode.type === 'career' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">{selectedNode.data.whyFit}</p>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salary</h4>
                  <p className="text-sm font-bold text-emerald-600">{selectedNode.data.salaryRange.entry} - {selectedNode.data.salaryRange.experienced}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Responsibilities</h4>
                  <ul className="text-xs space-y-1">
                    {selectedNode.data.responsibilities.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span className="text-slate-600">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedNode.type === 'roadmap' && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Milestones</h4>
                <ul className="space-y-3">
                  {selectedNode.data.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                      <Zap className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0" />
                      <span className="text-xs font-medium text-indigo-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedNode.type === 'skill' && (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">This skill is essential for the <span className="font-bold text-blue-600">{selectedNode.parent}</span> career path.</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Info className="w-4 h-4 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 italic">Focus on building practical projects that demonstrate your proficiency in {selectedNode.label}.</p>
                </div>
              </div>
            )}

            {selectedNode.type === 'root' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">{roadmap.profileAnalysis.analysis}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedNode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Click nodes to explore connections
          </p>
        </div>
      )}
    </div>
  );
}
