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
	
	const backgroundColor = { red: 240, green: 244, blue: 248, alpha: 255 };
	const dotColor = { red: 0, green: 0, blue: 0, alpha: 255 };
	const lineColor = { red: 255, green: 0, blue: 0, alpha: 255 };
	const axesColorMain = { red: 0, green: 0, blue: 127, alpha: 255 };
	const axesColorSecondary = { red: 127, green: 127, blue: 255, alpha: 255 };
	
	
	
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
			let vertSpan2 = newScale * canvasHeight;
		
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
 	drawAxesFor2dGraph (
		ImageData,
		graphBoundaries,
		{ main: axesColorMain, secondary: axesColorSecondary },
		{ hor: horisontalScale, vert: verticalScale});
	
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


function drawAxesFor2dGraph (ImageData, graphBoundaries, colors, scales)
{
//	colors = { main: axesColorMain, secondary: axesColorSecondary }
//	scales = { hor: horisontalScale, vert: verticalScale }

//	main axes
	let vertAxis = Math.floor(( -graphBoundaries.startX) / scales.hor);
	vertAxis = vertAxis < 0 ? 0 : vertAxis;
	vertAxis = vertAxis >= canvasWidth ? canvasWidth-1 : vertAxis;
	
	let horAxis = Math.floor((graphBoundaries.endY) / scales.vert);
	horAxis = horAxis < 0 ? 0 : horAxis;
	horAxis = horAxis >= canvasHeight ? canvasHeight-1 : horAxis;

//  secondary axes/ grid
//	there should be no more than 10-15 gridlines, but at least one besides the main axes

//	find appropriate scale
	const horSpanReal = graphBoundaries.endX - graphBoundaries.startX;
	const vertSpanReal = graphBoundaries.endY - graphBoundaries.startY;

	const horGridScale = Math.floor(Math.log10(horSpanReal));
	const vertGridScale = Math.floor(Math.log10(vertSpanReal));
	
	const deltaXinPx = Math.floor(Math.pow(10, horGridScale) / scales.hor);
	const deltaYinPx = Math.floor(Math.pow(10, vertGridScale) / scales.vert);
	
	const firstVertGridLine = Math.floor(graphBoundaries.startX / Math.pow(10, horGridScale));
	const firstHorGridLine = Math.floor(graphBoundaries.startY / Math.pow(10, vertGridScale));
	
	
	let gridLineEnds;
	let gridLineX = firstVertGridLine - graphBoundaries.startX;
	let gridLineY = firstHorGridLine - graphBoundaries.startY;

	while ( gridLineX < horSpanReal )
	{
		gridLineEnds = { 
			startX: Math.floor(gridLineX / scales.hor),
			startY: 0,		
			endX: Math.floor(gridLineX / scales.hor),
			endY: canvasHeight,
		};
		PutLineOnCanvas(ImageData, colors.secondary, gridLineEnds);
		gridLineX += Math.pow(10, horGridScale);
	}
	
	while ( gridLineY < vertSpanReal )
	{
		gridLineEnds = { 
			startX: 0,
			startY: Math.floor(gridLineY / scales.vert),
			endX: canvasWidth,
			endY: Math.floor(gridLineY / scales.vert),
		};
		PutLineOnCanvas(ImageData, colors.secondary, gridLineEnds);
		gridLineY += Math.pow(10, vertGridScale);
	}

//	ticks
//  ticks are small lines (10px long) crossing main axes, they are 10 times more frequent than grid lines
	let tickX = firstVertGridLine - graphBoundaries.startX;
	let tickY = firstHorGridLine - graphBoundaries.startY;
	
	while ( tickX < horSpanReal )
	{
		gridLineEnds = { 
			startX: Math.floor(tickX / scales.hor),
			startY: horAxis - 5,		
			endX: Math.floor(tickX / scales.hor),
			endY: horAxis + 5,
		};
	
		PutLineOnCanvas(ImageData, colors.main, gridLineEnds);
		tickX += Math.pow(10, (horGridScale-1));
	}
	
	while ( tickY < vertSpanReal )
	{
		gridLineEnds = { 
			startX: vertAxis - 5,
			startY: Math.floor(tickY / scales.vert),
			endX: vertAxis + 5,
			endY: Math.floor(tickY / scales.vert),
		};
	
		PutLineOnCanvas(ImageData, colors.main, gridLineEnds);
		tickY += Math.pow(10, (vertGridScale-1));
	}

//  main axes
	const vertAxisEnds = { 
		startX: vertAxis,
		startY: 0,		
		endX: vertAxis,
		endY: canvasHeight,
	}
	
	const  horAxisEnds = { 
		startX: 0,
		startY: horAxis,
		endX: canvasWidth,
		endY: horAxis,
	}
	
	PutLineOnCanvas(ImageData, colors.main, vertAxisEnds);
	PutLineOnCanvas(ImageData, colors.main, horAxisEnds);
}
