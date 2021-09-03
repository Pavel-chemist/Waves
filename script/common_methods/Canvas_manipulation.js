"use strict"

const canvas = {
	fill: function FillCanvas ( ImageData, color )
	{
	//	color =	{red, green, blue, alpha}

		for ( let i = 0; i < ImageData.data.length/4; i++ )
		{
			ImageData.data[i*4 + 0] = color.red;
			ImageData.data[i*4 + 1] = color.green;
			ImageData.data[i*4 + 2] = color.blue;
			ImageData.data[i*4 + 3] = color.alpha;
		}
	},

	gradientFill: function ( ImageData )
	{
		//color gradient to span values from -512 to 511
		
		for (let j = 0; j < HEIGHT; j++)
		{
			for (let i = 0; i < WIDTH; i++)
			{
				const fillColor = this.gradientLookup(i - WIDTH/2);
				ImageData.data[(j*WIDTH+i)*4 + 0] = fillColor.red;
				ImageData.data[(j*WIDTH+i)*4 + 1] = fillColor.green;
				ImageData.data[(j*WIDTH+i)*4 + 2] = fillColor.blue;
				ImageData.data[(j*WIDTH+i)*4 + 3] = fillColor.alpha;
				
			}
		}
	},

	putDot: function ( ImageData, color, x, y )
	{
	//	color =	{red, green, blue, alpha}
		if (x >= 0 && 
			x < WIDTH && 
			y >=0 && 
			y < HEIGHT )
		{
			ImageData.data[(y*WIDTH+x)*4 + 0] = color.red;
			ImageData.data[(y*WIDTH+x)*4 + 1] = color.green;
			ImageData.data[(y*WIDTH+x)*4 + 2] = color.blue;
			ImageData.data[(y*WIDTH+x)*4 + 3] = color.alpha;
		}
	},

	putLine: function ( ImageData, color, ends )
	{
	// ends = {startX, endX, startY, endY}

		if ( !(ends.startX < 0 && ends.endX < 0 || ends.startX >= WIDTH && ends.endX >= WIDTH ||
			ends.startY < 0 && ends.endY < 0 || ends.startY >= HEIGHT && ends.endY >= HEIGHT) )
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
						this.putDot ( ImageData, color, ends.startX + x, ends.startY + Math.floor(A * x) );
					}
				}
				else
				{
					for ( let x = 0; x > Hext; x-- )
					{
						this.putDot ( ImageData, color, ends.startX + x, ends.startY + Math.floor(A * x) );
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
						this.putDot ( ImageData, color, ends.startX + Math.floor(A * y), ends.startY + y );
					}
				}
				else
				{
					for ( let y = 0; y > Vext; y-- )
					{
						this.putDot ( ImageData, color, ends.startX + Math.floor(A * y), ends.startY + y );
					}
				}
			}
		}	
	},

	drawBox: function(ImageData, origin, offsets, type, scale, sizes, colors) {
	//  origin: x, y -- in original units
	//  offsets: offX, offY -- in original units
	//	type: centered, topleft
	//  scale: units per pixel -- scaling between original units and pixels
	//  sizes: width, height -- in original units
	//  colors: borders, fill

		const corners = {topLeft: {x: 0, y: 0}, topRight: {x: 0, y: 0}, bottomLeft: {x: 0, y: 0}, bottomRight: {x: 0, y: 0},};

		if ( type === 'centered') {
			corners.topLeft.x = corners.bottomLeft.x = Math.floor((origin.x + offsets.offX - sizes.width/2)/scale);
			corners.topLeft.y = corners.topRight.y = Math.floor((origin.y + offsets.offY - sizes.height/2)/scale);

			corners.topRight.x = corners.bottomRight.x = Math.floor((origin.x + offsets.offX + sizes.width/2)/scale);
			corners.bottomLeft.y = corners.bottomRight.y = Math.floor((origin.y + offsets.offY + sizes.height/2)/scale);
		} else {
			corners.topLeft.x = corners.bottomLeft.x = Math.floor((origin.x + offsets.offX)/scale);
			corners.topLeft.y = corners.topRight.y = Math.floor((origin.y + offsets.offY)/scale);

			corners.topRight.x = corners.bottomRight.x = Math.floor((origin.x + offsets.offX + sizes.width)/scale);
			corners.bottomLeft.y = corners.bottomRight.y = Math.floor((origin.y + offsets.offY + sizes.height)/scale);
		}

		if (colors.fill) {
			for (let j = corners.topLeft.y; j < corners.bottomLeft.y; j++) {
				for (let i = corners.topLeft.x; i < corners.topRight.x; i++) {
					this.putDot(ImageData, colors.fill, i, j);
				}
			}
		}

		// ends = {startX, endX, startY, endY}
		if (colors.borders) {
			this.putLine(ImageData, colors.borders, {startX: corners.topLeft.x, startY: corners.topLeft.y, endX: corners.topRight.x, endY: corners.topRight.y});
			this.putLine(ImageData, colors.borders, {startX: corners.topLeft.x, startY: corners.topLeft.y, endX: corners.bottomLeft.x, endY: corners.bottomLeft.y});
			this.putLine(ImageData, colors.borders, {startX: corners.topRight.x, startY: corners.topRight.y, endX: corners.bottomRight.x, endY: corners.bottomRight.y});
			this.putLine(ImageData, colors.borders, {startX: corners.bottomLeft.x, startY: corners.bottomLeft.y, endX: corners.bottomRight.x, endY: corners.bottomRight.y});
		}
	},

	gradientLookup: function (offset)
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
}


