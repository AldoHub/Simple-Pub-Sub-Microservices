const amqp = require("amqplib");


/**
 * Example Request for this assert
 * {
    "logType": "Error", //can also set the logtype to "Warning"
    "message": "Error Message"
   }
*/

//simple function that will consume the messages
async function consumeMessages(){
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange("logExch", 'direct');
    const q = await channel.assertQueue("WarningError");
    await channel.bindQueue(q.queue, "logExch", "Warning"); //binded to the "Warning" routingKey
    await channel.bindQueue(q.queue, "logExch", "Error"); //binded to the "Error" routingKey

    channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log(data);
        channel.ack(msg);
    });

}


consumeMessages();