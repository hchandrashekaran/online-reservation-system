import React from "react";
import Seat from "./Seat";

function SeatList({eventId,seats}) {
    return(
        <div>
            <h2>Seats for the event: {eventId}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                {seats.map(seat => (
                    <Seat key={seat.seatId} seat={seat} eventId={eventId} />
                ))}
            </div>
            
        </div>
    )
}

export default SeatList