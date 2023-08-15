$(()=>{
  // Initial setup: hide error messages and the new tweet form
  $('.error-message').hide();
  $('.new-tweet').hide();

   // Helper function to escape HTML in strings
  const escape = function (str) {
    let div = $("<div></div>").text(str);
    return div.html();
  };
  
    // Function to render tweets on the page
  const renderTweets = function(tweets) {
    $('.tweet-container').empty()
    for (let item of tweets) {      
      const result = createTweetElement(item) 
      $('.tweet-container').append(result)  
    }
  }
    // Function to create HTML for a single tweet
  const createTweetElement = function(tweet) {
  let $tweet = `
    <article class="tweetArticle">
    <header class="tweet-header">
      <div class="profile-picture">
      <img src="${escape(tweet.user.avatars)}" alt="avatar">
      <p>${escape(tweet.user.name)}</p>   
      </div>      
      <p id="profile-name">${escape(tweet.user.handle)}</p>
  
    </header>
      <p id="tweet-text" class="tweet-textarea">${escape(tweet.content.text)}</p>
  
    <footer class="tweet-footer">
      <p id = "formattedTime">${formatDate(tweet.created_at)}</p>
      <div>
      <i class="fa-solid fa-flag" id="tweet-icons"></i>
      <i class="fa-solid fa-retweet" id="tweet-icons"></i>
      <i class="fa-solid fa-heart" id="tweet-icons"></i>
      </div>
    </footer>
    </article> <br>
  `
  return $tweet;
  }

  // Handling compose tweet button click
  const composeTweet = $('.nav-button')
  composeTweet.on('click', function () {
    if ($('.new-tweet').is(":hidden")) {
      $('.new-tweet').slideDown( "slow" );
      $('form').slideup('slow');
    }
  })

   // Handling form submission
  const form = $('form');
  form.on("submit", function (event)  {
  event.preventDefault();
  console.log('form submission!');
  
  // Display error message if tweet is empty or too long
  let validTweet = $("#tweet-text").val().length;
  if (validTweet === 0) {
    $(".error-message").html(
      `<p><i class="fa-solid fa-triangle-exclamation"></i>Your tweet can not be empty<i class="fa-solid fa-triangle-exclamation"></i></p>`
    );
    $('.error-message').slideDown( "slow" );
    return false;
  }

  if ( validTweet > 140) {
    $(".error-message").html(
      `<p><i class="fa-solid fa-triangle-exclamation"></i>Your tweet is too long <i class="fa-solid fa-triangle-exclamation"></i></p>`
    );
    $('.error-message').slideDown( "slow" );
    return false;
  }

   // Clear the error if valid
  $(".error-message").html("");
  $('.error-message').slideUp("slow"); 

  // Submit the tweet data
  const data =$( this ).serialize();

    $.ajax({
      type: "POST",
      url: '/tweets',
      data
    })
    .then(() => {
      loadTweets()
    })
    .fail(() => {
      $(".error-message").html(
        `<p><i class="fa-solid fa-triangle-exclamation"></i>Error submitting tweet<i class="fa-solid fa-triangle-exclamation"></i></p>`
      );
      $('.error-message').slideDown("slow");
    });
  });

  // Function to load tweets from the server
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      dataType: "json",
      url: '/tweets',
    })
    .then((tweetData) => {
      // Reverse the tweetData array to display newest tweets first
      const reversedTweetData = tweetData.reverse();
  
      renderTweets(reversedTweetData);
      $("#tweet-text").val('');
      $('.counter').val(140);
    })
    .fail(() => {
      $(".error-message").html(
        `<p><i class="fa-solid fa-triangle-exclamation"></i>Error submitting tweet<i class="fa-solid fa-triangle-exclamation"></i></p>`
      );
      $('.error-message').slideDown("slow");
    });
  }
  loadTweets();
  
  // Helper function to format timestamps using timeago library
  const formatDate = function (timeStamp) {
    return timeago.format(timeStamp);
  }

});
