import Debug from "debug";
import { Channel, Connection, Options, connect as _connect } from "amqplib";
import { QueuePublisherInterface } from "../app/services";

const debug = Debug("QueuePublisher");

export default class QueuePublisher implements QueuePublisherInterface {
  private options: Options.AssertQueue = { durable: false };
  private serverUrl: string;
  private queueName: string;
  private channel: Channel;
  private connection: Connection;

  constructor(
    serverUrl: string,
    queueName: string,
    options?: Options.AssertQueue
  ) {
    this.serverUrl = serverUrl;
    this.queueName = queueName;
    this.options = options ? options : this.options;
  }

  private async connect(): Promise<void> {
    this.connection = await _connect(this.serverUrl);
    this.channel = await this.connection.createChannel();
  }

  private async createChannel(): Promise<void> {
    this.channel.assertQueue(this.queueName, this.options);
  }

  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
  async send(message: string): Promise<void> {
    try {
      await this.connect();
      await this.createChannel();
      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message))
      );
      debug(`${this.queueName} : push new message :`);
      setTimeout(async () => await this.close(), 1500)
      
    } catch (ex) {
      console.error("Queue Problem");
      console.error(ex);
    }
  }
}
