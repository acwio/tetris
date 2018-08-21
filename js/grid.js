function Grid(gridDiv) {
    this.gridDiv=document.getElementById(gridDiv);

    this.inititialiseCells();

    this.previewDiv=document.getElementById('js-next-piece');

    this.initialisePreviewCells();

    this.timer=new Timer(this);

    this.keyListener=new window.KeyListener(this);

    this.startGame();
}

Grid.prototype = {
    // initial grid size
    size:window.Config.size,

    // the div this grid appears in
    gridDiv:{},

    // an array of cells, based on size
    cells:[],

    // current level
    level:0,

    // level definitions, such as interval, score thresh-hold etc
    levels:window.Config.levels,

    // the currently generated pieces
    pieces:[],    

    // preview panel
    previewCells:[],
    previewDiv:{},

    // the running score total
    score:0,

    // portal locations
    portalEntry: null,
    portalExit: null,

    /**
     *  inititialiseCells() - builds an array of cell objects
     */
    inititialiseCells:function()
    {
         // before the grid has been created, get locations for portals
         this.portalEntry = new window.Portal('entry', this.size, null);
         this.portalExit = new window.Portal('exit', this.size, this.portalEntry.startPosition); 
        

         // iterate over the cells and create
        for (var y=0;y<this.size.height;y++)
        {    
            this.cells[y]=[]; // Create the column
            for (var x=0;x<this.size.width;x++)
            {

                // (1) Annotate Portals for Entry and exit
                // check if this is an entry portal cell
                var isEntryPortal = false;
                for(var i = 0; i < this.portalEntry.position.length; i++){
                    var portalX = this.portalEntry.position[i].x;
                    var portalY = this.portalEntry.position[i].y;

                    if(x === portalX && y === portalY){
                        isEntryPortal = true;
                    }
                }
                
                // check if this is an exit portal cell
                var isExitPortal = false
                for(var i = 0; i < this.portalExit.position.length; i++){
                    var portalX = this.portalExit.position[i].x;
                    var portalY = this.portalExit.position[i].y;

                    if(x === portalX && y === portalY){
                        isExitPortal = true;
                    }
                }

                // (2) Create the cells for the grid
                this.cells[y][x]=new window.Cell(x,y,isEntryPortal,isExitPortal); // Create the cell 
                this.cells[y][x].buildCellHtml()
                this.cells[y][x].appendCell(this.gridDiv);
            }
        }
    },  

    /**
     *  initialisePreviewCells() - sets up the piece preview cells
     */
    initialisePreviewCells: function()
    {
        for (var y=0; y<5; y++)
        {
            this.previewCells[y]=[];
            for (var x=0; x<5; x++)
            {
                this.previewCells[y][x]=new window.Cell(x,y);
                this.previewCells[y][x].buildCellHtml()
                this.previewCells[y][x].appendCell(this.previewDiv);
            }

        }

    },

    /**
     *  startGame() - triggers a game, including piece generation and timing
     */
    startGame:function()
    {
        // create two game pieces: one for the game, and one for the preview window
        this.addPieceToGame();
        this.addPieceToGame();
        this.pieces[0].displayPreviewPiece(this.previewCells);
        this.pieces[1].displayPiece(this.cells);
        this.timer.startTimer();
    },      

    /**
     *  addPieceToGame() - generates a new piece object for play
     */
    addPieceToGame:function()
    {
        this.pieces.unshift(new Piece());
    },

    /**
     *  outputScore() - put the score on the screen
     */
    outputScore: function()
    {
        document.getElementById("js-score").innerHTML=this.score;
    },

    /**
     *  outputLevel() - put the level on the screen
     */
    outputLevel: function()
    {
        document.getElementById("js-level").innerHTML=this.level;
    },

    /**
     *  findCompletedRows() - looks for completed rows now this piece is stopped
     */
    findCompletedRows: function(piecePosition)
    {
        // get the rows this piece occupies
        var rowsToCheck={};
        for (var index in piecePosition)
        {
            rowsToCheck[piecePosition[index].y]=1;

        }

        // iterate over those rows checking for a full set of states
        var removeRows={};
        for (var row in rowsToCheck)
        {
            var cellCount=0;
            for (var x=0; x<this.size.width; x++)
            {
                cellCount+=this.cells[row][x].state;

            }

            if (cellCount === this.size.width)
            {
                removeRows[row]=1;
            }
        }

        // if completed then trigger completed row function
        var score=Object.keys(removeRows).length * Object.keys(removeRows).length;
        this.score+=score;
        this.outputScore();
        for (var removeRow in removeRows)
        {
            // set all cells in the row to white and state=0
            for (var x=0; x<this.size.width; x++)
            {
                this.cells[removeRow][x].unmarkCell();

                // look up this column setting colour and state 
                for (var y=removeRow; y>=0; y--)
                {
                    if ((y-1)>=0)
                    {
                        if (1==this.cells[y-1][x].state)
                        {
                            this.cells[y][x].markCell(this.cells[y-1][x].colour);
                        }
                        else
                        {
                            this.cells[y][x].unmarkCell();
                        }
                    }
                }
            }
        }
    }
};

window.Grid = Grid;