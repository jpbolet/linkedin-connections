const axios = require("axios");
const database_endpoint_base_uri = "http://localhost:4001";

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

function getUtilitiesTransactions(info_id) {
  return axios.get(database_endpoint_base_uri + '/transactions/classifications/[\"Bills%20and%20Utilities\",\"Utilities\"]/' + info_id)
  .then(response => {
    return response
  })
}

function getUtilities(info_id) {
  return axios.get(database_endpoint_base_uri + '/transactions/classifications/[\"Bills%20and%20Utilities\",\"Utilities\"]/' + info_id)
        .then(response => {
            return response.data
        })
        .catch(function (error) {
            console.log(error);
        })
}

module.exports = {
  sendJson,
  getUtilitiesTransactions,
  getUtilities
}
