// src/components/NetworkVisualization/NetworkVisualization.jsx

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./NetworkVisualization.css";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { schemeSet3, schemePaired, schemeDark2, schemeTableau10 } from "d3";
import {
  interpolateGreens,
  interpolateBlues,
  interpolateOranges,
  interpolatePurples,
  interpolateReds,
} from "d3";

const NetworkVisualization = ({ data, metric, onNodeSelect }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  useEffect(() => {
    if (!dimensions || !data) return;

    const { width, height } = dimensions;

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create scales for node sizes and edge weights based on the selected metric
    const nodeScale = d3
      .scaleSqrt()
      .domain([
        d3.min(data.nodes, (d) => d[metric]),
        d3.max(data.nodes, (d) => d[metric]),
      ])
      .range([30, 60]); // Adjust min/max node sizes as needed

    const linkScale = d3
      .scaleLinear()
      .domain([
        d3.min(data.links, (d) => d[metric] || 0),
        d3.max(data.links, (d) => d[metric] || 0),
      ])
      .range([1, 8]); // Adjust min/max link widths as needed

    // Create zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Create force simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Update links with dynamic width based on metric
    const links = g
      .append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => linkScale(d[metric] || 0));

    // Update nodes with dynamic radius based on metric
    const nodes = g
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles to nodes with dynamic radius
    nodes
      .append("circle")
      .attr("r", (d) => nodeScale(d[metric]))
      .attr("fill", (d) => {
        // Define color gradient options
        const colorGradients = [
          interpolateGreens,
          interpolateBlues,
          interpolateOranges,
          interpolatePurples,
          interpolateReds,
        ];

        // Select one gradient for this render
        const selectedGradient =
          colorGradients[Math.floor(Math.random() * colorGradients.length)];

        // Create sequential color scale
        const colorScale = d3
          .scaleSequential()
          .domain(d3.extent(data.nodes, (node) => node[metric]))
          .interpolator(selectedGradient);

        return colorScale(d[metric]);
      })
      .attr("cursor", "pointer")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("click", (event, d) => {
        d3.selectAll("circle").attr("stroke-width", 1);
        d3.select(event.target).attr("stroke", "#fff").attr("stroke-width", 2);
        onNodeSelect(d);
      });

    nodes
      .append("text")
      .text((d) => Math.round(d[metric]))
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", "10px")
      .attr("fill", function (d) {
        // Get the background color of the parent circle
        const bgColor = d3
          .select(this.parentNode)
          .select("circle")
          .attr("fill");
        // Convert the color to RGB
        const rgb = d3.color(bgColor).rgb();
        // Calculate luminance
        const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
        // Return white for dark backgrounds, black for light backgrounds
        return luminance > 0.5 ? "#000" : "#fff";
      })
      .attr("pointer-events", "none");

    // Add labels with metric values
    nodes
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => nodeScale(d[metric]) + 15)
      .attr("font-size", "10px")
      .attr("pointer-events", "none");

    // Update positions on each tick
    simulation
      .on("tick", () => {
        links
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
      })
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance((d) => {
            // Adjust link distance based on connected nodes' sizes
            const sourceSize = nodeScale(d.source[metric]);
            const targetSize = nodeScale(d.target[metric]);
            return sourceSize + targetSize + 50; // Add padding
          })
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force(
        "collision",
        d3.forceCollide().radius((d) => nodeScale(d[metric]) + 5)
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

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

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  return (
    <div ref={wrapperRef} className="visualization-wrapper">
      <svg ref={svgRef} className="network-visualization">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default NetworkVisualization;
