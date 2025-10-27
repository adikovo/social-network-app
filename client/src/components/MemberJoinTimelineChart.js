import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MemberJoinTimelineChart = ({ data }) => {
    const svgRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            return;
        }

        //clear previous rendering
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 60, right: 60, bottom: 100, left: 80 };
        const containerWidth = containerRef.current.offsetWidth;
        const width = containerWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //parse dates
        const parsedData = data.map(d => ({
            date: new Date(d.date + '-01'),
            joins: d.joins
        })).sort((a, b) => a.date - b.date);

        //x scale for dates
        const xScale = d3.scaleTime()
            .domain(d3.extent(parsedData, d => d.date))
            .range([0, width]);

        //y scale for join counts
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.joins)])
            .nice()
            .range([height, 0]);

        //create area path
        const area = d3.area()
            .x(d => xScale(d.date))
            .y0(height)
            .y1(d => yScale(d.joins))
            .curve(d3.curveMonotoneX);

        //create line path
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.joins))
            .curve(d3.curveMonotoneX);

        //add area
        g.append("path")
            .datum(parsedData)
            .attr("fill", "rgba(37, 99, 235, 0.1)")
            .attr("d", area);

        //add line
        g.append("path")
            .datum(parsedData)
            .attr("fill", "none")
            .attr("stroke", "#2563eb")
            .attr("stroke-width", 3)
            .attr("d", line);

        //add circles for data points
        g.selectAll(".dot")
            .data(parsedData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.joins))
            .attr("r", 5)
            .attr("fill", "#2563eb")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        //add x axis
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%b %Y"));

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-size", "12px")
            .attr("fill", "#333");

        //add y axis
        const yAxis = d3.axisLeft(yScale)
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
            .text("New Members");

        //add title
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .attr("fill", "#333")
            .text("Member Join Timeline");

        //add x axis label
        g.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 80})`)
            .attr("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text("Month");

    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No join data available yet.</p>
            </div>
        );
    }

    return (
        <div
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

export default MemberJoinTimelineChart;
