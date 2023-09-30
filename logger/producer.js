const amqp = require("amqplib");
const config = require("./config");

class Producer {
    channel;

    async createChannel(){
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message){
        if(!this.channel){
            await this.createChannel();
        }

        const exchName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchName, "direct");
        await this.channel.publish(exchName, routingKey, Buffer.from(JSON.stringify({
            logType: routingKey,
            message: message,
            dateTime: new Date(),
        }))
        );

        console.log(`Message ${message} was sent to ${exchName}`);
    }

}


module.exports = Producer;