# Online event reservation system

REST API service for online reservation system using NodeJs and MongoDB

The Online Reservation System is designed to manage event seat reservations. It includes services for creating events, listing available seats, holding seats for a limited time, and reserving seats.

## System Architecture

The system follows a microservices architecture, where each service is responsible for a specific functionality. The services communicate over HTTP and use MongoDB for data storage.

## Components

1. **Express server**: Handles HTTP requests and routes them to appropriate services.
2. **MongoDB**: Stores event and seat data.
3. **NodeJs**: Runs the Express server and service logic.

## API Specifications

### Create Event

```http
POST /events
```

#### Request
| Parameter | Type | Description |
|:----------|:-----|:------------|
| `totalSeats`|`Number`|**Required**. Number of seats between 10 and 1000 (included)|

#### Response

```javascript
{
    "eventId" : uuid
}
```

### Get Event Seats

```http
GET /events/:eventId/seats
```

#### Request
| Parameter | Type | Description |
|:----------|:-----|:------------|
| `eventId`|`uuid`|**Required**. Event ID|

#### Response

```javascript
[
    {
        "seatId" : number,
        "status" : string
    },
    ...
]
```

### Hold event seat

```http
POST /events/:eventId/seats/:seatId/hold
```

#### Request
| Parameter | Type | Description |
|:----------|:-----|:------------|
| `eventId`|`uuid`|**Required**. Event ID|
| `seatId`|`number`|**Required**. Seat ID|

#### Response

```javascript
{
    "message" : string,
    "userId" : uuid
}
```

### Reserve a Seat

```http
POST /events/:eventId/seats/:seatId/reserve
```
#### Request
| Parameter | Type | Description |
|:----------|:-----|:------------|
| `eventId`|`uuid`|**Required**. Event ID|
| `seatId`|`number`|**Required**. Seat ID|
| `userId`|`uuid`|**Required**. User ID|

#### Response

```javascript
{
    "message": "seat reserved"
}
```

### Referesh reserved seat

```http
POST /events/:eventId/seats/:seatId/refresh
```

#### Request

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `eventId`|`uuid`|**Required**. Event ID|
| `seatId`|`number`|**Required**. Seat ID|
| `userId`|`uuid`|**Required**. User ID|

#### Response

```javascript
{
    "message": "seat held"
}
```

## Status Codes

Returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

## License

[MIT](https://choosealicense.com/licenses/mit/)








