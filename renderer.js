// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Vp = 2;
const fo = 1000;
const Vmax = 2;
const Tmax = 0.001;
const N = 10100;

const thick = 1;

class SinusRenderer {
	constructor(canvas) {
		this.ctx = ctx;
	}

	getMappers(mapSinus = x => x, mapX = x => x) {
		return {
			mapSinus,
			mapX,
		}
	}

	renderSinus(color = 'rgb(0,0,256)', phase = 0, mappers = this.getMappers()) {
		const x = [];
		const y = [];

		const tstart =-Tmax;
		const tstop = Tmax;
		const dt = (tstop - tstart) / (N-1);				// time increment over N points
		this.axes.xscale = (this.ctx.canvas.width)/(2*Tmax); 	// x pix per s
		this.axes.yscale = (this.ctx.canvas.height)/(2*Vmax);
		this.axes.yscale = this.axes.yscale;    // y pix per V
		this.axes.N = N;
		 
		  // create function 
		for (let i=0; i<N; i++) {
		 	x[i] = tstart + i*dt;
		 	y[i] = Vp * mappers.mapSinus(
		 		Math.sin(
		 			mappers.mapX(2*3.1415*fo*x[i] + phase*3.1415/180)
		 		)
		 	);
		}

		let i, x0, y0, xscale, yscale, xp, yp;
		  
		x0 = this.axes.x0; 
		y0 = this.axes.y0;
		xscale = this.axes.xscale;  
		yscale = this.axes.yscale;

		this.ctx.beginPath();
		this.ctx.lineWidth = thick;
		this.ctx.strokeStyle = color;
		
		console.log({x, y, x0, y0, yscale, color});

		for (let i=0; i<this.axes.N; i++) {
		 	// translate actual x,y to plot xp,yp
		 	xp = x0 + x[i]*xscale;
		 	yp = y0 - y[i]*yscale;
		 	
		 	// draw ine to next point
			if (i==0) ctx.moveTo( xp, yp );
			else      ctx.lineTo( xp, yp );
		 }
		 
		 ctx.stroke();
	}

	renderAxes() {
		this.ctx.fillStyle = "#dddddd";
		this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.axes = {
		 	x0: 0.5 + 0.5*this.ctx.canvas.width,
		 	y0: 0.5 + 0.5*this.ctx.canvas.height
		};

		const x0 = this.axes.x0;
		const w  = this.ctx.canvas.width;
		const y0 = this.axes.y0;
		const h  = this.ctx.canvas.height;
		 
		this.ctx.beginPath();
		this.ctx.strokeStyle = "rgb(128,128,128)"; 
		this.ctx.moveTo(0,y0);    
		this.ctx.lineTo(w,y0);  
		this.ctx.moveTo(x0,0);    
		this.ctx.lineTo(x0,h); 
		this.ctx.stroke();
	}
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const renderer = new SinusRenderer(ctx);

const render = () => {
	renderer.renderAxes();
	renderer.renderSinus('rgb(255,0,0)');
	renderer.renderSinus('rgb(0,255,0)', 90);

	renderer.renderSinus('rgb(0,0,255)', 0, renderer.getMappers(
		sin => sin / 2,
		x => x * x,
	))
}

render();

window.addEventListener('resize', render);
