const path = require('path');
const fs = require('fs');

class Ticket {
   constructor( numero, escritorio ) {
      this.numero = numero;
      this.escritorio = escritorio;
   }
}


class TicketControl {

   constructor() {
      this.ultimo = 0;
      this.hoy = new Date().getDate(); // seria el dia
      this.tickets = [];
      this.ultimos4 = [];  // sonlos que s emostraran en la pantalla

      // ejecutamos el metodo init()
      this.inict();
   }

   get toJson() {
      // para generar la data de forma automatica
      return {
         ultimo: this.ultimo,
         hoy: this.hoy,
         tickets: this.tickets,
         ultimos4: this.ultimos4
      }
   }

   inict() {
      // obtenemos la data ya que es un json
      const data = require('../db/data.json');
      const { hoy, ultimo, tickets, ultimos4 } = data;
      if( hoy === this.hoy ){
         // Quiere decir que es el mismo dia
         this.tickets = tickets;
         this.ultimo = ultimo;
         this.ultimos4 = ultimos4;
      } else {
         // Quiere decir que es otro dia
         this.guardarDB();
      }
   }

   guardarDB() {
      const dbPath = path.join( __dirname, '../db/data.json' );
      fs.writeFileSync(dbPath, JSON.stringify( this.toJson ));
   }

   siguiente() {
      // pasamos al siguiente ticket e instaciamos la clase ticket pasandole el siguiente
      this.ultimo += 1;
      const ticket = new Ticket( this.ultimo, null );

      // agregamos el ticket al array de tickets pendientes
      this.tickets.push ( ticket );

      // lo guardamos en la db
      this.guardarDB();
      return 'Ticket ' + ticket.numero;
   }

   atenderTicket( escritorio ) {

      // No tenemos tickets que atender
      if ( this.tickets.length === 0 ){
         return null;
      }

      const ticket = this.tickets[0];    
      // console.log('backend',ticket)  
      // una vez que ya lo tenemos lo borramos del arreglo (el primer elemento del arreglo)
      this.tickets.shift();

      // es el ticket que se va atender
      ticket.escritorio = escritorio;
      // console.log('backend',ticket)
      // añadimos el ticket al inicio del arreglo
      this.ultimos4.unshift( ticket );

      // validamos que solo sean 4 
      if ( this.ultimos4.length > 4 ) {
         // borramos el último
         this.ultimos4.splice( -1,1 );

         // guardamos en la db y retornamos el ticket
         this.guardarDB();
      }
      return ticket;
   }
}   

module.exports = TicketControl;