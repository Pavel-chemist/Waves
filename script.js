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
		'calculate_Pi':	function(ev) { PiCalc(); },
		'wave_display': function(ev) { console.log('click on display'); DrawOnCanvas(ev); },
	};
	
	
	
	
	
	function CalculatePiWithPendulum (step) 
	{/*
		basic idea:
		X(t0) = 0, V(t0) = 1;
		X(t1) = X(t0) + step * V(t0);
		V(t1) = V(t0) - step * X(t0);
		calculate until X(t_i) < 0;
		find t(X(t) = 0) using last two values;
		*/
		
	//	let step = 0.001;
		let X0 = 0, X1, V0 = 1, V1;
		let t0 = 0, t1;
		let calculatedPi = 0;
		
		X1 = X0 + step * V0;
		V1 = V0 - step * X0;
		t1 = t0 + step;
		
		while (X1 >= 0)
		{
			X0 = X1;
			V0 = V1;
			t0 = t1;
			
			X1 = X0 + step * V0;
			V1 = V0 - step * X0;
			t1 = t0 + step;
		}
		
		let a = (X1 - X0) / step;
		let b = X0 - a * t0;
		calculatedPi = -b / a;
		
		return calculatedPi;
	
	}
	
	function PiCalc ()
	{
		console.log('PiCalc is working');
	//	let $value = $('#calc_pi_val');
		$('#calc_pi_real').text(Math.PI);
		let $StepSize = $('#step_size');
		let $OutputValue = $('#calc_pi_val');
		let $ErrorDisplay = $('#calc_pi_error');
		
		let step = +$StepSize.val();
		let calculatedPiValue;
		
		console.log('step is ', step);
		
		if (step > 0 && step <= 1)
		{
			calculatedPiValue = CalculatePiWithPendulum(step);
			
			$OutputValue.text(calculatedPiValue);
			$ErrorDisplay.text(calculatedPiValue - Math.PI);
		}
		else
		{
			console.log('step size should be between 0 and 1, excluding 0');
		}
		
	}
	
	
	function DrawOnCanvas(ev)
	{
		let width = 800, height = 400;
		let ImageData = DiagramCtx.createImageData(width, height);
		let red = 0, green = 1, blue = 2, alpha = 3;
		let pixelSize = 16;
			
		let localXPos = ev.pageX - $Display.offset().left;
		let localYPos = ev.pageY - $Display.offset().top;
		
		PrepareCanvas(ImageData, 240, 240, 240, 255);
		
		
		for (let j = 0; j < height; j++)
		{
			for (let i = 0; i < width; i++)
			{
				const distance = Math.sqrt((i - localXPos) * (i - localXPos) + (j - localYPos) * (j - localYPos));
			
				
				ImageData.data[(j*width+i)*4 + red] = Math.floor(255 * 16 / distance);
				ImageData.data[(j*width+i)*4 + green] = Math.floor(255 * 12 / distance);
				ImageData.data[(j*width+i)*4 + blue] = Math.floor(255 * 8 / distance);
				/*
				if ( j === localYPos )
				{
					ImageData.data[(j*width+i)*4 + red] = 255;
					ImageData.data[(j*width+i)*4 + green] = 0;
					ImageData.data[(j*width+i)*4 + blue] = 0;
				}
				
				if ( i === localXPos )
				{
					ImageData.data[(j*width+i)*4 + red] = 255;
					ImageData.data[(j*width+i)*4 + green] = 0;
					ImageData.data[(j*width+i)*4 + blue] = 0;
				}*/
				
			}
		}
		
		
		DiagramCtx.putImageData(ImageData, 0, 0);	
	}
	
	function PrepareCanvas ( ImageData, red, green, blue, alpha )
	{
		for ( let i = 0; i < ImageData.data.length/4; i++ )
		{
			ImageData.data[i*4 + 0] = red;
			ImageData.data[i*4 + 1] = green;
			ImageData.data[i*4 + 2] = blue;
			ImageData.data[i*4 + 3] = alpha;
		}
	}


	function CalculatePotentialField (distance)
	{
		return 1/distance;
	}
	
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
	
	function FindInList( id )
	{
		switch(id)
		{
			case 'calculate_Pi': 
			case 'wave_display':
			return true;

			default: return false;
		}
	}
	
	function ClickHandler( ev )
	{	
		if (FindInList($(ev.target).attr('id')))
		{
			controls[$(ev.target).attr('id')](ev);	
		}
	}
	
	function MoveHandler( ev )
	{	
		if (FindInList($(ev.target).attr('id')))
		{
			controls[$(ev.target).attr('id')](ev);	
		}
	}
	
	
	
	$Window.on('click', function(ev){
		ClickHandler (ev);
	});
	
	$Window.on('mousemove', function(ev){
		MoveHandler (ev);
	});

})
