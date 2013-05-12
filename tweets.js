if (Meteor.isClient) {
  
  if (Session.get("search") === undefined ) {
    Session.set("search", "meteorjs");
  }

  Template.heading.events({
    // 'keypress input' : function (e, t) {
    //   // template data, if any, is available in 'this'
    //   if ( e.keyCode === 3000) {
    //     Session.set("search", e.currentTarget.value);
    //     e.currentTarget.value = "";
    //   }
    // },
  
    'click #submit' : function (e) {
      // template data, if any, is available in 'this'
      e.preventDefault();
      var term = $('#iField').val();
      // console.log(term);
      Session.set("search", term);
      Session.set("tweets", undefined);
      Meteor.call("getTweets", term, function (err, tweets) {
        Session.set("tweets", tweets);
        var d = new Date();
        Session.set("latestRefresh", "" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
      });
      $('#iField').val("");
    }
  });
  
  Template.main.greeting = function () {
    return "Welcome to tweets.";
  };

  Template.main.tweets = function () {

    return Session.get("tweets");
  };

  Template.main.latestRefresh = function () {
    return Session.get("latestRefresh");
  };

  Template.main.search = function () {
    return Session.get("search");
  };  


  Meteor.setInterval(function(){
    var search = Session.get("search");
    Meteor.call("getTweets", search, function (err, tweets) {
      Session.set("tweets", tweets);
      var d = new Date();
      Session.set("latestRefresh", "" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
    });
  }, 2000);
}


if (Meteor.isServer) {
  
  String.prototype.greyLink = function(url, u) {
    return "<a class='userTw' target='_blank' href='"+url+"'>"+u+"</a>";
  }

  String.prototype.blankLink = function(url) {
    return "<a target='_blank' href='"+url+"'>"+url+"</a>";
  }

  function parseLinks (tweet) {
    return tweet.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function (tweet) {
        return tweet.blankLink(tweet);
    });
  };

  function parseUsername(tweet) {
    return tweet.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
      var username = u.replace("@","")
      // u.link("https://twitter.com/"+username);
      return u.greyLink("https://twitter.com/"+username, u);
    });
  };

  function linkUser(user) {
    var username = "@" + user;
    return user.greyLink("https://twitter.com/"+user, username);
  };

  Meteor.methods({
    getTweets: function (searchTerm) {
      var response = Meteor.http.call("GET", "http://search.twitter.com/search.json", { params: { q: searchTerm} });
      
      return response.data.results.map(function (tweet) {
        // console.log(tweet.text);
        // console.log(parseLinks(tweet.text));
        return {
          user: tweet.from_user_name,
          userlink: linkUser(tweet.from_user),
          text: parseUsername(parseLinks(tweet.text)),
          stamp: tweet.created_at,
        };
      });
    }
  });
}
