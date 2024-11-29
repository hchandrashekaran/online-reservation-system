import React from "react";

function EventList({ events, onEventSelect }) {
    return (
      <div>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.eventId} onClick={() => onEventSelect(event.eventId)}>
              Event ID: {event.eventId}
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default EventList