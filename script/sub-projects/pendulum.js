"use strict";

const pendulum = {

    ImageData: DiagramCtx.createImageData(WIDTH, HEIGHT),

    isMouseDown: false,
    pointer: {x: 0, y: 0},
    pendulumControlsHtml: `<div><p>Drag box from the center, release, and watch it wobbling.</p></div>`,

    oldPosition: 0,
    counter: 0,
    centerOffsets: {x: 2, y: 1},

    scale: 2 / HEIGHT,
    counter: 0,

    borderColor: {red: 0, green: 0, blue: 0, alpha: 255},
    freeColor: {red: 128, green: 196, blue: 255, alpha: 255},
    dragColor: {red: 255, green: 196, blue: 128, alpha: 255},

    mass: {
        position: 0,
        momentum: 0,
        isDraggable: false,
        size: 0.1,
        borderColor: {red: 0, green: 0, blue: 0, alpha: 255},
        fillColor: {red: 128, green: 196, blue: 255, alpha: 255},
    },


    initiate: function() {		
		$ControlPanel.html(this.pendulumControlsHtml);
		
		this.updateDisplay();
        this.evolve();
    },

    updateControls: function() {
        this.pendulumControlsHtml = `<div>
            <p>Drag box from the center, release, and watch it wobbling.</p>
            <p>Cursor positions:<br/>X: ${Math.floor(1000*this.pointer.x)/1000}<br/>Y: ${Math.floor(1000*this.pointer.y)/1000}</p>
            <p>Body position: ${this.mass.position},<br/>body momentum: ${this.mass.momentum}</p>
        </div>`;
        $ControlPanel.html(this.pendulumControlsHtml);
    },

    updateDisplay: function() {
        simpleGraph.draw ( 
            this.ImageData, [], 
            {startX: -this.centerOffsets.x, endX: this.centerOffsets.x, startY: -this.centerOffsets.y, endY: this.centerOffsets.y}, 
            true, true );

        canvas.drawBox(
            this.ImageData, 
            {x: this.mass.position, y: 0}, 
            {offX: this.centerOffsets.x, offY: this.centerOffsets.y},
            'centered',
            this.scale, 
            {width: this.mass.size, height: this.mass.size}, 
            {borders: this.mass.borderColor, fill: this.mass.fillColor});

        DiagramCtx.putImageData(this.ImageData, 0, 0);
    },

    changeColorOnDrag: function(ev) {
        let movement = 0;
        if (ev.type === 'mousedown' || this.isMouseDown) {
            if (this.pointer.x > this.mass.position - this.mass.size/2 && 
                this.pointer.x < this.mass.position + this.mass.size/2 && 
                this.pointer.y > 0 - this.mass.size/2 && 
                this.pointer.y < 0 + this.mass.size/2) {
                
    //            startPosition = this.pointer.x;
                this.mass.isDraggable = true;
                this.mass.fillColor = this.dragColor;
            } else {
            //    console.log(`outside box`);
                this.mass.fillColor = this.freeColor;
            }
            this.updateDisplay();
        }

        if (ev.type === 'mousedown') {
            this.oldPosition = this.pointer.x;
        }

        if (this.isMouseDown && ev.type === 'mousemove') {
            movement = this.pointer.x - this.oldPosition;
            this.dragObject(movement);
            this.oldPosition = this.pointer.x;
        }
        
        if (ev.type === 'mouseup') {
            if (this.mass.isDraggable) {
                this.mass.isDraggable = false;
            }
            
            this.mass.fillColor = this.freeColor;
            this.updateDisplay();
        }
    },

    dragObject: function(movement) {
        if (this.mass.isDraggable) {
            this.mass.position+= movement;
            this.updateControls();
            this.updateDisplay();
        }
    },

    evolve: function() {
        // 
        const deltaT = 0.03333;
        const friction = 0;

        if (!this.mass.isDraggable)
        {
            this.mass.position = this.mass.position + deltaT * this.mass.momentum;
            this.mass.momentum = (this.mass.momentum - deltaT * this.mass.position) * (1 - friction);
            this.updateControls();
        } else {
            this.mass.momentum = 0;
        }
        this.updateDisplay();

        setTimeout(function(){pendulum.evolve()}, deltaT*1000);
       
    },

    handleEvent: function(ev) {
        if (ev) {
            this.pointer.x = ev.offsetX*this.scale - this.centerOffsets.x;
            this.pointer.y = - ev.offsetY*this.scale + this.centerOffsets.y;
            this.changeColorOnDrag(ev);
            if (this.isMouseDown && ev) {
                this.updateControls();
            }
        }

        if ( ev.type === 'mousedown' ) {
			this.isMouseDown = true;
		} else if ( ev.type === 'mouseup' ) {
			this.isMouseDown = false;
		}

    }
};

