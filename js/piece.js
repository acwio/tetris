'use strict';

function Piece() {

    this.currentPosition={};

    this.selectShape();

    this.selectColour();

    this.allowedMoves={
        'left':true,
        'right':true,
        'down':true,
        'rotate':true
    };

    // state variables for the Piece instance
    this.stopped=false;
    this.inPortal = false;

    this.devOutput();

}

Piece.prototype = {

    // stores what moves can be made from the current piece position
    allowedMoves:{
        'left':true,
        'right':true,
        'down':true,
        'rotate':true
    },

    // stores the colour of this piece
    colour:'',

    // the set of colours this piece may take, needs to correspond to _colours.scss
    colours:{
        0:'blue',
        1:'green',
        2:'yellow',
        3:'red',
        4:'grey',
        5:'black',
        6:'purple',
        7:'orange',
        8:'turquoise'
    },

    // the current set of co-ordinates for this piece, four x/ys
    currentPosition:{},

    // the current orientation of this piece
    currentOrientation:0,

    // as above two but for next
    nextPosition:{},
    nextOrientation:0,

    // the shape of this piece
    shape:{},

    // shapes including their initial positions on a ten wide grid
    // positions can be centred for other grid widths by incrementing
    // or decrementing all x co-ordinates
    shapes:{
        // I 0123456789  0123456789   
        // 0 .....#....  ..........  
        // 1 .....#....  ...####...  
        // 2 .....#....  ..........  
        // 3 .....#....  ..........  
        0:
        {               
            0:{0:{x:5,y:0},1:{x:5,y:1},2:{x:5,y:2},3:{x:5,y:3}},
            1:{0:{x:3,y:1},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}} 
        },
        // J 0123456789  0123456789  0123456789  0123456789     
        // 0 .....#....  ....#.....  .....##...  ..........    
        // 1 .....#....  ....###...  .....#....  ....###...    
        // 2 ....##....  ..........  .....#....  ......#...    
        // 3 ..........  ..........  ..........  ..........    
        1:
        {               
            0:{0:{x:5,y:0},1:{x:5,y:1},2:{x:4,y:2},3:{x:5,y:2}},               
            1:{0:{x:4,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}}, 
            2:{0:{x:5,y:0},1:{x:6,y:0},2:{x:5,y:1},3:{x:5,y:2}},                 
            3:{0:{x:4,y:1},1:{x:5,y:1},2:{x:6,y:1},3:{x:6,y:2}}
        },
        // L 0123456789  0123456789  0123456789  0123456789 
        // 0 .....#....  ..........  ....##....  ......#...
        // 1 .....#....  ....###...  .....#....  ....###...
        // 2 .....##...  ....#.....  .....#....  ..........
        // 3 ..........  ..........  ..........  ..........
        2:
        {
            0:{0:{x:5,y:0},1:{x:5,y:1},2:{x:5,y:2},3:{x:6,y:2}},                
            1:{0:{x:4,y:1},1:{x:5,y:1},2:{x:6,y:1},3:{x:4,y:2}},                
            2:{0:{x:4,y:0},1:{x:5,y:0},2:{x:5,y:1},3:{x:5,y:2}},                
            3:{0:{x:6,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}}
        },
        // O 0123456789
        // 0 ....##....
        // 1 ....##....
        // 2 ..........
        // 3 ..........
        3:
        {
            0:{0:{x:4,y:0},1:{x:5,y:0},2:{x:4,y:1},3:{x:5,y:1}}
        },
        // S 0123456789  0123456789   
        // 0 .....##...  ....#.....  
        // 1 ....##....  ....##....  
        // 2 ..........  .....#....  
        // 3 ..........  ..........
        4:
        {
            0:{0:{x:5,y:0},1:{x:6,y:0},2:{x:4,y:1},3:{x:5,y:1}},                
            1:{0:{x:4,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:5,y:2}}
        },
        // T 0123456789  0123456789  0123456789  0123456789 
        // 0 ..........  .....#....  .....#....  .....#....
        // 1 ....###...  ....##....  ....###...  .....##...
        // 2 .....#....  .....#....  ..........  .....#....
        // 3 ..........  ..........  ..........  ..........
        5:
        {
            0:{0:{x:4,y:1},1:{x:5,y:1},2:{x:6,y:1},3:{x:5,y:2}},                
            1:{0:{x:5,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:5,y:2}},
            2:{0:{x:5,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:6,y:1}},                
            3:{0:{x:5,y:0},1:{x:5,y:1},2:{x:6,y:1},3:{x:5,y:2}}
        },
        // Z 0123456789  0123456789   
        // 0 ....##....  .....#....  
        // 1 .....##...  ....##....  
        // 2 ..........  ....#.....  
        // 3 ..........  ..........
        6:
        {
            0:{0:{x:4,y:0},1:{x:5,y:0},2:{x:5,y:1},3:{x:6,y:1}},                
            1:{0:{x:5,y:0},1:{x:4,y:1},2:{x:5,y:1},3:{x:4,y:2}}
        }
    },

    // is this piece stopped, ie rached as far down as it will go and so a new piece is required
    stopped:false,

    /**
     *  countElements() - count the elements in an object
     *
     *  @param count - integer count of object properties
     */
    countElements: function(obj)
    {

        return Object.keys(obj).length;

    },

    /**
     *  selectShape() - selects a shape and orientation
     */
    selectShape:function()
    {

        // select one of seven pieces at random
        this.shape=this.shapes[this.selectRandom(this.shapes)];

        // select a current orientation from that shape
        this.currentOrientation=this.selectRandom(this.shape);

        // clone that orientation into the current position property so
        // shapes array is not edited on piece move
        this.cloneOrientation();

    },

    /**
     *  selectColour() - selects a colour for this piece
     */
    selectColour:function()
    {

        this.colour=this.colours[this.selectRandom(this.colours)];

    },

    /**
     *  selectRandom() - randomly selects a ref num from a count of object properties
     *
     *  @param count - integer count of object properties
     */
    selectRandom: function (obj) 
    {

        return Math.floor(Math.random() * this.countElements(obj));

    },

    /**
     *  cloneOrientation() - copy the orientation into the object from the shapes
     */
    cloneOrientation: function()
    {
        this.currentPosition={
            0:{
                x:this.shape[this.currentOrientation][0].x,
                y:this.shape[this.currentOrientation][0].y
            },
            1:{
                x:this.shape[this.currentOrientation][1].x,
                y:this.shape[this.currentOrientation][1].y
            },
            2:{
                x:this.shape[this.currentOrientation][2].x,
                y:this.shape[this.currentOrientation][2].y
            },
            3:{
                x:this.shape[this.currentOrientation][3].x,
                y:this.shape[this.currentOrientation][3].y
            }
        }
    },

    /**
     *  getNextOrientation() - looks at the next orientation for this piece
     */
    getNextOrientation: function()
    {

        var count=this.countElements(this.shape);

        if (this.currentOrientation === (count - 1))
        {

            var orientation=this.shape[0];

            this.nextOrientation=0;

            return orientation;

        }
        else
        {

            var orientation=this.shape[this.currentOrientation + 1];

            this.nextOrientation=this.currentOrientation + 1;

            return orientation;

        }

    },

    /**
     *  displayPiece() - set the current piece to be visible on the screen in its current
     *      position
     *  @param cells - the array of cells
     */
    displayPiece:function(cells)
    {

        for (var index in this.currentPosition)
        {

            var coordinates=this.currentPosition[index];

            cells[coordinates.y][coordinates.x].markCell(this.colour);

        }

    },

    /**
     *  displayPreviewPiece() - place a piece in the preview window
     */
    displayPreviewPiece: function(previewCells)
    {

        for (var y=0; y<5; y++)
        {

            for (var x=0; x<5; x++)
            {

                previewCells[y][x].unmarkCell();

            }

        }

        for (var index in this.currentPosition)
        {

            var coordinates=this.currentPosition[index];

            previewCells[coordinates.y+1][coordinates.x-3].markCell(this.colour);

        }

    },

    /**
     *  movePiece() - moves a piece one cell in the given direction
     *  @param cells - grid for reference
     *  @param cells - array of cells for redrawing
     *  @param direction - left, right or down
     *  @param interval - timing interval for pausing set stopped action
     */
    movePiece:function(grid,cells,direction,interval)
    {
        if (false === this.checkMove('down') &&
            'down' === direction)
        {
            // delay set stopped so that piece can be moved either side
            var pauseInterval=interval-1; // remove one millisecond so as not to interfere with next interval

            var t=this;

            setTimeout(function() { t.setStopped(); },pauseInterval);

        }
        else
        {
            
            if (true === this.checkMove(direction))
            {
                for (var index in this.currentPosition)
                {

                    var coordinates=this.currentPosition[index];

                    cells[coordinates.y][coordinates.x].unmarkCell();

                    this.setNewCoordinates(grid,coordinates,direction);

                }

                this.setAllowedMoves(cells);

                this.displayPiece(cells);

                for (var y=0;y<grid.cells.length;y++)
                {    
                    for (var x=0;x<grid.cells[y].length;x++)
                    {
                        grid.cells[y][x].priorState = 0;
                    }
                }
            }
        }
    },

    /**
     *  setNewCoordinates() - sets the new coordinates based on direction
     *  @param grid - the grid for reference
     *  @param currentCoordinates - the cell coordinates to work on
     *  @param direction - direction the piece should move
     *  @param enteringPortal - flag for whether or not at least one cell in the piece is entering the portal
     *  @param portalConstraintsMet - flag for whether or not any of the cells in the piece should move through the portal
     */
    setNewCoordinates:function (grid,currentCoordinates,direction,)
    {
        // check if the piece still has cells entering the portal
        var isPieceMovingThroughPortal = this.checkIfPieceIsMovingThroughPortal(grid, grid.portalEntry.position);

        // check if the current cell is entering a portal
        var isEnteringPortal= this.checkPortalEntry(grid, currentCoordinates);
        var portalEntryIdx = isEnteringPortal[1];
        var isEnteringPortal = isEnteringPortal[0];

        // check if all portal constraints would be met, if the piece is moving through the portal
        var portalConstraintsMet = false;
        portalConstraintsMet = this.validateMoveThroughPortal(grid);

        switch(direction)
        {
            case 'left':
                if(!isPieceMovingThroughPortal && !isEnteringPortal){
                    currentCoordinates.x--;
                }
                break;
            case 'right':
                if(!isPieceMovingThroughPortal && !isEnteringPortal){
                    currentCoordinates.x++;
                }
                break;
            case 'down':

                // if this is the entry portal, we should send the coordinates through the portal instead of incrementing
                if(isEnteringPortal && portalConstraintsMet){
                    currentCoordinates.y = grid.portalExit.position[portalEntryIdx].y;
                    currentCoordinates.x = grid.portalExit.position[portalEntryIdx].x;
                } else {
                    currentCoordinates.y++;
                }

                break;
        }     
        
    },

    /**
     *  rotate() - rotate the current piece clockwise
     */
    rotate:function(cells)
    {

        if (true === this.checkMove('rotate') && !this.inPortal)
        {
            // get the next orientation
            this.nextPosition=this.getNextOrientation();

            // compute cell differences, i.e. the relationship between current and next
            // use the original orientation
            var compareOrientation=this.shape[this.currentOrientation];

            // get x and y offset from the original orientation position
            var xoffset=this.currentPosition[0].x - compareOrientation[0].x;
            var yoffset=this.currentPosition[0].y - compareOrientation[0].y;

            for (var index in this.currentPosition)
            {

                var coordinates=this.currentPosition[index];

                cells[coordinates.y][coordinates.x].unmarkCell();

                this.currentPosition[index].x=(this.nextPosition[index].x + xoffset);
                this.currentPosition[index].y=(this.nextPosition[index].y + yoffset);

            }

            this.setAllowedMoves(cells);

            this.displayPiece(cells);

            this.currentOrientation=this.nextOrientation;

        }

    },

    /**
     *  setStopped() - set this piece as stopped, this is checked by the interval timer
     *      and used to generate the new pieces
     */
    setStopped: function ()
    {

        this.stopped=true;

    },

    /**
     *  resetAllowedMoves() - sets all allowed moves to true - required so that a piece
     *      move made before into an unmovable position doesn't block a legal move now
     */
    resetAllowedMoves: function()
    {

        this.allowedMoves['left']=true;
        this.allowedMoves['right']=true;
        this.allowedMoves['down']=true;
        this.allowedMoves['rotate']=true;

    },

    /**
     *  setAllowedMoves() - takes the current position and checks for the allowed moves
     *  @param cells - the array of cells
     */
    setAllowedMoves: function(cells)
    {

        this.resetAllowedMoves();

        for (var index in this.currentPosition)
        {

            var coordinates=this.currentPosition[index];

            if (0 === coordinates.x ||
                1 === cells[coordinates.y][(coordinates.x - 1)].state || this.inPortal)
            {

                this.allowedMoves['left']=false;

            }

            if ((Config.size.width - 1) === coordinates.x ||
                1 === cells[coordinates.y][(coordinates.x + 1)].state || this.inPortal)
            {

                this.allowedMoves['right']=false;

            }

            if ((Config.size.height - 1) === coordinates.y ||
                1 === cells[(coordinates.y + 1)][coordinates.x].state)
            {

                this.allowedMoves['down']=false;

            }

        }

        // rotate
        // get the next orientation
        var nextPositionTest=this.getNextOrientation();

        // compute cell differences, i.e. the relationship between current and next
        // use the original orientation
        var compareOrientation=this.shape[this.currentOrientation];

        // get x and y offset from the original orientation position
        var xoffset=this.currentPosition[0].x - compareOrientation[0].x;
        var yoffset=this.currentPosition[0].y - compareOrientation[0].y;

        for (var index in this.currentPosition)
        {

            var coordinates=this.currentPosition[index];

            var nextPosX=nextPositionTest[index].x + xoffset;
            var nextPosY=nextPositionTest[index].y + yoffset;

            if (nextPosX<0 ||
                nextPosX>=Config.size.width)
            {

                this.allowedMoves['rotate']=false;

                break;

            }

            if (nextPosY<0 ||
                nextPosY>=Config.size.height)
            {

                this.allowedMoves['rotate']=false;

                break;

            }

            if (1 === cells[nextPosY][nextPosX].state)
            {

                this.allowedMoves['rotate']=false;

                break;
                
            }

        }

    },

    /**
     *  checkMove() - looks at allowed moves to see if the move event is viable
     */
    checkMove:function(move)
    {
        return this.allowedMoves[move];
    },

    /**
     * checkPortalEntry - detects if one cell of a piece is moving through a portal
     *      returns the boolean value and the index of the last piece that will movie through the portal on the next game interval
     */
    checkPortalEntry: function(grid,coordinates){
        // check if the block is entering a portal
        var isEnteringPortal = false;
        var isEntryCellIdx = -1;
        
        for(var i = 0; i < grid.portalEntry.position.length; i++){
            var portalX = grid.portalEntry.position[i].x;
            var portalY = grid.portalEntry.position[i].y;

            if(coordinates.x === portalX && coordinates.y === portalY-1){
                isEnteringPortal = true;
                isEntryCellIdx = i;
            }
        }

        // return the truth value alongside the index of where the column to be moved to
        return [isEnteringPortal, isEntryCellIdx];
    },

    /**
     * validateMoveThroughPortal - checks if a tetris piece meets all constraints for moving through a portal.
     */
    validateMoveThroughPortal: function(grid){

        // determine if the piece meets the constraints for the entry and exit portals
        var pieceAlignedWithEntryPortal = this.isAlignedWithEntryPortal(Object.values(this.currentPosition), grid.portalEntry.position);
        var pieceCanFitThroughEntryPortal = this.canFitThroughEntryPortal(Object.values(this.currentPosition), grid.portalEntry.position);
        var pieceCanAvoidCollisionThroughExitPortal = this.canAvoidCollisionThroughExitPortal(Object.values(this.currentPosition), grid.portalExit.position);

        // return the AND of all three booleans
        return pieceAlignedWithEntryPortal && pieceCanFitThroughEntryPortal && pieceCanAvoidCollisionThroughExitPortal;
    },

    /**
     * isAlignedWithEntryPortal - check if the piece's cells are aligned with same grid cell columns as the portal
     * @param piecePositions - an array of the Piece instance's coordinates'
     * @param exitPortalPositions - an array of JavaScript Objects that have the coordinates of the portal location, e.g. [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]
     */
    isAlignedWithEntryPortal: function(piecePositions, entryPortalPositions){
       
    },

    /**
     * canFitThroughEntryPortal - check if width of the piece's neighbouring cells exceed the portal's width
     * @param piecePositions - an array of the Piece instance's coordinates'
     * @param entryPortalPositions - an array of JavaScript Objects that have the coordinates of the portal location, e.g. [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]
     */
    canFitThroughEntryPortal: function(piecePositions, entryPortalPositions){
        
    },

    /**
     * canAvoidCollisionThroughExitPortal - check if the piece's cells will overlap with existing pieces in the grid array if it moves through the portal
     * @param piecePositions - an array of the Piece instance's coordinates'
     * @param exitPortalPositions - an array of JavaScript Objects that have the coordinates of the portal location, e.g. [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]
     */
    canAvoidCollisionThroughExitPortal: function(piecePositions, exitPortalPositions){
       
    },

    /**
     * checkIfPieceIsMovingThroughPortal - check if the piece's cells are still moving through the entry portal 
     * @param grid - the tetris grid that includes locations of pieces
     * @param entryPortalPositions - an array of JavaScript Objects that have the coordinates of the portal location, e.g. [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]
     */
    checkIfPieceIsMovingThroughPortal: function(grid, entryPortalPositions){
        // iterate over the coordinates of the entry portal's position and check if a piece's cell shares an edge with the entry portal
        for(var i = 0; i < entryPortalPositions.length; i++){
            var xIdx = entryPortalPositions[i].x;
            var yIdx = entryPortalPositions[i].y;
            
            if(grid.cells[yIdx-1][xIdx].priorState === 1 || grid.cells[yIdx-1][xIdx].cellHtml.className.indexOf('white') === -1){
                this.inPortal = true;
                return true;
            }
        }

        // otherwise, return false
        this.inPortal = false;
        return false;
    },

    /**
     *  devOutput() - adds this pieces data to the piece array dev output
     */
    devOutput: function()
    {
        var devPieceOut=document.createElement("div");
        var coordinates="<span class='dev-coordinates'>";
        var c=1;

        for (var coords in this.currentPosition)
        {

            coordinates+=c+"y:"+this.currentPosition[coords].y+" x:"+this.currentPosition[coords].x+"; ";

            c++;
        }

        coordinates+="</span><br/><br/>";

        devPieceOut.innerHTML=coordinates;

        var allowedMoves="<span class='dev-allowed'>";

        for (var allowed in this.allowedMoves)
        {
            allowedMoves+=this.allowedMoves[allowed]+"; ";
            c++;
        }

        allowedMoves+="</span><br/><br/>";

        devPieceOut.innerHTML=JSON.stringify(this,null,4)+"<br/><br/>";

        //devPieceOut.innerHTML=JSON.stringify(this.shapes,null,4)+"<br/><br/>";

        //document.getElementById("js-piece-data").appendChild(devPieceOut);

    }

};

window.Piece = Piece;