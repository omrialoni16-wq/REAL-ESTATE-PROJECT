import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import "./Charts.css";

// Bar chart: average property price per city.
// Receives the live list of properties (already fetched from the backend in
// App.jsx) and aggregates it client-side with d3 before drawing.
const PriceByCityChart = ({ properties = [], topN = 8 }) => {
  const svgRef = useRef(null);

  // Average price per city, sorted high → low and capped to the busiest cities
  // so the axis stays readable.
  const data = useMemo(() => {
    const byCity = d3.rollup(
      properties.filter((p) => p && p.city && typeof p.price === "number"),
      (rows) => d3.mean(rows, (r) => r.price),
      (p) => p.city,
    );

    return Array.from(byCity, ([city, avgPrice]) => ({ city, avgPrice }))
      .sort((a, b) => b.avgPrice - a.avgPrice)
      .slice(0, topN);
  }, [properties, topN]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render before redrawing

    if (data.length === 0) return;

    const width = 520;
    const height = 320;
    const margin = { top: 20, right: 20, bottom: 70, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.city))
      .range([0, innerWidth])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.avgPrice)])
      .nice()
      .range([innerHeight, 0]);

    // X axis (city names, angled so longer names don't overlap)
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    // Y axis (price, abbreviated with k/M)
    g.append("g").call(
      d3.axisLeft(y).ticks(6).tickFormat((v) => d3.format("~s")(v)),
    );

    const tooltip = d3.select(".chart-tooltip");

    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.city))
      .attr("width", x.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("rx", 6)
      .attr("fill", "#3498db")
      .on("mousemove", (event, d) => {
        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 28}px`)
          .html(`<strong>${d.city}</strong><br/>₪${Math.round(d.avgPrice).toLocaleString()}`);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0))
      .transition()
      .duration(700)
      .attr("y", (d) => y(d.avgPrice))
      .attr("height", (d) => innerHeight - y(d.avgPrice));
  }, [data]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Average Price by City</h3>
      {data.length === 0 ? (
        <p className="chart-empty">No data to chart yet.</p>
      ) : (
        <svg ref={svgRef} className="chart-svg" role="img" aria-label="Average price per city bar chart" />
      )}
    </div>
  );
};

export default PriceByCityChart;
