const name = {
	'44'		:'eeceeeecee',
	'53'		:'eeceeeceee',
	'62'		:'eeeceeceee',
	'71'		:'eeececeeee',
	'8'			:'eeeecceeee',
	'222'		:'ceeceecee',
	'33'		:'eeeceeecc',
	'321'		:'eeeceecec',
	'312'		:'eeececeec',
	'42'		:'eeeeceecc',
	'24'		:'eeceeeecc',
	'411'		:'eeeececec',
	'51'		:'ececceeee',
	'15'		:'eeeeccece',
	'6'			:'eeeeeeccc',
	'square'	:'ecececec',
	'kite'		:'ececcece',
	'barrel'	:'ceecceec',
	'shield'	:'ccceecee',
	'lf'		:'ceeccece',
	'rf'		:'ececceec',
	'lp'		:'eeececcc',
	'rp'		:'ccceceee',
	'mushroom'	:'eeccecce',
	'scallop'	:'eeccccee',
	'pair'		:'eeccccc',
	'perp'		:'ececccc',
	'para'		:'ccceecc',
	'star'		:'cccccc',
};
function isce(s){
	var ans = true;
	for(var i = 0; i < s.length; ++i)
		ans &= (s[i] == 'c' || s[i] == 'e');
	return ans;
}

var rad = 100;
var dia = rad * (1 + Math.sqrt(3)) / 2;
var ang = Math.PI / 6;
var usl = Math.PI * -5 / 12;
var dsl = Math.PI * -7 / 12;

function edge(rot){
	beginShape();
	vertex(0, 0);
	vertex(rad * cos(rot), rad * sin(rot));
	vertex(rad * cos(ang + rot), rad * sin(ang + rot));
	endShape(CLOSE);
}
function corner(rot){
	beginShape();
	vertex(0, 0);
	vertex(rad * cos(rot), rad * sin(rot));
	vertex(dia * cos(ang + rot), dia * sin(ang + rot));
	vertex(rad * cos(ang * 2 + rot), rad * sin(ang * 2 + rot));
	endShape(CLOSE);
}
class SQFace{
	constructor(x, y, rad, slipos, slicol, state){
		this.x = x;
		this.y = y;
		this.rad = rad;
		this.dia = this.rad * (1 + Math.sqrt(3)) / 2;
		this.slipos = slipos;
		this.slicol = slicol;
		this.state = state;
	}
	rotateCW(){
		var ns = '';
		ns += this.state[this.state.length - 1];
		for(var i = 0; i < this.state.length - 1; ++i)
			ns += this.state[i];
		this.state = ns;
	}
	render(){
		translate(this.x, this.y);
		strokeWeight(3);
		strokeCap(ROUND);
		strokeJoin(ROUND);
		stroke(0);
		fill(220);
		var cur = this.slipos;
		for(var i = 0; i < this.state.length; ++i){
			if(this.state[i] == 'c'){
				corner(cur);
				cur += ang * 2;
			} else if (this.state[i] == 'e'){
				edge(cur);
				cur += ang;
			}
		}
		fill(255);
		if(cur < this.slipos) arc(0, 0, this.rad * 2, this.rad * 2,
			cur, this.slipos);
		strokeWeight(4);
		stroke(this.slicol);
		line(this.dia * cos(this.slipos), this.dia * sin(this.slipos),
			this.dia * -cos(this.slipos), this.dia * -sin(this.slipos));
		translate(-this.x, -this.y);
	}
}
var uface, dface;

function expo(){ saveCanvas(uface.state + dface.state, 'png');}

function update(){
	clear();
	background(0, 0);
	uface.render();
	dface.render();
}

function setup() {
	createCanvas(600, 400);
	uface = new SQFace(150, 200, rad, usl, color(255, 204, 0), 'cececece');
	dface = new SQFace(450, 200, rad, dsl, color(0, 131, 255), 'ecececec');
	update();

	let ufi = createInput('square');
	ufi.position(0, 0);
	ufi.size(100);
	ufi.input(function(){
		if(this.value() in name) uface.state = name[this.value()];
		else if(isce(this.value())) uface.state = this.value();
		else uface.state = '';
		update();
	});

	let urt = createButton('↻');
	urt.position(110, 0);
	urt.size(20);
	urt.mousePressed(function(){ uface.rotateCW(); update()});

	let dfi = createInput('square');
	dfi.position(140, 0);
	dfi.size(100);
	dfi.input(function(){
		if(this.value() in name) dface.state = name[this.value()];
		else if(isce(this.value())) dface.state = this.value();
		else dface.state = '';
		update();
	});

	let drt = createButton('↻');
	drt.position(250, 0);
	drt.size(20);
	drt.mousePressed(function(){ dface.rotateCW(); update()});

	let exbut = createButton('Export');
	exbut.position(280, 0);
	exbut.mousePressed(expo);
}

function draw() {}