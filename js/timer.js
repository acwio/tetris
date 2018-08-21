'use strict';

function Timer(grid) {
     this.grid=grid;

     this.currentInterval= this.grid.levels[0]['interval'];

     this.eventCounterSpan=document.getElementById('js-event-counter');

     this.intervalTrigger = this.intervalTrigger;

}

Timer.prototype = {

    // the current number of milliseconds between timer event
    currentInterval:0,

    // a counter for the number of events since game started
    eventCount:0,

    // a dom element for outputting event count (dev)
    eventCounterSpan:{},

    // stores the interval id for pausing (useful for dev)
    intervalId:null,

    // state, if running === true then the timer is running, else it's paused
    running:true,

    /**
     * startTimer() - sets the timer running in response to a game start
     */
    startTimer:function()
    {
        var that = this;
         this.intervalId = setInterval(that.intervalTrigger.bind(this),that.currentInterval);

         this.running=true;

    },

    /**
     * pauseTimer() - pause the timer
     */
    pauseTimer:function()
    {

        window.clearInterval( this.intervalId);

         this.running=false;

    },

    /**
     * intervalTrigger() - function called each time an interval elapsed
     */
    intervalTrigger:function()
    {
        var pieces= this.grid.pieces;

         this.eventCount++;

         this.eventCounterSpan.innerHTML= this.eventCount;

        pieces[1].movePiece(this.grid, this.grid.cells,'down', this.currentInterval);

        if (true === pieces[1].stopped)
        {

            pieces[1].displayPiece( this.grid.cells);

             this.grid.findCompletedRows(pieces[1].currentPosition);

            pieces.unshift(new Piece());

            pieces[0].displayPreviewPiece(t.grid.previewCells);

            // stop game if new piece won't fit
            var gameOver=false;
            for (var index in pieces[1].currentPosition)
            {

                var coordinates=pieces[1].currentPosition[index];

                if (1 ===  this.grid.cells[coordinates.y][coordinates.x].state)
                {

                    gameOver=true;

                    break;

                }

            }

            if (true === gameOver)
            {
                 this.pauseTimer();
                 document.getElementById('js-game-over').style.display = 'block';               
            }

        }

        // do levels
        var levelData=t.grid.levels[ this.grid.level];
        if ( this.eventCount>=levelData.threshold)
        {

             this.grid.level++;

             this.grid.outputLevel();

             this.pauseTimer();

             this.currentInterval=levelData.interval;

             this.startTimer()

        }

    }

};

window.Timer = Timer;