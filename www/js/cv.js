$(document).ready(function() {
	var steps = $('#cv-form-steps').children();
	var buttons = $('#cv-form-buttons').find('button');
	var step = steps.first();
	var showStep = function(step) {
		steps.hide(); // Hides all the steps
		step.show(); // Show the current step
		if(step.attr('id') === steps.first().attr('id')) {
			$('button#cv-form-buttons-previous').hide();
		} else {
			$('button#cv-form-buttons-previous').show();
		}
		if(step.attr('id') === steps.last().attr('id')) {
			$('button#cv-form-buttons-next').hide();
			$('button#cv-form-buttons-validation').show();
		} else {
			$('button#cv-form-buttons-next').show();
			$('button#cv-form-buttons-validation').hide();
		}
	};
	showStep(steps.first());
	$('button#cv-form-buttons-previous').click(function(event) {
		event.stopPropagation();
		event.preventDefault();
		step = step.prev();
		showStep(step);
	});
	$('button#cv-form-buttons-next').click(function(event) {
		event.stopPropagation();
		event.preventDefault();
		step = step.next();
		showStep(step);
	});
	var addDiploma = function(event) {
		event.stopPropagation();
		event.preventDefault();
		var diplomaNumber = parseInt($(this).attr('id').replace('cv-form-step-diplomas-add-', ''));
		var table = $('#cv-form-step-diplomas-table');
		var line = table.find('tbody').find('tr').last().clone();
		line.find('[id]').each(function(i) {
			var newId = $(this).attr('id').replace('-' + diplomaNumber, '-' + (diplomaNumber+1) );
			$(this).attr('id', newId);
		});
		line.find('input').each(function(i) {
			$(this).val('');
		});
		line.find('button.btn-success').click(addDiploma);
		line.find('button.btn-danger').click(removeDiploma);
		table.find('tbody').append(line);
		$(this).hide();
	};
	var removeDiploma = function(event) {
		event.stopPropagation();
		event.preventDefault();
		var tbody = $('#cv-form-step-diplomas-table').find('tbody');
		if(tbody.find('tr').size() > 1) {
			$(this).parent('td').parent('tr').remove();
			tbody.find('tr').last().find('button.btn-success').show();
		}
	};
	$('button#cv-form-step-diplomas-add-0').click(addDiploma);
	$('button#cv-form-step-diplomas-remove-0').click(removeDiploma);
});
