const draggableItem = {

	
	imageData: DiagramCtx.createImageData(WIDTH, HEIGHT),
	backgroundColor: {red: 255, green: 250, blue: 240, alpha: 255},
	itemColor: {red: 50, green: 200, blue: 100, alpha: 255},
	itemSize: 16,

	isMouseDown: false,

	initiate: function()
	{		
		$ControlPanel.html('This is just a demo of object on canvas that follows the mouse pointer.');

		canvas.gradientFill ( this.imageData );
		DiagramCtx.putImageData(this.imageData, 0, 0);
	},

	update: function(ev)
	{
		const localXPos = ev.offsetX;
		const localYPos = ev.offsetY;
		
		canvas.fill ( this.imageData, this.backgroundColor );
		
		for (let j = localYPos - this.itemSize; j < localYPos + this.itemSize; j++)
		{
			for (let i = localXPos - this.itemSize; i < localXPos + this.itemSize; i++)
			{
				if (Math.sqrt((i-localXPos)*(i-localXPos)+(j-localYPos)*(j-localYPos)) < this.itemSize) 
				{
					canvas.putDot( this.imageData, this.itemColor, i, j );
				}				
			}
		}
		
		DiagramCtx.putImageData(this.imageData, 0, 0);
				
	},

	handleEvent: function(ev) {
	//	console.log(`DragItem is handling event: `);
	//	console.log(`target: ${ev.target.id},  type: ${ev.type};\nCoordinates: x: ${ev.pageX}, y: ${ev.pageY}`);
	
		if ( this.isMouseDown && ev.type === 'mousemove' ) {
			this.update(ev);
		}

		if ( ev.type === 'mousedown' ) {
			this.isMouseDown = true;
			this.update(ev);
		} else if ( ev.type === 'mouseup' ) {
			this.isMouseDown = false;
		}
	}
}
