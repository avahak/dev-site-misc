import * as d3 from "d3";

const TestScene: React.FC = () => {
    const width = 1000;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 20;
    const data = d3.ticks(-2, 2, 50).map(Math.sin);
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data) as [number, number], [height - marginBottom, marginTop]);
    const line = d3.line((_, i) => x(i), y);
    return (
        <svg width={width} height={height}>
            <path fill="none" stroke="red" strokeWidth="1.5" d={line(data) ?? undefined} />
            <g fill="white" stroke="red" strokeWidth="1.5">
                {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
            </g>
        </svg>
    );
}

const GeoScene: React.FC = () => {
    const width = 1000;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 20;
    const data = d3.ticks(-2, 2, 200).map(Math.sin);
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data) as [number, number], [height - marginBottom, marginTop]);
    const line = d3.line((_, i) => x(i), y);
    return (
        <svg width={width} height={height}>
            <path fill="none" stroke="yellow" strokeWidth="1.5" d={line(data) ?? undefined} />
            <g fill="white" stroke="yellow" strokeWidth="1.5">
                {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
            </g>
        </svg>
    );
}

export { GeoScene, TestScene };