$(function(){
  // Global variable M for seats taken from the user
  var m = 0;

  $.ajax({url:'a42580.json',success:function(d){

    // Information
    $('#screen').text(d.screen);
    $('#movie').text(d.title);
    $('#image').prepend('<img id="image" src="'+ d.image +'" />');
    $('#rating').text(d.rating);
    var fullDate = new Date(d.date);
    var strDate = fullDate.toString();
    var niceDate = strDate.substring(0, 21);
    $('#date').text(niceDate);

    // Creating cinema table
    var t = $('<table/>').appendTo('#theatre');
    // The row loop - each step in this loop deals with one row of the
    // table and one row of the table
    for(var i=0; i < d.rowLabels.length; i++){
      // Create a single row per letter GG/FF/EE/DD/CC/BB/AA
      var tr = $('<tr/>')
        // Letter row GG/FF/EE/DD/CC/BB/AA
        .append( $('<th/>',{ text:d.rowLabels[i].charAt(0) } ) )
        .appendTo(t);

      var num = 0;

      for (var k = 0; k < d.tmap[i].length; k++) {
        // umap indicates if the seat is used
        // X indicates taken by someone else O indicates available M indicates my seat space indicates no seat
        var u0 = d.umap[i].charAt(k);

        // tmap indicates the type of seat
        // L or R for left or right sofa, A for armchair, space for none
        var t0 = d.tmap[i].charAt(k);

        // Create a seat & Create an id for seats G0/G1/G2...
        // If the charAt(L/R/A/_) is empty, it will create an empty td
        // I will add 1 to sum (which it will collect the total of empties)
        // if the charAt is not empty, it will display the column number (k) minus the number of total empties (num)
        // But because the column number starts with 0, I have to add 1
        // ((k-num)+1) = ((columnNumber-totalEmpties)+1)
        if (d.tmap[i].charAt(k) === ' ') {
          var td = $('<td/>');
          num++;
        } else {
          var td = $('<td/>', { id:d.rowLabels[i].charAt(1) + ((k-num)+1), text: ((k-num)+1) });
        }

        // Check type of seat and add a class
        if (t0 ==='L')
          td.addClass('left-sofa');
        if (t0 ==='R')
          td.addClass('right-sofa');
        if (t0 ==='A')
          td.addClass('armchair');

        // Check seats available and add a class
        if (u0 ==='O')
          td.addClass('free');
        if (u0 ==='X')
          td.addClass('booked');
        if (u0 ==='M'){
          td.addClass('mine');
          m = m+1;
          }
        // Print seat
        tr.append(td);
      } // end for

      // Letter row GG/FF/EE/DD/CC/BB/AA
      tr.append( $('<th/>',{ text:d.rowLabels[i].charAt(1) } ) )
    } // end for

    // Check how many seats the user booked
    $('#mySeats').text(m);

    // All of the seats are in place
    // Now define the action to be taken when the user clicks on
    // a seat
    $('td').click(function(){
      // Count how many seat taken from me there are
      var ms = $('td.mine');

      if ($(this).hasClass('free')) {
        // Check the number of seats taken from me, if we selected 3 already it will display an error message
        seatsMine = ms.length;
        if (ms.length > 2) {
          $('.errorMsg').html('!ERROR: YOU CAN ONLY CHOOSE '+ seatsMine + ' SEATS.');
        } else {
          $(this).addClass('mine');
          $(this).removeClass('free');
        }
      } else {
        if ($(this).hasClass('mine')) {
            $(this).addClass('free');
            $(this).removeClass('mine');
            $('.errorMsg').html('');
          }
      }
      // Call the function to generate the list of seats
      listSeats($(this));
      // Call the function to calculate the price again
      calculatePrice($(this));
    });

    // function to generate a list of my seats
    function listSeats(ms){
      // Count how many seat taken from me there are
      var ms = $('td.mine');
      // Print the total number to my Seats
      $('#mySeats').text(ms.length);

      // Display a booking seat per seat taken
      var sl = ms.map(function(){
        var rt = $(this).attr('id');
        rt = rt.toUpperCase();
        return rt;
      })
      var ul = $('<ul/>');
      for (var i = 0; i < ms.length; i++) {
        ul.append( $('<li/>', { text:'Seat - '+sl[i], class:sl[i] } ) );
      }
      $('#bookingSummary ul').remove();
      $('#bookingSummary').append(ul);

    }

    // Function to calculate the price
    function calculatePrice(ms){
      // Count how many seat taken from me there are
      var ms = $('td.mine');
      var ls = $('td.left-sofa.mine');
      var rs = $('td.right-sofa.mine');
      var as = $('td.armchair.mine');
      // Calculate the seat
      var totalPrice = 0;

      if (ms.hasClass('left-sofa')){
        for (var i = 0; i < ls.length; i++) {
          totalPrice = totalPrice +  d.pricing.L;
          }
        }
      if (ms.hasClass('right-sofa')){
      for (var i = 0; i < rs.length; i++) {
        totalPrice = totalPrice +  d.pricing.R;
        }
      }
      if (ms.hasClass('armchair')){
      for (var i = 0; i < as.length; i++) {
        totalPrice = totalPrice +  d.pricing.A;
        }
      }

      if (ms.length === 3) {
        $(':input[type="button"]').prop('disabled', false);
      } else {
        $(':input[type="button"]').prop('disabled', true);
      }


      $('.totalPrice').text(totalPrice);
    }

    // First call to the function
    listSeats();
    calculatePrice();
  }})

});
