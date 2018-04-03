var turn=1;
var props={
	"1":{text:"player1",val:"O"},
	"-1":{text:"Ordinateur",val:"X"}
};
var P1=1,P2=-1;
var main_board=[];
var win=false;
var wins=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];
var play_ai=true;

window.onload=function() {
	$("td").on("click",function(){handleClick(this);});
	$("#play_ai").on("change",function(event){
		play_ai=$(this).is(":checked");
		reset();
	});
}

function handleClick(cell) {
	if(!isEmpty(cell) && !win) return;
	$(cell).text(props[turn+""].val);

	checkWin();
	if(win) return;
	if(play_ai) {
		playAi();
		turn*=-1;
	}
	checkWin();
	turn*=-1;
}

function isFinish() {
	getBoard();
	for(let x of main_board) if(x=="") return false;
	return true;
}

function playAi() {
	getBoard();
	let indexes=[]
	for(let i=0;i<9;i++) if(main_board[i]=="") indexes.push(i);
	let index=-1;
	if(indexes.length==1) index=indexes[0];
	else {
		for(let i in indexes) {
			/*
				CAN AI WIN ?
			*/

			let board=Object.assign([],main_board);
			let val=indexes[i];
			board[val]=props["-1"].val;
			let line=checkLines(board);
			if(line) {//ai win
				index=val;
				break;
			}
		}
		if(index<0) {
			for(let i in indexes) {
				/*
					CAN PLAYER WIN ?
				*/
				board=Object.assign([],main_board);
				val=indexes[i];
				board[val]=props["1"].val;
				line=checkLines(board);
				//console.log(val+" "+line);
				if(line) {//player win
					index=val;
					break;
				}
			}
		}
	}
	if(index<0) index=indexes[Math.floor(Math.random()*indexes.length)];
	setCell(index,props["-1"]);
}

function checkLines(board) {
	getBoard();
	board=board||main_board;
	for(let line of wins) {
		if(isWin(board,line)) return line;
	}
}

function isWin(board,line) {
	return board[line[0]]===board[line[1]] &&
		board[line[0]]===board[line[2]] && 
		board[line[0]]!="";
}
function checkWin() {
	let wining_line=checkLines();
	if(wining_line) {
		color(wining_line);
		win=true;
		display(props[turn+""].text+" a gagné");
	} else if(isFinish()) {
		display("Win-Win");
		win=true;
	}
}

function isEmpty(cell) {
	return $(cell).text()=="";
}

function getBoard() {
	main_board=[];
	for(let x=1;x<=3;x++) {
		for(let y=1;y<=3;y++) {
			main_board.push($("table tr:nth-child("+x+") td:nth-child("+y+")").text());
		}
	}
}

function printBoard(board) {
	getBoard();
	board=board||main_board;
	for(let i=0;i<9;i+=3) {
		console.log(board[i]+"|"+board[i+1]+"|"+board[i+2]);
	}
}

function color(line) {
	$("td").removeClass("colorThat");
	for(let i of line) {
		let x=1+Math.floor(i/3);
		let y=1+i%3;
		$("table tr:nth-child("+x+") td:nth-child("+y+")").addClass("colorThat");
	}
}

function reset() {
	for(let x=1;x<=3;x++) {
		for(let y=1;y<=3;y++) {
			$("table tr:nth-child("+x+") td:nth-child("+y+")").text("");
			$("table tr:nth-child("+x+") td:nth-child("+y+")").removeAttr("class");
		}
	}
	if(play_ai) props["-1"].text="Ordinateur";
	else props["-1"].text="player2";
	getBoard();
	turn=1;
}

function setCell(i,player) {
	let x=1+Math.floor(i/3);
	let y=1+i%3;
	$("table tr:nth-child("+x+") td:nth-child("+y+")").text(player.val)
	$("table tr:nth-child("+x+") td:nth-child("+y+")").addClass(player.text);
}

function display(text) {
	$("#display").text(text);
}