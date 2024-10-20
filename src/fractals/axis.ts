type AxisParams = {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    tMin: number;
    tMax: number;
    orientation: "horizontal"|"vertical";
    color: string;
};

function roundNumber(t: number) {
    return Math.round(t*1e12)/1e12;
}

function drawAxis(params: AxisParams) {
    params.context.strokeStyle = params.color;
    params.context.lineWidth = 1;
    params.context.fillStyle = params.color;
    params.context.font = '12px Arial';
    params.context.textAlign = (params.orientation === "horizontal") ? 'center' : 'right';
    params.context.textBaseline = (params.orientation === "horizontal") ? 'bottom' : 'middle';
    params.context.shadowColor = 'transparent';
    params.context.shadowBlur = 3;
    params.context.shadowOffsetX = 1;
    params.context.shadowOffsetY = 1;  

    const getPos = (t: number): number => {
        if (params.orientation === "horizontal")
            return (t-params.tMin)/(params.tMax-params.tMin)*params.width;
        return (params.tMax-t)/(params.tMax-params.tMin)*params.height;
    }

    const range = params.tMax - params.tMin;
    const rangePerPixel = (params.orientation === "horizontal") ? range/params.width : range/params.height;
    const scale = Math.log10(rangePerPixel);
    const scaleInt = Math.floor(scale);

    const interval0 = Math.pow(10, scaleInt+3);
    let interval = interval0;
    let ticks = 5;
    if (rangePerPixel/interval0 < 5e-3) {
        interval = interval0/2;
        ticks = 5;
    }
    if (rangePerPixel/interval0 < 2e-3) {
        interval = interval0/5;
        ticks = 2;
    }
    const kMin = Math.floor(params.tMin / interval);
    const kMax = Math.ceil(params.tMax / interval);

    const offBase = (params.orientation === "horizontal") ? params.height-20 : params.width-20;

    if (params.orientation === "horizontal")
        params.context.fillRect(0, offBase-1, params.width, 2);
    else
        params.context.fillRect(offBase-1, 0, 2, params.height);
    for (let k = kMin; k <= kMax; k++) {
        let t = roundNumber(k*interval);

        let pos = getPos(t);

        params.context.shadowColor = 'transparent';
        if (params.orientation === "horizontal")
            params.context.fillRect(pos-2, offBase-10, 4, 20);
        else 
            params.context.fillRect(offBase-10, pos-2, 20, 4);

        params.context.shadowColor = 'rgba(0, 0, 0, 1.0)';
        if (params.orientation === "horizontal")
            params.context.fillText(`${t}`, pos, offBase-10);
        else 
            params.context.fillText(`${t}`, offBase-15, pos);

        for (let k2 = 1; k2 < ticks; k2++) {
            let t2 = roundNumber((k+k2/ticks)*interval);
            const pos2 = getPos(t2);
            params.context.shadowColor = 'transparent';
            if (params.orientation === "horizontal")
                params.context.fillRect(pos2-1, offBase-10, 2, 10);
            else 
                params.context.fillRect(offBase-10, pos2-1, 10, 2);
        }
    }
}

export { roundNumber, drawAxis };