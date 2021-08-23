function InitiatePiCalc()
{
	const piCalcControlsHtml = `<div class="PiCalc_top">
		<div>Step size:</div> 
		<input id="step_size">
		<div class="button" id="calculate_Pi">
			get Pi
		</div>
	</div>
	
	<div>
		<div class="label">calculated value of Pi</div><div class="number_dispay" id="calc_pi_val">&nbsp;</div>
		<div class="label">real value of Pi</div><div class="number_dispay" id="calc_pi_real">&nbsp;</div>
		<div class="label">difference</div><div class="number_dispay" id="calc_pi_error">&nbsp;</div>
	</div>`;
	
	$ControlPanel.html(piCalcControlsHtml);
}

function CalculatePiWithPendulum (step) 
{/*
	basic idea:
	X(t0) = 0, V(t0) = 1;
	X(t1) = X(t0) + step * V(t0);
	V(t1) = V(t0) - step * X(t0);
	calculate until X(t_i) < 0;
	find t(X(t) = 0) using last two values;
	*/
	
//	let step = 0.001;
	let X0 = 0, X1, V0 = 1, V1;
	let t0 = 0, t1;
	let calculatedPi = 0;
	
	X1 = X0 + step * V0;
	V1 = V0 - step * X0;
	t1 = t0 + step;
	
	while (X1 >= 0)
	{
		X0 = X1;
		V0 = V1;
		t0 = t1;
		
		X1 = X0 + step * V0;
		V1 = V0 - step * X0;
		t1 = t0 + step;
	}
	
	let a = (X1 - X0) / step;
	let b = X0 - a * t0;
	calculatedPi = -b / a;
	
	return calculatedPi;

}

function PiCalc ()
{
	console.log('PiCalc is working');
	$('#calc_pi_real').text(Math.PI);
	let $StepSize = $('#step_size');
	let $OutputValue = $('#calc_pi_val');
	let $ErrorDisplay = $('#calc_pi_error');
	
	let step = +$StepSize.val();
	let calculatedPiValue;
	
	console.log('step is ', step);
	
	if (step > 0 && step <= 1)
	{
		calculatedPiValue = CalculatePiWithPendulum(step);
		
		$OutputValue.text(calculatedPiValue);
		$ErrorDisplay.text(calculatedPiValue - Math.PI);
	}
	else
	{
		console.log('step size should be between 0 and 1, excluding 0');
	}
	
}