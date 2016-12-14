var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'oriel'){
    res.send(req.query['hub.challenge']);
  }
  else{res.send('Wrong token bud')}
});


app.post('/webhook', function (req, res) {
  var data = req.body.entry[0].messaging[0];
  var message = data.message;
  var senderID = data.sender.id;

  if(message){
    message = message.text;
    var reply = getReplyBasedOnMessage(message);

    sendTextMessage(senderID, reply);
  }
  else{ console.log("Something derped"); }

  res.sendStatus(200);  //required to send FB some response, else all fails.
});

function getReplyBasedOnMessage(message){
  //At this point, you work some logical magic here
  //It could be a series of if-else statements, or something more intricate
  //For now, we'll just reply with something simple:

  return "Hey, I think it's cool that you said '" + message + "'";
};


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
};

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAbDjE8Ue08BAKtES1z8ZCWQrPuBkQcvZC19MqQgf98phslKtP6PIDzCMemJrDFfOBbIplk2cxbyYHLoFd1ISqCnd3BULRjo86oUKQgaAjvfqtZClpun9jyX17SeWlc7gCzK1x542lzfAADcGk8Q6UslRVUgYZAj9wvcror1FgZDZD' },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Successfully sent message");
    }
    else {
        console.error("Unable to send message.");
        console.error(response);
        console.error(error);
    }
  });
}


app.listen(1337);
