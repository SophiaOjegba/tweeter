$(() => {
  $('.error-message').hide();
  $('.new-tweet').hide();

  const escape = function(str) {
    let div = $("<div></div>").text(str);
    return div.html();
  };

  const renderTweets = function(tweets) {
    $('.tweet-container').empty()
    for (let item of tweets) {
      const result = createTweetElement(item)
      $('.tweet-container').append(result)
    }
  }

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

  const composeTweet = $('.nav-button')
  composeTweet.on('click', function() {
    if ($('.new-tweet').is(":hidden")) {
      $('.new-tweet').slideDown("slow");
      $('form').slideup('slow');
    }
  })

  const form = $('form');
  form.on("submit", function(event) {
    event.preventDefault();
    console.log('form submission!');

    let validTweet = $("#tweet-text").val().length;

    if (validTweet === 0) {
      $(".error-message").html(
        `<p><i class="fa-solid fa-triangle-exclamation"></i>Your tweet can not be empty<i class="fa-solid fa-triangle-exclamation"></i></p>`
      );
      $('.error-message').slideDown("slow");
      return false;
    }

    if (validTweet > 140) {
      $(".error-message").html(
        `<p><i class="fa-solid fa-triangle-exclamation"></i>Your tweet is too long <i class="fa-solid fa-triangle-exclamation"></i></p>`
      );
      $('.error-message').slideDown("slow");
      return false;
    }

    const data = $(this).serialize();

    $.ajax({
        type: "POST",
        url: '/tweets',
        data
      })
      .then(() => {
        loadTweets()
      });
  });

  const loadTweets = function() {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: 'http://localhost:8080/tweets',
      })
      .then((tweetData) => {
        renderTweets(tweetData)
        $("#tweet-text").val('');
        $('.counter').val(140);
        $(".tweetArticle").append(tweetData);
      })
  }
  loadTweets();

  const formatDate = function(timeStamp) {
    return timeago.format(timeStamp);
  }

});
