"use strict"

$(function()
{
	const controls = 
	{
		'calculate_Pi':	function(ev) { PiCalc(); },
		'wave_display': function(ev) { DrawOnCanvas(ev); },
		'sub-project_switcher': function(ev) { SwitchSubProject(); },
	};
	
	
	function SwitchSubProject()
	{
		console.log('Switching to ', $ProjectSelector.val());
		
		switch ($ProjectSelector.val())
		{
			case 'PiCalc': InitiatePiCalc(); break;

			default: console.log('switching to ' + $ProjectSelector.val() + ' haven\'t done yet...');
		}
	}

	function DrawOnCanvas(ev)
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

	
	function FindInList( id )
	{
		switch(id)
		{
			case 'calculate_Pi': 
			case 'wave_display':
			case 'sub-project_switcher':
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
	/*
	function MoveHandler( ev )
	{	
		if (FindInList($(ev.target).attr('id')))
		{
			controls[$(ev.target).attr('id')](ev);	
		}
	}
	*/
	
	
	$Window.on('click', function(ev){
		ClickHandler (ev);
	});
	/*
	$Window.on('mousemove', function(ev){
		MoveHandler (ev);
	});
*/
})
