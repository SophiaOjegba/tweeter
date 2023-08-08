$(document).ready(function() {

  $("#tweet-text").on("input", function (){
    const count = $(this).siblings().find(".counter")
    let inputCount = 140 - $("#tweet-text").val().length;
    count.text(inputCount);

    if (inputCount >= 0) {
      count.css('color', 'black');
    } else {
      count.css('color', 'red');
    }  

  });
});