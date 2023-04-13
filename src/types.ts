export interface SlackPostMessageRequest {
  message: string;
  channelName?: string;
  channelId?: string;
  botUsername?: string;
  botImageURL?: string;
}
