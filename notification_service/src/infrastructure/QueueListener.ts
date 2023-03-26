import Debug from "debug";
const debug = Debug("QueueListnner");

import { Channel, Connection, Options, connect as _connect } from "amqplib";
import { Message } from "../core/Message";
export default class QueueListener {
  private options: Options.AssertQueue = { durable: false };
  private serverUrl: string;
  private queueName: string;
  private controler: any;
  private channel: Channel;
  private connection: Connection;

  constructor(
    serverUrl: string,
    queueName: string,
    contoler: any,
    options?: Options.AssertQueue
  ) {
    this.serverUrl = serverUrl;
    this.queueName = queueName;
    this.controler = contoler;
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
  async execute(): Promise<void> {
    try {
      debug(`connection to queue: ${this.serverUrl}`)
      await this.connect();
      await this.createChannel();
      this.channel.consume(this.queueName, (message) => {
        const content: Message = JSON.parse(message.content.toString());
        debug(`${this.queueName} : Recieved new message :`);
        debug(content);
        this.controler.execute(content);
        this.channel.ack(message);
      });
      debug(`${this.queueName} Waiting for messages...`);
    } catch (ex) {
      console.error(ex);
    }
  }
}
