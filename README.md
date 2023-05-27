# Chatgpt

Run backend:
1. `npm i`
2. `npm run dev` (locally)
2. `npm start` (production)

## Testing
Start the automated testing by running `npm run test`

The test specification can be found [here](https://github.com/vt23-2dv015-grupp-2/wiki/wiki/Testspecifikation).

## Endpoints

## Error handling
Errors are handled through an error handler middleware that catches all thrown errors from other middleware or route handlers defined in the application. If an error with the status code 404 occurs, the error handler sends back a 404 response message, otherwise it sends back a 500 response message. This means that if a user tries to access a URL that does not exist, the server sends back a 404 response message. If any other error occurs in the server, it sends back a 500 response message.

### GET /
### Description
Returns a list of all available endpoints in the API, along with a brief description of what each endpoint does.

### Parameters
No parameters are required for this endpoint.


### Error messages
If an error occurs during the execution of the endpoint, an error message is logged to the server. No error message is sent back to the client.


### Example response
```javascript
HTTP 200 OK

{
    "endpoints": [
        {
            "method": "GET",
            "url": "/",
            "description": "Retrieves information about the available endpoints."
        },
        {
            "method": "POST",
            "url": "/newchat",
            "description": "Creates a new chat. Resets the previous chat history."
        },
        {
            "method": "POST",
            "url": "/ask",
            "description": "Send a question to AI model and get an answer back."
        }
    ]
}

```

## POST /newchat

### Description
This endpoint handles a POST request to create a new chat session by resetting the message history. 

### Parameters
No parameters are required for this endpoint.


### Error messages
If an error occurs during the execution of the endpoint, an error message is logged to the server. No error message is sent back to the client.


### Example response
```javascript
HTTP 200 OK

'New chat successfully created'

```

## POST /ask

### Description
This endpoint allows you to send a question to an AI model and receive a response back. The endpoint utilizes OpenAI's GPT-3.5 model to generate the response.

### Parameters
The only parameter for this endpoint is a JSON object containing the following:
- `question`: the question to be asked to the AI model

### Error messages
If the request body does not contain a `question` parameter, a `400 Bad Request` error will be returned.

### Example response
Example request:
```javascript
POST /ask
Content-Type: application/json

{
  "question": "What is the meaning of life?"
}
```

Example response:
```javascript
{
  "message": "The meaning of life is subjective and varies from person to person."
}
```