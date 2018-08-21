'use strict';

var t;

function KeyListener(grid,timer) {

    t=this;

    t.grid=grid;

    t.timer=grid.timer;

    t.inititialiseKeys();

}

KeyListener.prototype = {  

    // the grid the events happen to
    grid:{},     

    // the timer triggering intervals
    timer:{}, 

    /**
     * inititialiseKeys() - adds an event listener for keypresses
     */
    inititialiseKeys:function()
    {

        window.addEventListener('keydown',t.keyListener);

    },

    /**
     * keyListener() - responds to the key presses for game play
     */
    keyListener:function(keyEvent)
    {
        var cells=t.grid.cells;
        var inPlayPiece=t.grid.pieces[1];

        switch (keyEvent.keyCode)
        {
            case 37:                  
                keyEvent.preventDefault();
                inPlayPiece.movePiece(t.grid,cells,'left',t.timer);
                break;
            case 39:
                keyEvent.preventDefault();
                inPlayPiece.movePiece(t.grid,cells,'right',t.timer);
                break;
            case 40:
                keyEvent.preventDefault();
                inPlayPiece.movePiece(t.grid,cells,'down',t.timer);
                break;

            case 32:
                keyEvent.preventDefault();
                inPlayPiece.rotate(cells);
                break;

            case 49: // 1 key for pausing
                keyEvent.preventDefault();
                if (true === t.timer.running)
                {
                    t.timer.pauseTimer();
                }
                else
                {
                    t.timer.startTimer();
                }
                break;
        }
    }
};

window.KeyListener = KeyListener;