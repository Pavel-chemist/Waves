const linewidth = 4;
const raywidth = 1;
const lshift = -0;
const rshift = -0.5;

const mm = 10; //pixels per millimeter

const deg = AngleConvert ( 1, 'toRad' ); //radians per degree

const colors = 
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


const cameraShape = 
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
