const SIZE = 9;
const EMPTY = 0;

let grid;
generate();

let table;
buildTable();

function generate() {
    grid = [];
	for (let i = 0; i < SIZE; i++) {
		let row = []
		for (let j = 0; j < SIZE; j++) {
			row.push(EMPTY);
		}
		grid.push(row);
	}

	solve(0, 0, true);

	let order = [];
	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < SIZE; col++) {
			order.push([row, col]);
		}
	}
	order = shuffle(order);

	for (let i = 0; i < order.length; i++) {
		let [row, col] = order[i];

		let num = grid[row][col];
		grid[row][col] = EMPTY;

		let solutions = solve(0, 0, false, true);
		if (solutions > 1) {
			grid[row][col] = num;
		}
	}
}

function solve(row, col, random = false, count = false) {
	if (row == SIZE) {
		return 1;
	}

	if (grid[row][col] != EMPTY) {
		let nextRow = row + Math.floor((col + 1) / SIZE);
		let nextCol = (col + 1) % SIZE;
		return solve(nextRow, nextCol, random, count);
	}

	let order = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	if (random) {
		order = shuffle(order);
	}

	let solutions = 0;
	for (let i = 0; i < order.length; i++) {
		let num = order[i];

		if (fits(row, col, num)) {
			grid[row][col] = num;

			let nextRow = row + Math.floor((col + 1) / SIZE);
			let nextCol = (col + 1) % SIZE;

			solutions += solve(nextRow, nextCol, random, count);
			if (!count && solutions > 0) {
				return solutions;
			}

			grid[row][col] = EMPTY;
		}
	}

	return solutions;
}

function shuffle(arr) {
	for (let i = 0; i < arr.length; i++) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function fits(row, col, val) {
	return fitsInRow(row, val) && fitsInCol(col, val) && fitsInBlock(row, col, val);
}

function fitsInRow(row, val) {
	for (let col = 0; col < SIZE; col++) {
		if (grid[row][col] == val) {
			return false;
		}
	}
	return true;
}

function fitsInCol(col, val) {
	for (let row = 0; row < SIZE; row++) {
		if (grid[row][col] == val) {
			return false;
		}
	}
	return true;
}

function fitsInBlock(row, col, val) {
	let startRow = Math.floor(row / 3) * 3;
	let startCol = Math.floor(col / 3) * 3;
	for (let row = startRow; row < startRow + 3; row++) {
		for (let col = startCol; col < startCol + 3; col++) {
			if (grid[row][col] == val) {
				return false;
			}
		}
	}
	return true;
}

function buildTable() {
    table = $('table')[0];
	for (let i = 0; i < SIZE; i++) {
		let tr = $('<tr/>').appendTo(table);
		for (let j = 0; j < SIZE; j++) {
			let td = $('<td/>').appendTo(tr);
		}
	}

    for (let row = 0; row < SIZE; row++) {
    	for (let col = 0; col < SIZE; col++) {
    		if (grid[row][col] != EMPTY) {
                setSolution(row, col, grid[row][col]);
    		}
    	}
    }
}

$('td').click(function(e) {
	$('td').removeClass('selected');
	$(this).addClass('selected');
});

$(document).keydown(function(e) {
	let selected = $('td.selected');

	const ONE = 49, NINE = 57, BACKSPACE = 8;
	if (!selected.hasClass('solution')) {
		if (e.which >= ONE && e.which <= NINE) {
			let num = e.keyCode - ONE + 1;
			selected.text(num);
            check();
		} else if (e.which == BACKSPACE) {
			selected.empty();
		}
	}

	const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	let target = [];
	if (e.which == LEFT) {
		target = selected.prev();
	} else if (e.which == UP) {
		let td = 'td:eq(' + selected.index() + ')';
		target = selected.parent().prev().find(td);
	} else if (e.which == RIGHT) {
		target = selected.next();
	} else if (e.which == DOWN) {
		let td = 'td:eq(' + selected.index() + ')';
		target = selected.parent().next().find(td);
	}

	if (target.length) {
		selected.removeClass('selected');
		target.addClass('selected');
	}
});

function getCell(i, j) {
    return Number($(table.rows[i].cells[j]).text());
}

function setSolution(i, j, value) {
	setCell(i, j, value);
	$(table.rows[i].cells[j]).addClass('solution');
}

function setCell(i, j, value) {
	$(table.rows[i].cells[j]).text(value);
}
