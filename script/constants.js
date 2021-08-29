"use strict"

const $Window = $(window);
const $Display = $('#wave_display');
const $ProjectSelector = $('#sp-select');
const $ControlPanel = $('#control_panel');

const canvasWidth = $Display.width();
const canvasHeight = $Display.height();

const DiagramCtx = $Display[0].getContext("2d");

//  global variables to control display
let globalEventHolder;
let allowMouseClickOnDisplay = false;
let allowMouseMoveOnDisplay = false;