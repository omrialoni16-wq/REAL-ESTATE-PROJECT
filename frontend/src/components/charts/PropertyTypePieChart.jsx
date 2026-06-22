import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import "./Charts.css";

// Pie/donut chart: distribution of listings by property type.
// Aggregates the live properties list with d3 and renders an animated donut.
const PropertyTypePieChart = ({ properties = [] }) => {
  const svgRef = useRef(null);

  const data = useMemo(() => {
    const byType = d3.rollup(
      properties.filter((p) => p && p.type),
      (rows) => rows.length,
      (p) => p.type,
    );

    return Array.from(byType, ([type, count]) => ({ type, count })).sort(
      (a, b) => b.count - a.count,
    );
  }, [properties]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (data.length === 0) return;

    const width = 520;
    const height = 320;
    const radius = Math.min(width, height) / 2 - 10;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.type))
      .range(["#3498db", "#2ecc71", "#e67e22", "#9b59b6", "#e74c3c", "#1abc9c"]);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.count);

    const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
    const total = d3.sum(data, (d) => d.count);
    const tooltip = d3.select(".chart-tooltip");

    const slices = g
      .selectAll(".slice")
      .data(pie(data))
      .join("path")
      .attr("class", "slice")
      .attr("fill", (d) => color(d.data.type))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .on("mousemove", (event, d) => {
        const pct = ((d.data.count / total) * 100).toFixed(1);
        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 28}px`)
          .html(`<strong>${d.data.type}</strong><br/>${d.data.count} listings (${pct}%)`);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    // Animate the arcs growing in
    slices
      .transition()
      .duration(700)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t));
      });

    // Center label = total listings
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.1em")
      .attr("class", "donut-center-number")
      .text(total);
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.3em")
      .attr("class", "donut-center-label")
      .text("listings");
  }, [data]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Listings by Property Type</h3>
      {data.length === 0 ? (
        <p className="chart-empty">No data to chart yet.</p>
      ) : (
        <div className="pie-wrap">
          <svg ref={svgRef} className="chart-svg" role="img" aria-label="Property type distribution donut chart" />
          <ul className="pie-legend">
            {data.map((d, i) => (
              <li key={d.type}>
                <span
                  className="legend-swatch"
                  style={{
                    background: [
                      "#3498db",
                      "#2ecc71",
                      "#e67e22",
                      "#9b59b6",
                      "#e74c3c",
                      "#1abc9c",
                    ][i % 6],
                  }}
                />
                {d.type} ({d.count})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyTypePieChart;
