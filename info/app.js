const amqp = require("amqplib");

/**
 * Example Request for this assert
 * {
    "logType": "Info",
    "message": "Info Message"
   }
*/

//simple function that will consume the messages
async function consumeMessages(){
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange("logExch", 'direct');
    const q = await channel.assertQueue("InfoQueue");
    await channel.bindQueue(q.queue, "logExch", "Info"); //binded to the "Info" routingKey

    channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log(data);
        channel.ack(msg);
    });

}


consumeMessages();