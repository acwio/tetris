'use strict';

function Cell(x,y,isEntryPortal,isExitPortal) {

    this.x=x;
    this.y=y;
    this.isEntryPortal=isEntryPortal;
    this.isExitPortal=isExitPortal;
}

Cell.prototype = {

    // the div for this cell, with it's classes for colour
    cellHtml:'',

    // dev output to show cell state
    devState:false,

    // cells colour
    colour:'white',

    // the piece to which this cell currently belongs
    piece:{},

    // is this cell filled or not, filled cells restrict moves
    state:0,
    priorState: 0,

    // co-ordinates
    x:0,
    y:0,

    /**
     * appendCell() - adds a cell to the grid div
     * @param gridDiv - the div which contains the playing grid
     */
    appendCell: function(gridDiv)
    {

        gridDiv.appendChild(this.cellHtml);

    },

    /**
     * buildCellHtml() - builds some html for this cell
     */
    buildCellHtml: function()
    {

        this.cellHtml=document.createElement("div");

        if(this.isEntryPortal){
            this.colour = 'white portal-entry';
        } else if(this.isExitPortal){
            this.colour = 'white portal-exit';
        }

        this.addDevOutput();

        this.setHtmlClass();

    },

    /**
     * markCell() - marks a cell as filled and coloured
     *
     * @param colour - colour to mark the cell with
     */
    markCell: function(colour)
    {

        this.setColour(colour);

        this.setState(1);

    },

    /**
     * unmarkCell() - unmarks a cell, back to white and empty
     */
    unmarkCell: function()
    {

        if(this.isEntryPortal){
            this.setColour('white portal-entry');
        } else if(this.isExitPortal){
            this.setColour('white portal-exit');
        }else {
            this.setColour('white');
        }

        this.setState(0);

    },

    /**
     * setColour() - sets the colour for this cell, html and 
     */
    setColour: function(colour)
    {

        this.colour=colour;

        this.setHtmlClass();

    },

    /**
     * setPortal() - sets the type of the portal 
     */
    setPortal: function(type)
    {

        this.colour='white '+type;

        this.setHtmlClass();

    },

    /**
     * setState() - sets a cells state
     *
     * @param state - Boolean part of a piece or not
     */
    setState: function(state)
    {
        this.priorState=this.state;
        this.state=state;

        if (true === this.devState)
        {

            document.getElementById('js-state-dev-'+this.x+'-'+this.y).innerHTML=state;

        }

    },

    /**
     * setHtmlClass() - sets the class for this cell
     */
    setHtmlClass: function()
    {

        this.cellHtml.setAttribute("class","cell "+this.colour);

    },

    /** 
     * addDevOutput() - adds x, y and state values to cells for dev work
     */
    addDevOutput: function()
    {

        if (true === this.devState)
        {

            this.cellHtml.innerHTML="<span id='js-x-dev' class='cell-dev x-dev'>"+this.x+"</span><span id='js-y-dev y-dev' class='cell-dev'>"+this.y+"</span><span id='js-state-dev-"+this.x+"-"+this.y+"' class='cell-dev state-dev'>"+this.state+"</span>";

        }

    }



};

window.Cell = Cell;