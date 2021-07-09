const TicketControl = require('../models/ticket-control');

//intanciamos el tickeytControl
const ticketControl = new TicketControl();



const socketController = (socket) => {

    // socket.on('disconnect', () => {});

    // cuando un nuevo socket se conecta (solo a la persona que se esta conectando)
    // console.log(ticketControl.ultimo);
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    // para la pantalla publica
    socket.emit('estado-actual', ticketControl.ultimos4);
    // para los tickets pendientes por escritorio
    socket.emit('tickets-pendientes', ticketControl.tickets);


    socket.on('siguiente-ticket', ( payload, callback ) => {        

        const siguiente = ticketControl.siguiente();
        callback( siguiente );        
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets);
    });

    socket.on('atender-ticket', ({escritorio}, callback) => {
        // const {escritorio} = payload;
        // console.log(escritorio);
        

        if ( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );
        // console.log(ticket);
        
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        // para actualizar los pendientes
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets);
        socket.emit('tickets-pendientes', ticketControl.tickets);



        if ( !ticket ){
            callback({
                ok:false,
                msg: 'Ya no hay Tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    });
}



module.exports = {
    socketController
}

