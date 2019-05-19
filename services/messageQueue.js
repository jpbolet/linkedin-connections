
function sendJson(queue, json) {
  var open = require('amqplib').connect('amqp://localhost');
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(queue).then(function(ok) {
      for (var i = 0; i < json.results.length; i++) {
        console.log('Sending to queue: ' + queue);
        let record = json.results[i];
        //ch.sendToQueue(queue, new Buffer(JSON.stringify(record)));
        setTimeout(function () {
          ch.sendToQueue(queue, new Buffer(JSON.stringify(record)));
        }, 1);
      }

    });
  }).catch(console.warn);
}

module.exports = {
  sendJson
}
