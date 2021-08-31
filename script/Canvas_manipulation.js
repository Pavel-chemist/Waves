"use strict"

function FillCanvas ( ImageData, color )
{
//	color =	{red, green, blue, alpha}

	for ( let i = 0; i < ImageData.data.length/4; i++ )
	{
		ImageData.data[i*4 + 0] = color.red;
		ImageData.data[i*4 + 1] = color.green;
		ImageData.data[i*4 + 2] = color.blue;
		ImageData.data[i*4 + 3] = color.alpha;
	}
}

function fillWithGradient ( ImageData )
{
	//color gradient to span values from -512 to 511
	
	for (let j = 0; j < canvasHeight; j++)
	{
		for (let i = 0; i < canvasWidth; i++)
		{
			const fillColor = gradientLookup(i - canvasWidth/2);
			ImageData.data[(j*canvasWidth+i)*4 + 0] = fillColor.red;
			ImageData.data[(j*canvasWidth+i)*4 + 1] = fillColor.green;
			ImageData.data[(j*canvasWidth+i)*4 + 2] = fillColor.blue;
			ImageData.data[(j*canvasWidth+i)*4 + 3] = fillColor.alpha;
			
		}
	}
}

function gradientLookup (offset)
{
	const baseColor = {red: 128, green: 128, blue: 128, alpha: 255};	
	
	if ( offset >= -128 && offset < 128 )
	{
		baseColor.red+= offset;
		baseColor.blue-= offset;
		
		return baseColor;
	}
	
	if ( offset >= -255 && offset < 255 )
	{
		if ( offset > 0 )
		{
			baseColor.red = 255;
			baseColor.blue = 0;
			baseColor.green = offset;
		}
		else
		{
			baseColor.red = 0;
			baseColor.blue = 255;
			baseColor.green = 255 + offset;
		}
		
		return baseColor;
	}
	
	if ( offset >= -512 && offset < 512 )
	{
		if ( offset > 0 )
		{
			baseColor.red = 255;
			baseColor.blue = offset - 256;
			baseColor.green = 255;
		}
		else
		{
			baseColor.red = 0;
			baseColor.blue = 512 + offset;
			baseColor.green = 0;
		}
		
		return baseColor;
	}
	
	if ( offset < -512 || offset >= 512 )
	{
		if ( offset > 0 )
		{
			baseColor.red = 255;
			baseColor.blue = 255;
			baseColor.green = 255;
		}
		else
		{
			baseColor.red = 0;
			baseColor.blue = 0;
			baseColor.green = 0;
		}
		
		return baseColor;
	}
}

function PutDotOnCanvas ( ImageData, color, x, y )
{
//	color =	{red, green, blue, alpha}
	if (x >= 0 && 
		x < canvasWidth && 
		y >=0 && 
		y < canvasHeight )
	{
		ImageData.data[(y*canvasWidth+x)*4 + 0] = color.red;
		ImageData.data[(y*canvasWidth+x)*4 + 1] = color.green;
		ImageData.data[(y*canvasWidth+x)*4 + 2] = color.blue;
		ImageData.data[(y*canvasWidth+x)*4 + 3] = color.alpha;
	}
}

function PutLineOnCanvas ( ImageData, color, ends )
{
// ends = {startX, endX, startY, endY}

	if ( !(ends.startX < 0 && ends.endX < 0 || ends.startX >= canvasWidth && ends.endX >= canvasWidth ||
		   ends.startY < 0 && ends.endY < 0 || ends.startY >= canvasHeight && ends.endY >= canvasHeight) )
	{
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
}
