"use strict"

//import { pi } from './piCalc';

$(function()
{
	let currentSubProjectId = '';

	function SwitchSubProject()
	{
		console.log('Switching to ', currentSubProjectId);
		
		switch (currentSubProjectId)
		{
			case 'PiCalc': pi.initiatePiCalc(); break;
			case 'draggableItem': draggableItem.initiate(); break;
			default: console.log('switching to ' + currentSubProjectId + ' haven\'t done yet...');
		}
	}
	
	function eventDispatcher (ev) {
		switch (currentSubProjectId)
		{
			case 'PiCalc': pi.handleEvent(ev); break;
			case 'draggableItem': draggableItem.handleEvent(ev); break;
			default: console.log(currentSubProjectId + ' is not handling events');
		}
	}
	
	
	$('#sub-project_switcher').on('click', function(){
		currentSubProjectId = $ProjectSelector.val();
		SwitchSubProject();
	})

	$Window.on('click', function(ev){
		eventDispatcher (ev);
	});
	
	$Window.on('mousemove', function(ev){
		eventDispatcher (ev);
	});

})
