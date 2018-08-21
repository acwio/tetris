
function Portal(type, size, entryPortal){
    // Description:
    //  - Portals are composed of 3 consecutive grid cells.
    //  - Entry portals are green.
    //  - Exit portals are red.
    //
    // Functionality
    //  - Shapes can move through portals
    //  - Shapes move through portals at the same rate of other game movements

    // type of the portal
    // either (1) entry or (2) exit
    this.type = type;

    // coordinates of the 3-block portal - format: [{x: 0, y: 0}, {x: 0, y: 0},, {x: 0, y: 0},]
    this.position = null;

    // assign a static set of positions for default behaivor
    if(this.type === 'entry'){
        // update position of the portal
        this.position = [
            { x: 4, y: 5 },
            { x: 5, y: 5 },
            { x: 6, y: 5 }
        ];
    } else if(this.type === 'exit') {
        // update the position of the portal
        this.position = [
            { x: 4, y: 7 },
            { x: 5, y: 7 },
            { x: 6, y: 7 }
        ];
    }

    this.initialisePortal(size, entryPortal)
}

Portal.prototype = {
    /**
     * initialisePortal - find a 
     */
    initialisePortal: function(size, entryPortal){

        // find an appropriate place for the portal
        this.findPortalLocation(size, entryPortal);
    },

    /**
     * findPortalLocation - randomly select 3 consecutive cells from the 2D grid array to assign to 'this.position' as done in the constructor
     *  @param size: a JavaScript object containing the height and width of the grid, such as: { height: 2, width: 3 }
     *  @param entryPortal: the instance of the entry portal (this value is null if creating the entry portal)
     */
    findPortalLocation: function(size, entryPortal){

    },
};


window.Portal = Portal;