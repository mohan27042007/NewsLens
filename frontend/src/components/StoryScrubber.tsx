import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useBriefingStore } from '../store/useBriefingStore';
import { PlayCircle } from 'lucide-react';

export const StoryScrubber: React.FC = () => {
  const { timeline, setActiveArticleId } = useBriefingStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!timeline || timeline.length === 0 || !svgRef.current) return;

    const width = 200;
    const height = Math.max(400, timeline.length * 80);
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove(); // Clear previous render

    svg.attr("width", width).attr("height", height);

    const yScale = d3.scaleTime()
      .domain([
        new Date(timeline[0].date), 
        new Date(timeline[timeline.length - 1].date)
      ])
      .range([40, height - 40]);

    // Draw main vertical line
    svg.append("line")
      .attr("x1", 30)
      .attr("y1", 40)
      .attr("x2", 30)
      .attr("y2", height - 40)
      .attr("stroke", "#333")
      .attr("stroke-width", 2);

    // Timeline groups
    const nodes = svg.selectAll(".node")
      .data(timeline)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(30, ${yScale(new Date(d.date))})`);

    // Draw sentiment-colored circles
    nodes.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.sentiment_score > 0 ? "#10B981" : d.sentiment_score < 0 ? "#EF4444" : "#6B7280")
      .attr("stroke", "#0A0A0A")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
         setActiveArticleId(d.primary_article_id);
      });

    // Draw tiny date text
    nodes.append("text")
      .attr("x", 15)
      .attr("y", 4)
      .text(d => {
        const date = new Date(d.date);
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
      })
      .attr("fill", "#888")
      .attr("font-size", "10px")
      .style("font-family", "sans-serif");

    // The Scrubber Line (hidden initially or at top)
    const scrubberGroup = svg.append("g").attr("class", "scrubber").style("opacity", 0);
    
    scrubberGroup.append("line")
      .attr("x1", 10)
      .attr("y1", 0)
      .attr("x2", 50)
      .attr("y2", 0)
      .attr("stroke", "#E8372A")
      .attr("stroke-width", 3);
      
  }, [timeline, setActiveArticleId]);

  const handlePlayArc = () => {
    if (!timeline.length || !svgRef.current || isPlaying) return;
    setIsPlaying(true);
    
    const svg = d3.select(svgRef.current);
    const scrubberGroup = svg.select(".scrubber");
    const height = Math.max(400, timeline.length * 80);
    
    const yScale = d3.scaleTime()
      .domain([new Date(timeline[0].date), new Date(timeline[timeline.length - 1].date)])
      .range([40, height - 40]);

    scrubberGroup
      .style("opacity", 1)
      .attr("transform", `translate(0, 40)`)
      .transition()
      .duration(15000)
      .ease(d3.easeLinear)
      .attrTween("transform", function() {
        return function(t) {
          const currentY = yInterpolator(t);
          
          // Check collision with nodes to trigger active article ID
          const currentTime = yScale.invert(currentY);
          
          // Find closest event
          const closest = timeline.reduce((prev, curr) => {
            return (Math.abs(new Date(curr.date).getTime() - currentTime.getTime()) < Math.abs(new Date(prev.date).getTime() - currentTime.getTime()) ? curr : prev);
          });
          
          setActiveArticleId(closest.primary_article_id);
          
          return `translate(0, ${currentY})`;
        };
      })
      .on("end", () => {
        setIsPlaying(false);
        setTimeout(() => scrubberGroup.transition().duration(500).style("opacity", 0), 2000);
      });

    const yInterpolator = d3.interpolate(40, height - 40);
  };

  if(!timeline || timeline.length === 0) {
      return <div className="p-4 border border-[#222] rounded-lg bg-[#111] border-dashed text-sm text-[#555] text-center italic py-10">Waiting for timeline events...</div>
  }

  return (
    <div className="w-full relative">
      <div className="flex justify-center mb-6">
        <button 
          onClick={handlePlayArc}
          disabled={isPlaying}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg text-white w-full justify-center ${isPlaying ? "bg-red-800 opacity-70 cursor-not-allowed" : "bg-primary hover:bg-red-600 hover:shadow-red-900/50"}`}
        >
          <PlayCircle className={`w-5 h-5 ${isPlaying ? "animate-spin" : ""}`} />
          <span>{isPlaying ? 'Playing...' : 'Play Arc'}</span>
        </button>
      </div>

      <div className="overflow-y-auto no-scrollbar max-h-[500px] flex justify-center border-l border-[#222] ml-4 pl-2">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};
