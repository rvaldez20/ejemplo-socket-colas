
// referencias HTML
const lblEscritotio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');

const lblPendientes = document.querySelector('#lblPendientes');



// verificamos que se incluya en los parametros de la url el escriotio
const searchParams = new URLSearchParams( window.location.search );
if ( !searchParams.has('escritorio') ) {
   window.location = 'index.html';
   throw new Error('El escritorio es obligatorio') 
}

// como sabemos que si se inclye obtenemos el valor del escritotio
const escritorio = searchParams.get('escritorio');
// console.log({escritorio});
lblEscritotio.innerText = escritorio;

// oculptamos la alerta
divAlerta.style.display = 'none';



// ------------------------------- -Parte de los SOCKETS

const socket = io();

socket.on('connect', () => {
   // console.log('Conectado');
   btnAtender.disabled = false;
});

socket.on('disconnect', () => {
   // console.log('Desconectado del servidor');
   btnAtender.disabled = true;
});


// Actualiza los pendientes por escritorio
socket.on('tickets-pendientes', (tickets) => {   

   let ticketsPendientes = tickets.length;
   lblPendientes.innerText = ticketsPendientes;

   ticketsPendientes==0?lblPendientes.style.display = 'none':lblPendientes.style.display = '';


});


btnAtender.addEventListener( 'click', () => {

   // en el payload se envia el escritorio como objeto
   socket.emit( 'atender-ticket', {escritorio}, ( payload ) => {
      // console.log(payload);
      const { ok, ticket, msg } = payload;

      // si hay errores
      if (ok === false) {
         lblTicket.innerText = `Nadie `;
         return divAlerta.style.display = '';
      }

      lblTicket.innerText = `Ticket ${ticket.numero} `;      
   });

   // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
   //    // console.log('Desde el server', ticket );
   //    lblNuevoTicket.innerText = ticket;
   // });
  

});