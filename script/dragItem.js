const draggableItem = {

	
	imageData: DiagramCtx.createImageData(WIDTH, HEIGHT),
	backgroundColor: {red: 255, green: 250, blue: 240, alpha: 255},
	
	
	initiate: function()
	{
	//	allowMouseClickOnDisplay = true;
		allowMouseMoveOnDisplay = true;
		
		$ControlPanel.html('This is just a demo of object on canvas that follows the mouse pointer.');
		
		
	//	canvas.fill ( this.imageData, this.backgroundColor );
		canvas.gradientFill ( this.imageData );
		DiagramCtx.putImageData(this.imageData, 0, 0);
	},

	update: function(ev)
	{
		const pixelSize = 16;

		const fillColor = {red: 50, green: 200, blue: 100, alpha: 255};
			
		const localXPos = ev.pageX - $Display.offset().left;
		const localYPos = ev.pageY - $Display.offset().top;
		
		/*
		for (let j = 0; j < height; j++)
		{
			for (let i = 0; i < width; i++)
			{
				const distance = Math.sqrt((i - localXPos) * (i - localXPos) + (j - localYPos) * (j - localYPos));

				this.imageData.data[(j*width+i)*4 + red] = Math.floor(255 * 8 / distance);
				this.imageData.data[(j*width+i)*4 + green] = Math.floor(255 * 12 / distance);
				this.imageData.data[(j*width+i)*4 + blue] = Math.floor(255 * 16 / distance);
				this.imageData.data[(j*width+i)*4 + alpha] = 255;
				
			}
		}	
		*/
		
		canvas.fill ( this.imageData, this.backgroundColor );
		
		for (let j = localYPos - pixelSize; j < localYPos + pixelSize; j++)
		{
			for (let i = localXPos - pixelSize; i < localXPos + pixelSize; i++)
			{
				canvas.putDot( this.imageData, fillColor, i, j );
			}
		}
		
		DiagramCtx.putImageData(this.imageData, 0, 0);
				
	},

	handleEvent: function(ev) {
	//	console.log(`DragItem is handling event: `);
	//	console.log(`target: ${ev.target.id},  type: ${ev.type};\nCoordinates: x: ${ev.pageX}, y: ${ev.pageY}`);
	
		if ( ev.target.id === 'wave_display' && ev.type === 'mousemove' ) {
			this.update(ev);
		}
	
	
	}
}
