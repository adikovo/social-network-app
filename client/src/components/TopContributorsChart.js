import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopContributorsChart = ({ data }) => {
    const svgRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            return;
        }

        //clear previous rendering
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 60, right: 60, bottom: 120, left: 60 };
        const containerWidth = containerRef.current.offsetWidth;
        const width = containerWidth - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //x scale for contributors names
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.authorName))
            .range([0, width])
            .padding(0.5);

        // y scale for post counts
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);

        // color scale for post counts
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(data, d => d.count)]);

        //show info when hovering over a bar
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "1000");

        // create bars
        const maxBarWidth = 100;
        const barWidth = Math.min(xScale.bandwidth(), maxBarWidth);
        const barOffset = (xScale.bandwidth() - barWidth) / 2;

        const bars = g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.authorName) + barOffset)
            .attr("y", d => yScale(d.count))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(d.count))
            .attr("fill", d => colorScale(d.count))
            .attr("rx", 4)
            .attr("cursor", "pointer");

        // add hover effect
        bars.on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.8);

            // show tooltip
            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.authorName}</strong><br/>Posts: ${d.count}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 1);

                //hide tooltip
                tooltip.style("opacity", 0);
            });

        //add labels on bars
        g.selectAll(".label")
            .data(data)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", d => xScale(d.authorName) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.count) - 8)
            .attr("dy", "0")
            .attr("text-anchor", "middle")
            .attr("fill", "#333")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text(d => d.count);

        //add x axis with contributor names
        const xAxis = d3.axisBottom(xScale);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("font-size", "12px")
            .attr("fill", "#333")
            .attr("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        //add y axis with post counts
        const yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(d3.format("d"));

        g.append("g")
            .call(yAxis)
            .selectAll("text")
            .attr("font-size", "13px")
            .attr("fill", "#333");

        //add y axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text("Number of Posts");

        //add title
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .attr("fill", "#333")
            .text("Top Contributors");

        //cleanup function
        return () => {
            d3.selectAll(".tooltip").remove();
        };
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="chart-container" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No data available for Top Contributors</p>
            </div>
        );
    }

    return (
        <div
            className="chart-container"
            ref={containerRef}
            style={{
                width: '100%',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
            }}
        >
            <svg ref={svgRef} style={{ display: 'block', width: '100%', height: 'auto' }}></svg>
        </div>
    );
};

export default TopContributorsChart;
