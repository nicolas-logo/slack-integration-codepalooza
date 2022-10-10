const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient('xoxb-2179801066-4179375741830-bg4KPxJR8asPiW5SvN7xHCwR');
// The current date
const slackSigningSecret = '54d3cbf22bef59c36d4b4e0f7b1b50d1';

const CHANNEL_NAME = 'integration-slack-test'
const port = 3000;
// Initialize

const slackEvents = createEventAdapter(slackSigningSecret);

slackEvents.on('app_mention', (event) => {debugger;
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
  /* try {
    // Use the `chat.postMessage` method to send a message from this app
    await web.chat.postMessage({
      channel: '#integration-slack-test',
      text: `message sent from Node :party_blob: #codepalooza`,
    });
    console.log('Message posted!');
  } catch (error) {
    console.log(error);
  } */


(async () => {
  let cursor = null;
  let conversationId = null;


//-----getting channels-----//
  /* while (!conversationId) {
    const result = await web.conversations.list({
      cursor: cursor
    });
  
    for (const channel of result.channels) {
      if (channel.name === CHANNEL_NAME) {
        conversationId = channel.id;
        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }

    cursor = result.response_metadata.next_cursor;
  } */

  // Store conversation history
  let conversationHistory;
  // ID of channel you watch to fetch the history for
  let channelId = "C045FA8A8NP";

  try {
    // Call the conversations.history method using WebClient
    const result = await web.conversations.history({
      channel: channelId
    });

    conversationHistory = result.messages;

    // Print results
    console.log(conversationHistory.length + " messages found in " + channelId);
  }
  catch (error) {
    console.error(error);
  }


  const server = await slackEvents.start(port);

  // Log a message when the server is ready
  console.log(`Listening for events on ${server.address().port}`);
})();