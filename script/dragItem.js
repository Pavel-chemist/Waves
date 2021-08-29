function InitiateDraggableItem()
{
//	allowMouseClickOnDisplay = true;
	allowMouseMoveOnDisplay = true;
	
	$ControlPanel.html('This is just a demo of object on canvas that follows the mouse pointer.');
	
	let ImageData = DiagramCtx.createImageData(canvasWidth, canvasWidth);
	FillCanvas ( ImageData, {red: 0, green: 0, blue: 0, alpha: 255} );
	DiagramCtx.putImageData(ImageData, 0, 0);
}

function DragItem(ev)
{

	let width = canvasWidth, height = canvasHeight;
	let ImageData = DiagramCtx.createImageData(width, height);
	let red = 0, green = 1, blue = 2, alpha = 3;
	let pixelSize = 16;
		
	let localXPos = ev.pageX - $Display.offset().left;
	let localYPos = ev.pageY - $Display.offset().top;
	
	
	for (let j = 0; j < height; j++)
	{
		for (let i = 0; i < width; i++)
		{
			const distance = Math.sqrt((i - localXPos) * (i - localXPos) + (j - localYPos) * (j - localYPos));

			ImageData.data[(j*width+i)*4 + red] = Math.floor(255 * 8 / distance);
			ImageData.data[(j*width+i)*4 + green] = Math.floor(255 * 12 / distance);
			ImageData.data[(j*width+i)*4 + blue] = Math.floor(255 * 16 / distance);
			ImageData.data[(j*width+i)*4 + alpha] = 255;
			
		}
	}	
	
	DiagramCtx.putImageData(ImageData, 0, 0);
			
}