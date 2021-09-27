"use strict";

const chain = {

    ImageData: DiagramCtx.createImageData(WIDTH, HEIGHT),

    $StartButton: {},

    numberOfMasses: 0,
    isMouseDown: false,
    pointer: {x: 0, y: 0},
 //   chainControlsHtml: ``,

    oldPosition: 0,
    counter: 0,
    centerOffsets: {x: 2, y: 1},

    positionsArray: [],
    momentaArray: [],

    scale: 2 / HEIGHT,
    counter: 0,

    borderColor: {red: 0, green: 0, blue: 0, alpha: 255},
    freeColor: {red: 0, green: 0, blue: 255, alpha: 255},
    dragColor: {red: 0, green: 255, blue: 0, alpha: 255},
    backgroundColor: {red: 250, green: 255, blue: 240, alpha: 255},

    masses: [{
        position: { x: 0, y: 0 },
        momentum: 0,
        isDraggable: false,
        size: 0.04,
        borderColor: {red: 0, green: 0, blue: 0, alpha: 255},
        fillColor: {red: 0, green: 0, blue: 255, alpha: 255},
    }],


    initiate: function() {		
		const chainControlsHtml = 
        `<div><p>Drag some of boxes, release, and watch them wobbling.</p></div>
        <div class="PiCalc_top">Click here to start movement: <div class="button" id="start">Start</div></div>`;
        
        $ControlPanel.html(chainControlsHtml);

        this.$StartButton = $(`#start`);
        const numMiddleMasses = 51;
        this.numberOfMasses = numMiddleMasses + 2;
        this.masses.length = 0;
        this.positionsArray.length = this.numberOfMasses;
        this.momentaArray.length = this.numberOfMasses;
        

        for ( let i = 0; i < this.numberOfMasses; i++ ) {
            const mass = {
                position: { x: -this.centerOffsets.x + i*(this.centerOffsets.x*2/(numMiddleMasses+1)), y: 0 },
                momentum: 0,
                isDraggable: false,
                size: 0.04,
                borderColor: {red: 0, green: 0, blue: 0, alpha: 255},
                fillColor: {red: 0, green: 0, blue: 255, alpha: 255},
            };

        //    console.log(`mass ${i}: `, mass);

            this.masses.push(mass);
        }
		
		this.updateDisplay();
    //    this.evolve();
    },

    updateDisplay: function() {
        canvas.fill(this.ImageData, this.backgroundColor);

        for ( let i = 0; i < this.numberOfMasses; i++ ) {
            canvas.drawBox(
                this.ImageData, 
                {x: this.masses[i].position.x, y: -this.masses[i].position.y}, 
                {offX: this.centerOffsets.x, offY: this.centerOffsets.y},
                'centered',
                this.scale, 
                {width: this.masses[i].size, height: this.masses[i].size}, 
                {borders: this.masses[i].borderColor, fill: this.masses[i].fillColor});
        }
        

        DiagramCtx.putImageData(this.ImageData, 0, 0);
    },

    changeColorOnDrag: function(ev) {
        let movement = 0;
    //    
        if (ev.type === 'mousedown' || this.isMouseDown) {
            for (let i = 0; i < this.numberOfMasses; i++) {
                if (this.pointer.x > this.masses[i].position.x - this.masses[i].size/2 && 
                    this.pointer.x < this.masses[i].position.x + this.masses[i].size/2 && 
                    this.pointer.y > this.masses[i].position.y - this.masses[i].size/2 && 
                    this.pointer.y < this.masses[i].position.y + this.masses[i].size/2) {
                    
                    this.masses[i].isDraggable = true;
                    this.masses[i].fillColor = this.dragColor;
                } else {    
                    this.masses[i].fillColor = this.freeColor;
                }
                this.updateDisplay();
            }            
        }

        if (ev.type === 'mousedown') {
            this.oldPosition = this.pointer.y;
        }

        if (this.isMouseDown && ev.type === 'mousemove') {
            movement = this.pointer.y - this.oldPosition;
            this.dragObject(movement);
            this.oldPosition = this.pointer.y;
        }
        
        if (ev.type === 'mouseup') {
            for (let i = 0; i < this.numberOfMasses; i++) {
                if (this.masses[i].isDraggable) {
                    this.masses[i].isDraggable = false;
                }
                
                this.masses[i].fillColor = this.freeColor;
                this.updateDisplay();
            }            
        }
    },

    dragObject: function(movement) {
        for (let i = 0; i < this.numberOfMasses; i++ ) {
            if (this.masses[i].isDraggable) {
                this.masses[i].position.y+= movement;                
            }
        }
        
        this.updateDisplay();
    },

    evolve: function() {
        // 
        const deltaT = 0.03333;
        const friction = 0;

        let someBodyIsDragged = false;
        let draggedMassIndex = -1;

        for (let i = 0; i < this.numberOfMasses; i++) {
            if (this.masses[i].isDraggable) {
                someBodyIsDragged = true;
                draggedMassIndex = i;
                break;
            }
        }        

        if (!someBodyIsDragged) {
          for ( let k = 0; k < 2; k++ ) {
            for (let i = 0; i < this.numberOfMasses; i++) {
                if ( i === 0 || i === this.numberOfMasses-1 )
                {
                    this.positionsArray[i] = 0;
                    this.momentaArray[i] = 0;    
                } else { 
                    this.positionsArray[i] = (this.masses[i].position.y) + deltaT * this.masses[i].momentum;
                    this.momentaArray[i] = (this.masses[i].momentum - deltaT * (2 * this.masses[i].position.y - (this.masses[(i+this.numberOfMasses-1)%this.numberOfMasses].position.y+this.masses[(i+1)%this.numberOfMasses].position.y))) * (1 - friction);
                }
            }

            for (let i = 0; i < this.numberOfMasses; i++) {
                this.masses[i].position.y = this.positionsArray[i];
                this.masses[i].momentum = this.momentaArray[i];
                // this.updateControls();
            }
          }            
        }  else {
            this.masses[draggedMassIndex].momentum = 0;
        }
        
        
        this.updateDisplay();
        
        setTimeout(function(){chain.evolve()}, deltaT*1000);
       
    },

    handleEvent: function(ev) {
        if (ev.target.id === displayId) {
            this.pointer.x = ev.offsetX*this.scale - this.centerOffsets.x;
            this.pointer.y = - ev.offsetY*this.scale + this.centerOffsets.y;
            this.changeColorOnDrag(ev);
        /*    if (this.isMouseDown && ev) {
                this.updateControls();
            } */
        }

        if ( ev.target.id === displayId && ev.type === 'mousedown' ) {
			this.isMouseDown = true;
		} else if ( ev.type === 'mouseup' ) {
			this.isMouseDown = false;
		}

        if ( ev.target.id === cPanelId && ev.type === 'click' ) {
            console.log(`click on start`);
			this.evolve();
		}
    }
};

