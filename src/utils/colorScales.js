import * as d3 from 'd3';

export const getPublicationColorScale = () => {
  // Color scheme based on publication categories
  const categoryColors = {
    'Towards Data Science': '#3182bd', // Data Science - blue
    'UX Collective': '#6baed6',        // Design - light blue
    'The Startup': '#9ecae1',          // Business - pale blue
    'The Writing Cooperative': '#e6550d', // Writing - orange
    'Data Driven Investor': '#fd8d3c',    // Investment - light orange
    'Better Humans': '#31a354',           // Self Improvement - green
    'Better Marketing': '#74c476',        // Marketing - light green
    // Default colors for other publications
    'default': '#969696'
  };

  return (publication) => categoryColors[publication] || categoryColors.default;
};

// Scale for node sizes based on metrics
export const getNodeSizeScale = (nodes, metric) => {
  const values = nodes.map(node => node[metric]);
  return d3.scaleSqrt() // Using sqrt scale for better size distribution
    .domain([d3.min(values), d3.max(values)])
    .range([20, 60]) // Adjust min and max radius to be more reasonable
    .clamp(true); // Prevent extreme values
};

// Scale for edge thickness
export const getLinkWidthScale = (links, metric) => {
  const values = links.map(link => link[metric]);
  return d3.scaleLinear()
    .domain([d3.min(values), d3.max(values)])
    .range([1, 8]); // min and max stroke width
};