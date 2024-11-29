import React, { useState } from "react";
import axios from "axios";
import {v4 as uuid4 } from "uuid";

function Seat({seat,eventId}){
    const [status,setStatus] = useState(seat.status)
    // const userId = uuid4()
    const userId = "Test"

    const BASE_API_URL = "http://localhost:3005/api"

    const holdSeat = async() =>{
        try{
            const response = await axios.post(`${BASE_API_URL}/reservations/${eventId}/seats/${seat.seatId}/hold`,{userId})
            setStatus("held")
            console.log(response.data)
        } catch (err) {
            console.error("Error holding seat",err)
        }
    }

    const reserverSeat = async () => {
        try{
            const response = await axios.post(`${BASE_API_URL}/reservations/${eventId}/seats/${seat.seatId}/reserve`,{userId})
            setStatus("reserved")
            console.log(response.data)
        } catch (err) {
            console.error("Error reserving seat",err)
        }

    }

    const refreshSeatHold = async () => {
        try{
            const response = await axios.post(`${BASE_API_URL}/reservations/${eventId}/seats/${seat.seatId}/refresh`,{userId})
            // setStatus("reserved")
            console.log(response.data)
        } catch (err) {
            console.error("Error reserving seat",err)
        }

    }

    return (
        <div style={{ padding: "10px", border: "1px solid black", borderRadius: "5px", textAlign: "center" }}>
            <p>Seat: {seat.seatId}</p>
            <p>Status: {status}</p>
            {status === "Available" && <button onClick={holdSeat}>Hold</button>}
            {status === "held" && <button onClick={reserverSeat}>reserve</button>}
            {status === "held" && <button onClick={refreshSeatHold}>refresh</button>}
        </div>
    )


}

export default Seat;