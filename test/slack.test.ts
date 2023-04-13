import { slack } from '../src/slack';
import axios from 'axios';

jest.mock('axios');
const originalEnv = process.env;

describe('slack', () => {
  // rest mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();

    // mock the process.env
    process.env = {
      ...originalEnv,
      NODE_ENV: "test",
    };

  });

  afterEach(() => {
    process.env = originalEnv;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should post a message to slack', async () => {
    const request = {
      message: 'test-message',
      channelName: 'test-channel-name',
    }

    process.env.ONU_INTERNAL__API_KEY = 'test-api-key';
    process.env.ONU_INTERNAL__EXECUTION_ID = 'test-execution-id';

    await slack.postMessage(request);

    expect(axios.post).toBeCalledWith(
      'https://api.joinonu.com/v1/integrations/slack/postMessage',
      {
        executionId: 'test-execution-id',
        params: {
          markdown: request.message,
          channelName: request.channelName,
        }
      },
      {
        headers: {
          Authorization: 'Bearer test-api-key',
        },
      }
    );
  });

  it('should NOT post a message to slack in debug mode', async () => {
    const request = {
      message: 'test-message',
      channelName: 'test-channel-name',
    }
    const logSpy = jest.spyOn(console, 'log');
    process.env.ONU_INTERNAL__API_KEY = 'test-api-key';
    process.env.ONU_INTERNAL__DEBUG_MODE = 'true';
    process.env.ONU_INTERNAL__EXECUTION_ID = 'test-execution-id';

    await slack.postMessage(request);

    expect(axios.post).not.toHaveBeenCalled();

    // ensure that the debug message is logged
    expect(logSpy).toHaveBeenCalledWith(
      '[debug][onu] Slack postMessage request: {"message":"test-message","channelName":"test-channel-name"}'
    );
  });

  it('does not require an api key in debug mode', async () => {
    const request = {
      message: 'test-message',
      channelName: 'test-channel-name',
    }
    const logSpy = jest.spyOn(console, 'log');
    process.env.ONU_INTERNAL__DEBUG_MODE = 'true';
    process.env.ONU_INTERNAL__EXECUTION_ID = 'test-execution-id';

    await slack.postMessage(request);

    expect(axios.post).not.toHaveBeenCalled();

    // ensure that the debug message is logged
    expect(logSpy).toHaveBeenCalledWith(
      '[debug][onu] Slack postMessage request: {"message":"test-message","channelName":"test-channel-name"}'
    );
  });
});

