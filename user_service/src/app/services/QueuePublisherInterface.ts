export default interface QueuePublisherInterface {
  send: (message: any) => Promise<void>;
}
