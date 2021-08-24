"use strict"

function DrawSimpleGraph ( ImageData, graphDataArray, graphBoundaries, isConnected, isEquiscaled )
{
// graph Data Array is [{x: valX, y: valY}, ...]
// graphBoundaries = {startX: val, endX: val, startY: val, endY: val}

// This function is meant to plot a graph of an array of 2-d vectors as dots on a plane, which could be connected
// if isEquiscaled is true, the vertical and horisontal scale are equal, 
// otherwise they'll depend on graphBoundaries and actual canvas size
// 	
// 
	console.log('starting drawing graph');
	
	const backgroundColor = { red: 240, green: 244, blue: 248, alpha: 255 };
	const dotColor = { red: 0, green: 0, blue: 0, alpha: 255 };
	const lineColor = { red: 255, green: 0, blue: 0, alpha: 255 };
	const axesColor = { red: 0, green: 0, blue: 255, alpha: 255 };
	
	
	
	// scale coefficients are in units per pixel
	let horSpan = graphBoundaries.endX - graphBoundaries.startX;
	let vertSpan = graphBoundaries.endY - graphBoundaries.startY;
	let horisontalScale = horSpan / canvasWidth;
	let verticalScale = vertSpan / canvasHeight;
	
	if ( isEquiscaled )
	{
		let newScale;
		if ( horisontalScale > verticalScale )
		{			
			newScale = horisontalScale;
			let vertSpan2 = newScale * canvasWidth;
			graphBoundaries.startY = graphBoundaries.startY - (vertSpan2-vertSpan)/2;
			graphBoundaries.endY = graphBoundaries.endY + (vertSpan2-vertSpan)/2;
		}
		else
		{
			newScale = verticalScale;
			let horSpan2 = newScale * canvasWidth;
			graphBoundaries.startX = graphBoundaries.startX - (horSpan2-horSpan)/2;
			graphBoundaries.endX = graphBoundaries.endX + (horSpan2-horSpan)/2;
		}
		
		horisontalScale = newScale;
		verticalScale =  newScale;
	}
	
	// paint background
	FillCanvas( ImageData, backgroundColor );
	
	// plot axes
	let vertAxis = Math.floor(( -graphBoundaries.startX) / horisontalScale);
	vertAxis = vertAxis < 0 ? 0 : vertAxis;
	vertAxis = vertAxis >= canvasWidth ? canvasWidth-1 : vertAxis;
	
	let horAxis = Math.floor((graphBoundaries.endY) / verticalScale);
	horAxis = horAxis < 0 ? 0 : horAxis;
	horAxis = horAxis >= canvasHeight ? canvasHeight-1 : horAxis;
	
 	drawAxes (ImageData, vertAxis, horAxis, axesColor);
	
	// plot lines
	if (isConnected)
	{
		for( let n = 1; n < graphDataArray.length; n++ )
		{
			const ends = {};
			ends.startX = Math.floor((graphDataArray[n-1].x - graphBoundaries.startX) / horisontalScale);
			ends.startY = Math.floor((graphBoundaries.endY - graphDataArray[n-1].y) / verticalScale);
			
			ends.endX = Math.floor((graphDataArray[n].x - graphBoundaries.startX) / horisontalScale);
			ends.endY = Math.floor((graphBoundaries.endY - graphDataArray[n].y) / verticalScale);
			
			PutLineOnCanvas( ImageData, lineColor, ends );
		}
	}
	// plot dots
	for( let n = 0; n < graphDataArray.length; n++ )
	{
		const x = Math.floor((graphDataArray[n].x - graphBoundaries.startX) / horisontalScale);
		const y = Math.floor((graphBoundaries.endY - graphDataArray[n].y) / verticalScale);
		
		PutDotOnCanvas( ImageData, dotColor, x, y );
	}

}

function FillCanvas ( ImageData, color )
{
//	color =	{red, green, blue, alpha}

	for ( let i = 0; i < ImageData.data.length/4; i++ )
	{
		ImageData.data[i*4 + 0] = color.red;
		ImageData.data[i*4 + 1] = color.green;
		ImageData.data[i*4 + 2] = color.blue;
		/*
		ImageData.data[i*4 + 0] = i;
		ImageData.data[i*4 + 1] = Math.floor(i/256);
		ImageData.data[i*4 + 2] = Math.floor(i/(4*256));
		*/
		ImageData.data[i*4 + 3] = color.alpha;
	}
}

function PutDotOnCanvas ( ImageData, color, x, y )
{
//	color =	{red, green, blue, alpha}

	ImageData.data[(y*canvasWidth+x)*4 + 0] = color.red;
	ImageData.data[(y*canvasWidth+x)*4 + 1] = color.green;
	ImageData.data[(y*canvasWidth+x)*4 + 2] = color.blue;
	ImageData.data[(y*canvasWidth+x)*4 + 3] = color.alpha;
}

function PutLineOnCanvas ( ImageData, color, ends )
{
// ends = {startX, endX, startY, endY}	
	const Vext = ends.endY - ends.startY;
	const Hext = ends.endX - ends.startX;
	const Vamp = (Vext < 0) ? (-Vext) : Vext;
	const Hamp = (Hext < 0) ? (-Hext) : Hext;
	
	let A;

	if ( Hamp > Vamp )
	{
		A = Vext / Hext;
		//draw horisontal-like line as function of x
		if ( Hext > 0 )
		{
			for ( let x = 0; x < Hext; x++ )
			{
				PutDotOnCanvas ( ImageData, color, ends.startX + x, ends.startY + Math.floor(A * x) );
			}
		}
		else
		{
			for ( let x = 0; x > Hext; x-- )
			{
				PutDotOnCanvas ( ImageData, color, ends.startX + x, ends.startY + Math.floor(A * x) );
			}
		}
	}
	else
	{
		A = Hext / Vext;
		//draw vertical-like line as function of y
		if ( Vext > 0 )
		{
			for ( let y = 0; y < Vext; y++ )
			{
				PutDotOnCanvas ( ImageData, color, ends.startX + Math.floor(A * y), ends.startY + y );
			}
		}
		else
		{
			for ( let y = 0; y > Vext; y-- )
			{
				PutDotOnCanvas ( ImageData, color, ends.startX + Math.floor(A * y), ends.startY + y );
			}
		}
	}
}

function drawAxes (ImageData, x, y, color)
{
	const vertAxisEnds = { 
		startX: x,
		startY: 0,		
		endX: x,
		endY: canvasHeight,
	}
	
	const  horAxisEnds = { 
		startX: 0,
		startY: y,		
		endX: canvasWidth,
		endY: y,
	}
	
	PutLineOnCanvas(ImageData, color, vertAxisEnds);
	PutLineOnCanvas(ImageData, color, horAxisEnds);
}