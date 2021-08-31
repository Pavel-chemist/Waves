"use strict"

//import { pi } from './piCalc';

$(function()
{
	const controls = 
	{
		'calculate_Pi':	function(ev) { pi.piCalc(); },
		'wave_display': function(ev) { draggableItem.update(ev); },
		'sub-project_switcher': function(ev) { SwitchSubProject(); },
	};
	
	function SwitchSubProject()
	{
		console.log('Switching to ', $ProjectSelector.val());
		
		switch ($ProjectSelector.val())
		{
			case 'PiCalc': pi.initiatePiCalc(); break;
			case 'draggableItem': draggableItem.initiate(); break;
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
