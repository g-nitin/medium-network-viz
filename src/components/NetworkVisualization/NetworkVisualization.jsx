// src/components/NetworkVisualization/NetworkVisualization.jsx

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './NetworkVisualization.css';
import { useResizeObserver } from '../../hooks/useResizeObserver';

const NetworkVisualization = ({ data, metric, onNodeSelect }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!dimensions || !data) return;

    const { width, height } = dimensions;

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create links
    const links = g.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d[metric]) / 2);

    // Create nodes group
    const nodes = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles to nodes
    nodes.append("circle")
      .attr("r", 20)
      .attr("fill", "#69b3a2")
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        // Highlight selected node
        d3.selectAll("circle")
          .attr("fill", "#69b3a2")
          .attr("stroke-width", 0);
        
        d3.select(event.target)
          .attr("fill", "#1a73e8")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);

        onNodeSelect(d);
      })
      .on("mouseover", function() {
        d3.select(this)
          .attr("fill", "#1a73e8")
          .attr("filter", "url(#glow)");
      })
      .on("mouseout", function(event, d) {
        // Only reset color if not selected
        const isSelected = d3.select(this).attr("stroke-width") === "2";
        if (!isSelected) {
          d3.select(this)
            .attr("fill", "#69b3a2")
            .attr("filter", null);
        }
      });

    // Add labels to nodes
    nodes.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .attr("font-size", "10px")
      .attr("pointer-events", "none");

    // Add node values
    nodes.append("text")
      .text(d => d[metric].toFixed(0))
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", "12px")
      .attr("fill", "white")
      .attr("pointer-events", "none");

    // Update positions on each tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodes.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, dimensions, metric, onNodeSelect]);

  // Drag behavior
  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  return (
    <div ref={wrapperRef} className="visualization-wrapper">
      <svg ref={svgRef} className="network-visualization">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default NetworkVisualization;