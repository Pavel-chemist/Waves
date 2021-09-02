"use strict"

const WIDTH = 1200;
const HEIGHT = 600;

const subprojectList = [
    {
        value: 'PiCalc',
        name: 'Pi calculator',
        objectName: 'pi'
    },
    {
        value: 'draggableItem',
        name: 'Draggable object',
        objectName: 'draggableItem'
    }    
];

const displayId = 'display';
const selectorId = 'selector';
const cPanelId = 'cPanel';
const switchId = 'subProjectSwitchButton';

const bodyHtml =
    `<div class="title">Waves</div>
    <div class="project_frame" id="frame" style="width: ${WIDTH + 10}px;"></div>`;

let options = '';
for (const subProject of subprojectList) {options += `<option value="${subProject.value}">${subProject.name}</option>`;};

const mainHtml = 
	`<div class="sub-project_switcher" >
		<label for="${selectorId}">Choose a sub-project:</label>

		<select name="sub-project" id="${selectorId}" class="sub-project_selector">
			<option value="">-- Please choose a sub-project --</option>
			${options}
		</select>
		<div class="button" id="${switchId}">
			Switch
		</div>
	</div>
	<canvas class="display" id="${displayId}" width="${WIDTH}" height="${HEIGHT}"></canvas>
	<div class="sub-project_controls" id="${cPanelId}">
		placeholder for control elements
	</div>`;


const $body = $('#body');
$body.html(bodyHtml);

const $Frame = $('#frame');
$Frame.html(mainHtml);

const $Switch = $(`#${switchId}`);
const $Display = $(`#${displayId}`);
const $ProjectSelector = $(`#${selectorId}`);
const $ControlPanel = $(`#${cPanelId}`);

const DiagramCtx = $Display[0].getContext("2d");
