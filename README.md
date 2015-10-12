[![Build Status](https://travis-ci.org/azagniotov/nodejs-hapi-messaging-rest-api.svg?branch=master)](https://travis-ci.org/azagniotov/nodejs-hapi-messaging-rest-api)
[![Code Climate](https://codeclimate.com/github/azagniotov/nodejs-hapi-messaging-rest-api/badges/gpa.svg)](https://codeclimate.com/github/azagniotov/nodejs-hapi-messaging-rest-api)
[![Test Coverage](https://codeclimate.com/github/azagniotov/nodejs-hapi-messaging-rest-api/badges/coverage.svg)](https://codeclimate.com/github/azagniotov/nodejs-hapi-messaging-rest-api/coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/e4e6f85effa04516b7a471a79e307207)](https://www.codacy.com/app/azagniotov/nodejs-hapi-messaging-rest-api)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat)](http://badges.mit-license.org)

# NodeJS & HapiJS Messaging RESTful API

Was created with love using `NodeJS v4.1.2`, `HapiJS v10.4.1`, `SQLite3 v3.1.0` and `Sequelize v3.11.0`

The API allows to perform the following operations :

1. Create and list users
2. Create new conversations with users
3. List conversations that a specific user is part of
4. Send a message to a specific conversation
5. List all messages in a specific conversation
6. List all users in a specific conversation
7. List specific conversation
8. List all conversations
9. List specific message

## Table of contents

* [Running](#running)
* [Current Version](#current-version)
* [Schema](#schema)
* [Parameters](#parameters)
* [API Discovery](#api-discovery)
* [Client Errors](#client-errors)
* [HTTP Verbs](#http-verbs)
* [Authentication](#authentication)
* [Resources](#resources)
* [Design Decisions & Assumptions](#design-decisions-assumptions)
* [Future Enhancements](#future-enhancements)

### Running

1. To run the app locally run `npm install` followed by `npm start`
2. To run the tests run `npm test`

### Current Version

By default, all requests receive the `v1` version of the API.

### Schema

All API access is over `HTTP` and accessed from `http://localhost:3000/api/v1/`.
All data is sent and received as `JSON`. JSON responses are generated as per the `http://jsonapi.org/format/` schema

### Parameters

All parameters taken by some API endpoints are all __required__ parameters, i.e.: there are no API endpoints that take optional parameters. For `POST` requests, parameters that are not included in the URL should be encoded as JSON with a `Content-Type` of `application/json`

```
curl -X POST http://localhost:3000/api/v1/conversations/1/users \
-d '{"conversation": {"user_id": "2"}}' \
-H "Content-Type: application/json" \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5"
```

### API Discovery

You can issue a `GET` request to the root endpoint `http://localhost:3000` to get all of the endpoint categories that the API supports. The endpoints are grouped by resource names, for example:

```
{
  "sessions": [
    {
      "version": "1",
      "name": "get_authorization_token_using_basic_auth",
      "method": "GET",
      "path": "/api/v1/sessions"
    }
  ],
  "users": [
    {
      "version": "1",
      "name": "get_all_users",
      "method": "GET",
      "path": "/api/v1/users"
    },
    {
      "version": "1",
      "name": "create_new_user",
      "method": "POST",
      "path": "/api/v1/users"
    }
  ...
  ...
}
```
### Client Errors

There are a number of possible types of client errors on API `POST` calls that receive request bodies. 
Please note that there is no validation in place for sending the wrong type of JSON values:


##### Sending invalid JSON will result in a `400 Bad Request` response
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 102

{"code":400,"message":"400 Bad Request","description":"The syntax of the request entity is incorrect"}
```

##### Sending invalid fields will result in a `422 Unprocessable Entity` response
```
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json; charset=utf-8
Content-Length: 140

{"code":422,"message":"422 Unprocessable Entity","description":"The server was unable to process the Request payload: 'message' is missing"}
```

##### Trying to re-create an existing user will result in `409 Conflict` response
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 106

{"code":409,"message":"409 Conflict","description":"User with email '11@gmail.com' is already registered"}
```

##### Starting a conversation (or adding to existing conversation) a non-existent user id will result `404 Not Found` response
```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 88

{"code":404,"message":"404 Not Found","description":"User with id '111' does not exist"}
```

##### Adding a user to non-existent conversation will result `404 Not Found` response
```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 88

{"code":404,"message":"404 Not Found","description":"Conversation with id '111' does not exist"}
```

##### Adding the same user to conversation twice will result `409 Conflict` response
```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 88

{"code":409,"message":"409 Conflict","description":"User with id '2' is already part of conversation id '1'"}
```

### HTTP Verbs

Where possible, API v1 strives to use the appropriate HTTP verbs for each action:

| Verb		| Description  						|
|---		|---								|
| GET  		| Used for retrieving resources 	|
| POST 		| Used for creating resources  		|
| HEAD 		| Currently unsupported  			|
| PATCH		| Currently unsupported  			|
| PUT 		| Currently unsupported  			|
| DELETE 	| Currently unsupported  			|

### Authentication

To authenticate against API `v1`, an API authentication token must be provided. There are only two endpoints that do not require authentication:

1. Creating a new `User`
2. Retrieving the authentication token

Requests that require authentication will return `401 Unauthorized` in case of failed authentication. 

##### Basic Authentication

To retrieve API authentication token, client must authenticate itself using HTTP basic authentication by making a `GET` request to `/api/v1/sessions` using valid credentials:

```
curl -u 1@gmail.com:123456 http://localhost:3000/api/v1/sessions
```
If authentication was successful, the API will respond with:

```
{"email":"1@gmail.com","auth_token":"14e0659ce56f4048a0f0ae1f4dcbffd5"}
```

##### API Access

To access an endpoint requiring authentication, the `X-Api-Key` HTTP header must be set

```
curl -H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" -H "Content-Type: application/json" http://localhost:3000/api/v1/users/1
```

### Resources

Currently there are following API resources:

#### User

1. [Create new user](#create-new-user)
2. [List user by id](#list-user-by-id)
3. [List all users](#list-all-users)
4. [List user conversations by user id](#list-user-conversations-by-user-id)

##### Create new user

```
POST /api/v1/users
```
Parameters

| Name			| Type 		| Description		|
|---			|---		|---				|
| name 			| string	| User name			|
| email 		| string	| User email		|
| password 		| string	| User password		|

Request

```
curl -X POST http://localhost:3000/api/v1/users \
-d '{"user": {"email": "1@gmail.com", "password": "123456", "name": "alex"}}' \
-H "Content-Type: application/json"
```

Response

```
{"data":{"id":"1","type":"users","attributes":{"name":"alex","email":"1@gmail.com","links":{"self":"/api/v1/users/3","all":"/api/v1/users"}}}}
```

##### List user by id

```
GET /api/v1/users/{user_id}
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" http://localhost:3000/api/v1/users/1
```

Response

```
{"data":{"id":"1","type":"users","attributes":{"name":"alex","email":"1@gmail.com","links":{"self":"/api/v1/users/1","all":"/api/v1/users"}}}}
```

##### List all users

```
GET /api/v1/users
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" http://localhost:3000/api/v1/users
```

Response

```
{"data":[{"id":"1","type":"users","attributes":{"name":"alex","email":"1@gmail.com","links":{"self":"/api/v1/users/1","all":"/api/v1/users"}}}]}
```

##### List user conversations by user id

```
GET /api/v1/users/{user_id}/conversations
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" \
http://localhost:3000/api/v1/users/1/conversations
```

Response

```
{"data":{"id":"1","type":"users","attributes":{"name":"alex","email":"1@gmail.com"},"relationships":{"conversations":{"data":[{"id":1,"started_by":1}]}}}}
```

#### Conversation

1. [Create new conversation](#create-new-conversation)
2. [Add user to conversation](#add-user-to-conversation)
3. [Post new message to conversation](#post-new-message-to-conversation)
4. [List all conversations](#list-all-conversations)
5. [List conversation by id](#list-conversation-by-id)
6. [List conversation messages by conversation id](#list-conversation-messages-by-conversation-id)
7. [List conversation users by conversation id](#list-conversation-users-by-conversation-id)


##### Create new conversation

```
POST /api/v1/conversations
```
Parameters

| Name			| Type 		| Description		|
|---			|---		|---				|
| started_by 	| string	| Existing user id	|
| message 		| string	| Message text		|
| recipient_ids	| array		| Existing user ids	|

Request

```
curl -X POST http://localhost:3000/api/v1/conversations \
-d '{"conversation": {"started_by": "1", "message": "Hello, this is me!", "recipient_ids": ["2", "3", "4", "5"]}}' \
-H "Content-Type: application/json" \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5"
```

Response

```
{"data":{"id":"1","type":"conversations","attributes":{"started_by":1,"links":{"self":"/api/v1/conversations/1","all":"/api/v1/conversations"}}}}
```


##### Add a user to a conversation

```
POST /api/v1/conversations/{conversation_id}/users
```
Parameters

| Name			| Type 		| Description		|
|---			|---		|---				|
| user_id 		| string	| Existing user id	|

Request

```
curl -X POST http://localhost:3000/api/v1/conversations/1/users \
-d '{"conversation": {"user_id": "2"}}' \
-H "Content-Type: application/json" \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5"
```

Response

```
{"data":{"id":"2","type":"users","attributes":{"name":"alex","email":"1@gmail.com"},"relationships":{"conversations":{"data":[{"id":1,"started_by":1}]}}}}
```

##### Post a new message to a conversation

```
POST /api/v1/conversations/{conversation_id}/messages
```
Parameters

| Name			| Type 		| Description		|
|---			|---		|---				|
| sender_id 	| string	| Existing user id	|
| message 		| string	| Message text		|

Request

```
curl -X POST http://localhost:3000/api/v1/conversations/1/messages \
-d '{"conversation": {"sender_id": "1", "message": "Hello, this is me again!"}}' \
-H "Content-Type: application/json" \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5"
```

Response

```
{"data":{"id":"3","type":"messages","attributes":{"sender_id":1,"text":"Hello, this is me again!","created_at":"2015-10-05T19:40:53.633Z","links":{"self":"/api/v1/messages/3"}}}}
```

##### List all conversations

```
GET /api/v1/conversations
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" http://localhost:3000/api/v1/conversations
```

Response

```
{"data":[{"id":"1","type":"conversations","attributes":{"started_by":1,"links":{"self":"/api/v1/conversations/1","all":"/api/v1/conversations"}}},{"id":"2","type":"conversations","attributes":{"started_by":2,"links":{"self":"/api/v1/conversations/2","all":"/api/v1/conversations"}}}]}
```

##### List conversations by id

```
GET /api/v1/conversations/{conversation_id}
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" http://localhost:3000/api/v1/conversations/1
```

Response

```
{"data":{"id":"1","type":"conversations","attributes":{"started_by":1,"links":{"self":"/api/v1/conversations/1","all":"/api/v1/conversations"}}}}
```


##### List conversation messages by conversation id

```
GET /api/v1/conversations/{conversation_id}/messages
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" \
http://localhost:3000/api/v1/conversations/1/messages
```

Response

```
{"data":{"id":"1","type":"conversations","attributes":{"started_by":1},"relationships":{"messages":{"data":[{"id":1,"sender_id":1,"text":"Hello, this is me!","created_at":"2015-10-05T01:16:43.191Z"},{"id":3,"sender_id":1,"text":"Hello, this is me again!","created_at":"2015-10-05T19:40:53.633Z"}]}}}}
```

##### List conversation users by conversation id

```
GET /api/v1/conversations/{conversation_id}/users
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" \
http://localhost:3000/api/v1/conversations/1/users
```

Response

```
{"data":{"id":"1","type":"conversations","attributes":{"started_by":1},"relationships":{"users":{"data":[{"id":1,"name":"alex","email":"1@gmail.com"},{"id":2,"name":"jane","email":"2@gmail.com"},{"id":3,"name":"alex","email":"11@gmail.com"}]}}}}
```


#### Message

1. [List message by id](#list-message-by-id)

##### List message by id

```
GET /api/v1/messages/{message_id}
```

Request

```
curl \
-H "X-Api-Key: 14e0659ce56f4048a0f0ae1f4dcbffd5" \
-H "Content-Type: application/json" \
http://localhost:3000/api/v1/messages/1
```

Response

```
{"data":{"id":"1","type":"messages","attributes":{"sender_id":1,"text":"Hello, this is me!","created_at":"2015-10-05T01:16:43.191Z","links":{"self":"/api/v1/messages/1"}}}}
```


### Design Decisions & Assumptions

1. Client requests submitted to the API are valid, ie.: there is no email format or password complexity validation in place
2. After creation, `User` cannot be updated
3. When creating a new `User`, you must also `POST` the desired password. Not a good idea in real life, I am aware of that
4. On each API call requiring authentication, there is a DB lookup to validate API authentication token
5. Model validations only to check whether required fields are set
6. Email uniquely identifies `Users` in the system
7. There is no pagination nor request rate limiting

### Future Enhancements

1. Pagination for requests that return multiple items
2. Rate limiting for requests using authentication and unauthenticated requests
3. Ability to re-generate API authentication token
4. Ability to update an existing `User`
5. List messages in a conversation by sender or recipient
6. More thorough request fields validation
7. OAuth2


