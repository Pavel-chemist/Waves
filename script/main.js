"use strict"

//import { pi } from './piCalc';

$(function()
{
	let currentSubProjectId = '';

	function SwitchSubProject()
	{
		console.log(`Switching to "${currentSubProjectId}"`);
		const sP = currentSubProjectId ? subprojectList.find(subProject => subProject.value === currentSubProjectId).objectName : '';

		if (sP) {
			return Function(`"use strict"; ${sP}.initiate();`)();
		}
	}
	
	function eventDispatcher (ev) {
		const sP = currentSubProjectId ? subprojectList.find(subProject => subProject.value === currentSubProjectId).objectName : '';

		if (sP) {
			return Function('passedEvent', `"use strict"; ${sP}.handleEvent(passedEvent);`)(ev);
		}

	}

	$Switch.on('click', function(){
		currentSubProjectId = $ProjectSelector.val();
		SwitchSubProject();
	});

	$ControlPanel.on('click', function(ev){
		eventDispatcher (ev);
	});

	$Display.on('click', function(ev){
		eventDispatcher (ev);
	});

	$Display.on('mouseenter', function(ev){
		eventDispatcher (ev);
	});

	$Display.on('mousedown', function(ev){
		eventDispatcher (ev);
	});

	$Display.on('mousemove', function(ev){
		eventDispatcher (ev);
	});

	$Display.on('mouseup', function(ev){
		eventDispatcher (ev);
	});

	$Display.on('mouseleave', function(ev){
		eventDispatcher (ev);
	});
})
