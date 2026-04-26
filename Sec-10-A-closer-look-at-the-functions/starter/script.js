'use strict';

const allBooking = [];


const booking = function(flightName = 'es525', passengerNumbers = 25, price){

    //ES5 way of writing default parametera
    // flightName = flightName || 'es525'; 
    // passengerNumbers = passengerNumbers || 1;

    const book = {
        flightName,
        passengerNumbers,
        price
    }
    console.log(book)
    return allBooking.push(book)

}

booking(undefined, undefined, 45);
