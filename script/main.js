"use strict"

$(function()
{


	const controls = 
	{
		'calculate_Pi':	function(ev) { PiCalc(); },
		'wave_display': function(ev) { DragItem(ev); },
		'sub-project_switcher': function(ev) { SwitchSubProject(); },
	};
	
	
	function SwitchSubProject()
	{
		console.log('Switching to ', $ProjectSelector.val());
		
		switch ($ProjectSelector.val())
		{
			case 'PiCalc': InitiatePiCalc(); break;
			case 'draggableItem': InitiateDraggableItem(); break;
			default: console.log('switching to ' + $ProjectSelector.val() + ' haven\'t done yet...');
		}
	}
	
	function FindInList( id )
	{
		switch(id)
		{
			case 'calculate_Pi': 
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
	
	function MoveHandler( ev )
	{	
		if (allowMouseMoveOnDisplay && $(ev.target).attr('id') === 'wave_display')
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
