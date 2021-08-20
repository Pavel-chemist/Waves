"use strict"

$(function()
{
	
	let $Window = $(window);
	let $Display = $('#wave_display');
	let DiagramCtx = $Display[0].getContext("2d");
	
	
	
	let linewidth = 4;
	let raywidth = 1;
	let lshift = -0;
	let rshift = -0.5;
	
	const mm = 10; //pixels per millimeter
	const deg = AngleConvert ( 1, 'toRad' ); //radians per degree
	
	
	let colors = 
	[
		'#ff8080',	//ultra-violet, 351-400nm
		'#ff00ff',	//violet,		401-450nm
		'#0000ff',	//blue,			451-500nm
		'#00ffff',	//cyan,			501-550nm
		'#00ff00',	//green,		551-600nm
		'#ffff00',	//yellow,		601-650nm
		'#ff8000',	//orange,		651-700nm
		'#ff0000',	//red,			701-750nm
		'#800000',	//deep red,		751-800nm
		'#802040',	//ir1,			801-850nm
		'#c04080',	//ir2,			851-900nm
		'#d080a0',	//ir3,			901-950nm
		'#d0a0b0',	//ir4,			951-1000nm
		'#c0c0c0',	//ir5,			1001-1050nm
		'#808080'	//ir6,			>1050nm
	];
	
	/*
	let cameraShape = 
	{
		anchorPoint:
		{
			x: 31*mm,
			y: 30*mm,
			isVisible: true,
			color: '#ff8080',
			radius: 1*mm
		},
		border: 
		[
			{ x: 0, y: 0 },
			{ x: 31*mm, y: 0 },
			{ x: 31*mm, y: 14*mm },
			{ x: 43*mm, y: 14*mm },
			{ x: 43*mm, y: 17*mm },
			{ x: 58*mm, y: 17*mm },
			{ x: 58*mm, y: 43*mm },
			{ x: 43*mm, y: 43*mm },
			{ x: 43*mm, y: 46*mm },
			{ x: 31*mm, y: 46*mm },
			{ x: 31*mm, y: 94*mm },
			{ x: 0, y: 94*mm },
			{ x: 0, y: 0*mm }
		],
		borderColor: '#002040',
		borderWidth: 4,
		isFilled: false,
		fillColor: '#e0f0ff'
	};
	*/
	
	
	
	let controls = 
	{
		'placeholderControl':			function() { console.log('placeholder message'); },
	};
	
	// DrawSpectrometerDiagram( DiagramCtx );
	
	
	/*
	function DrawSpectrometerDiagram( CanvasCtx )
	{
		CanvasCtx.clearRect(0, 0, base.width, base.height);
		
		DotGrid( CanvasCtx, 1*mm, '#c0c0c0', base.width, base.height, 2 );
		DotGrid( CanvasCtx, 5*mm, '#c0c0c0', base.width, base.height, 4 );
		DotGrid( CanvasCtx, 10*mm, '#c0c0c0', base.width, base.height, 8 );
		DotGrid( CanvasCtx, 10*mm, '#000000', base.width, base.height, 2 );
		
		CanvasCtx.lineWidth = linewidth;
		CanvasCtx.strokeStyle = '#000000';		
		CanvasCtx.beginPath();	
		CanvasCtx.arc( pivot.x, pivot.y, 25*mm, 0, 2*Math.PI, true );
		CanvasCtx.stroke();
		CanvasCtx.closePath();
		
		DrawApertures( CanvasCtx )
		
		DrawShape( DiagramCtx, collimatingLensShape, { x: 0, y: CRY, angle: 180*deg }, collimatingLensDistance );
		collimatingLens.plane = 
		{
			a: Infinity,
			b: CRY,
			center:
			{
				x: collimatingLensDistance,
				y: CRY
			}
		};
		
	//	console.log(collimatingLens);
		
		let rays = DrawIncomingRays( DiagramCtx, numOfMarginalRayPairs );
		
			
		let gratingLine = DrawGrating( DiagramCtx );
		
		
		
		raysOnSensor = []; //clearing up an array
		
		cameraLens.plane = DrawShape( DiagramCtx, cameraLensShape, pivot, cameraDistance - 15*mm );
		
		sensor.plane = 
		{
			a: cameraLens.plane.a,
			b: cameraLens.plane.b + sensor.distanceFromLens / ( Math.cos( Math.atan( cameraLens.plane.a ) ) ),
			center: 
			{
				x: cameraLens.plane.center.x - sensor.distanceFromLens * ( Math.sin( Math.atan( cameraLens.plane.a ) ) ),
				y: cameraLens.plane.center.y + sensor.distanceFromLens * ( Math.cos( Math.atan( cameraLens.plane.a ) ) )
			}
		};
	
		DrawLine( CanvasCtx, { x: 0, y: cameraLens.plane.b }, { x: base.width, y: cameraLens.plane.a*base.width + cameraLens.plane.b}, 2, '#80b0ff', { width: 0, period: 0} );
		DrawLine( CanvasCtx, { x: 0, y: sensor.plane.b }, { x: base.width, y: sensor.plane.a*base.width + sensor.plane.b}, 2, '#80ffb0', { width: 0, period: 0} );
		
		DrawDiffractedRays( DiagramCtx, gratingLine, rays );
		
		DrawShape( DiagramCtx, cameraShape, pivot, cameraDistance );
		DrawShape( DiagramCtx, sensorShape, pivot, cameraDistance - 15*mm + sensor.distanceFromLens );
	
		DrawCircle( CanvasCtx, sensor.plane.center, 0.5*mm, '#000000' );
		DrawCircle( CanvasCtx, sensor.plane.center, 0.25*mm, '#ff0000' );
	
		if ( renderRayImage )
		{
			RenderRays( CanvasCtx );
		}
		
		FillDisplayValues();
	}
	*/
	
	function DotGrid( CanvasCtx, period, color, width, height, dotSize )
	{
		CanvasCtx.fillStyle = color;
		let horNum = Math.floor( width / period );
		let verNum = Math.floor( height / period );
		for ( let i = 1; i < horNum; i++ )
		{
			for ( let j = 1; j < verNum; j++ )
			{
				DiagramCtx.fillRect(i*period - dotSize/2, j*period - dotSize/2, dotSize, dotSize);
			}
		}
	}
	
	
	
	function DrawShape( CanvasCtx, shape, pivot, pivotDistance )
	{
		//draws shape anywhere on canvas, can be translated and rotated
		//shape is an array of point objects
		//pivotDistance sets the distance from chosen pivot point
		//pivot is a point with coordinates and vector pointing at set angle
		
		let translatedAnchor = 
		{
			x: pivot.x - pivotDistance, 
			y: pivot.y 		
		};
		
		let transRotAnchor = Rotate( translatedAnchor, pivot );
		
		
		//what does start mean at this point?
		let start = 
		{
			x: translatedAnchor.x - shape.anchorPoint.x,
			y: translatedAnchor.y - shape.anchorPoint.y 
		};
		
		
		let rotatedStart = Rotate( { x: (shape.border[0].x + start.x), y: (shape.border[0].y + start.y) }, pivot );
		let rotatedShapePoint;
		
		
		CanvasCtx.lineWidth = shape.borderWidth;
		CanvasCtx.setLineDash([0]);
		CanvasCtx.strokeStyle = shape.borderColor;
		CanvasCtx.fillStyle = shape.fillColor;
		CanvasCtx.beginPath();
		
		CanvasCtx.moveTo(rotatedStart.x, rotatedStart.y);
		
		for ( let i = 0; i < shape.border.length; i++ )
		{
			rotatedShapePoint = Rotate( { x: (shape.border[i].x + start.x), y: (shape.border[i].y + start.y) }, pivot );
			CanvasCtx.lineTo(rotatedShapePoint.x, rotatedShapePoint.y);
		}
		
		if ( shape.isFilled )
		{
			CanvasCtx.fill();
		}
		CanvasCtx.stroke();	
		CanvasCtx.closePath();
		
		if ( shape.anchorPoint.isVisible )
		{
			DrawCircle ( CanvasCtx, transRotAnchor, shape.anchorPoint.radius, shape.anchorPoint.color );
		}
		
		//get line through anchor, and perpendicular to radius
		let perpend_plane = 
		{
			a: Math.tan(90*deg - pivot.angle),
			b: transRotAnchor.y - Math.tan(90*deg - pivot.angle) * transRotAnchor.x,
			center: transRotAnchor
		}
		
		return perpend_plane;
		
	}

	function Rotate ( point, pivot )
	{
		//point.x, point.y;
		//pivot.x, pivot.y, pivot.angle
		
		
	//	let radAngle = - AngleConvert( pivot.angle, 'toRad' );
		let radAngle = - pivot.angle;
		
		let rotatedPoint = 
		{
			x: (point.x - pivot.x) * Math.cos(radAngle) - (point.y - pivot.y) * Math.sin(radAngle) + pivot.x,
			y: (point.x - pivot.x) * Math.sin(radAngle) + (point.y - pivot.y) * Math.cos(radAngle) + pivot.y
		}
		
		return rotatedPoint;
	}
	
	
	function AngleConvert ( angle, direction )
	{
		let convertedAngle;
		
		if ( direction === 'toDeg' )
		{
			convertedAngle = 180 * angle / Math.PI;
		}
		else if ( direction === 'toRad' )
		{
			convertedAngle = Math.PI * angle / 180;
		}
		else
		{
			console.log('AngleConvert error: invalid direction, should be "toDeg" or "toRad".');
			convertedAngle = 0;
		}
		
		return convertedAngle;
	}
	
	
	function DrawCircle ( CanvasCtx, center, radius, color )
	{
		//center= { x: xcoord, y: ycoord }
		if ( color != undefined )
		{
			CanvasCtx.fillStyle = color;
		}
		else
		{
			CanvasCtx.fillStyle = '#ff0000';
		}
		CanvasCtx.beginPath();
		CanvasCtx.arc(center.x, center.y, radius, 0, 2*Math.PI, true );
		CanvasCtx.fill();
		CanvasCtx.closePath();
		
	}
	

	
	function DrawLine ( CanvasCtx, start, end, width, color, dash )
	{
		CanvasCtx.lineWidth = width;
		CanvasCtx.setLineDash([dash.width, dash.period]);
		CanvasCtx.strokeStyle = color;
		CanvasCtx.beginPath();		
		CanvasCtx.moveTo(start.x, start.y);
		CanvasCtx.lineTo(end.x, end.y);
		CanvasCtx.stroke();	
		CanvasCtx.closePath();
	}

	function FillDisplayValues()
	{
	//	$('#pivotAngleDisplay').text( (pivot.angle/deg).toFixed(0) );
	}
	
	function ClickHandler( $target )
	{	
		console.log('click was somewhere');
	//	DrawSpectrometerDiagram( DiagramCtx );		
	}
	
	
	
	$Window.on('click', function(ev){
		ClickHandler ( $(ev.target) );
	});

})
