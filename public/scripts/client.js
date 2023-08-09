/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(()=>{
  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png"
        ,
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    }
  ]
  
  const renderTweets = function(tweets) {
    $('.tweet-container').empty()
    for (let item of tweets) {      // loops through tweets
      const result = createTweetElement(item) // calls createTweetElement for each tweet
      $('.tweet-container').append(result)  // takes return value and appends it to the 
    }
  }
  
  const createTweetElement = function(tweet) {
  let $tweet = `
    <article class="tweetArticle">
    <header class="old-tweets-header">
      <div class="profile-picture">
      <img src="${tweet.user.avatars}" alt="avatar">
      <p>${tweet.user.name}</p>   
      </div>      
      <p id="profile-name">${tweet.user.handle}</p>
  
    </header>
      <p id="tweet-text" class="new-tweet-textarea">${tweet.content.text}</p>
  
    <footer class="old-tweets-footer">
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
  
  // renderTweets(data);

  const form = $('form');
  form.on("submit", function (event)  {
    event.preventDefault();
    console.log('form submission!');
    const data =$( this ).serialize();

    $.ajax({
      type: "POST",
      url: '/tweets',
      data: data,
    });

  });
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      dataType: "json",
      url: 'http://localhost:8080/tweets',
    })
    .done((tweetData)=>{
      console.log("this is tweet loaded", tweetData)
      renderTweets(tweetData)
    })
  }
  loadTweets();
  
  const formatDate = function (timeStamp) {
    let date = new Date();
    return timeago.format(timeStamp);
    // $("#formattedTime").text = timeAgo;
  }

});
