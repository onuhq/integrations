import axios from "axios";
import { HOST_NAME } from "./constants";
import { SlackPostMessageRequest } from "./types";
import { ValidationError } from "./errors";



class SlackClient {
  async postMessage(request: SlackPostMessageRequest) {

    const apiKey = process.env.ONU_INTERNAL__API_KEY;
    const debugMode = process.env.ONU_INTERNAL__DEBUG_MODE;
    const executionId = process.env.ONU_INTERNAL__EXECUTION_ID;

    if (!executionId) {
      throw new ValidationError('executionId is not defined');
    }

    if (!apiKey && debugMode !== 'true') {
      throw new ValidationError('apiKey is not defined');
    }


    if (debugMode === 'true') {
      console.log(`[debug][onu] Slack postMessage request: ${JSON.stringify(request)}`);
      return;
    }

    await axios.post(`${HOST_NAME}/v1/integrations/slack/postMessage`, {
      executionId,
      params: {
        markdown: request.message,
        channelName: request.channelName,
        channelId: request.channelId,
        botUsername: request.botUsername,
        botImageURL: request.botImageURL,
      }
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }
}

export const slack = new SlackClient();
