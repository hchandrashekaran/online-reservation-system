import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect} from 'react';
import axios from "axios";
import EventList from './components/EventList';
import SeatList from './components/SeatList'

const BASE_API_URL = "http://localhost:3005/api"


function App() {
  const [events,setEvents] = useState([]);
  const [selectedEvent,setSelectedEvent] = useState(null);
  const [seats,setSeats] = useState([])

  // Fetch the list of events
  const fecthEvents = async () => {
    try{
      const response = await axios.get(`${BASE_API_URL}/events`);
      console.log(response.data)
      setEvents(response.data);
    } catch (err) {
      console.log("Error fetching events")
    }
    
  }

  const fetchSeats = async (eventId) => {
    try{
      const response = await axios.get(`${BASE_API_URL}/events/${eventId}/seats`)
      setSeats(response.data)
    } catch (err){
      console.log("Error fetching seats")
    }
  }

  // Handle event selection
  const handleEventSelect = (eventId) => {
    console.log(`${eventId} selected`)
    setSelectedEvent(eventId);
    fetchSeats(eventId);
  };

  useEffect(() => {
    fecthEvents()
  },[])


    return(
      <div>
        <h1>Online Event reservations system</h1>
        <EventList events={events} onEventSelect={handleEventSelect} />
        {selectedEvent && <SeatList eventId={selectedEvent} seats={seats}/>}
      </div>
    )
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
