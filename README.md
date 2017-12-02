This is ChatME chatbot for SJSU questions
Developed by:
Arpit Mathur
Jainul Patel
Harsha Muktamath

This project contains sample code that shows how to build chatbots for Slack that leverage IBM Watson Conversation and Botkit.

IBM Watson weather API has also been used to find current weather conditions by invoking REST APIs in node.js. Nodes in the dialog are marked as 'action nodes' via context information. The implementation of the actions is done in the Node.js application.

Prerequisites and Setup:

You need three different sets of credentials.

1. Watson Conversation

   Steps to get Watson service credentials:

   1. Log in to Bluemix at https://bluemix.net.
   2. Create an instance of the service:
   3. In the Bluemix Catalog, select the Watson service.
   4. Type a unique name for the service instance in the Service name field. For example, type my-service-name. Leave the default values for the other options.
   5. Click Create.
   6. From the service dashboard, click Service credentials.
   7. Click View credentials under Actions.
   8. Copy username and password
