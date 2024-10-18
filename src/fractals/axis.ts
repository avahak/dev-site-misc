function drawAxis(context: CanvasRenderingContext2D, width: number, height: number) {
    if (1 == 1)
        return;
    // TODO
    context.fillStyle = 'blue';
    context.font = '30px Arial';
    context.fillText('Blue text', 50, 50);
    context.fillStyle = 'rgba(20, 50, 100, 1)';
    context.clearRect(0, 0, width, height);
    context.fillRect(10, 10, 100, 100);
    context.fillStyle = 'red';
    context.font = '10px Arial';
    context.fillText('Red text', 25+Math.random()*10, 25);
}

export { drawAxis };