import React, { useEffect, useState } from "react";
import eventData from "../data/events.json";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import axios from "axios";

const AllEventsContainer = styled.div`
  padding-top: 30px;

  h1{
    text-align: center;
  }
  @media (max-width: 500px) {
    h1{
        font-size: 24px;
    }
  }
`;

const EventsContainer = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    padding: 10px;
    grid-template-columns: 1fr;
  }
`;

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
  margin-right: 10px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  width: 60%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ButtonsContainer = styled.p`
  display: flex;
  justify-content: space-between;
  transition: opacity 0.3s ease-in-out;
`;

const EventCard = styled.div`
  text-align: center;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: translateY(-5px);
  }

  
`;

const EventImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 150px;
  }

  @media (max-width: 480px) {
    height: 130px;
  }
`;

const EventTitle = styled.h3`
  font-size: 1.4rem;
  margin: 10px 0;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const EventDetails = styled.p`
  color: #555;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LikeButton = styled.button`
  color: ${({ favorite }) => (favorite ? "red" : "grey")};
  background-color: transparent;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s ease-in-out;
  font-size: 20px;
  &:hover {
    color: ${({ favorite }) => (favorite ? "rgba(255, 0, 0, 0.83)" : "rgb(100, 100, 100)")} ;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 0px;
  }
  
`; 

const MoreButton = styled.button`
  color:#5F388C;
  background-color: transparent;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 0px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 0px;
  }
`; 

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const userId = localStorage.getItem("userId");

  const categories = [
    "Technology", "Music", "Art", "Sports", "Theatre", "Dance", "Business", "Literature", "Science", "Fashion", "Debate", "Photography", "Food", "Innovation", "Environment", "Health", "Coding", "Film", "Games", "Cultural"
  ].map(category => ({ label: category, value: category }));

  useEffect(() => {
    setEvents(eventData);
    setFilteredEvents(eventData);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    fetch(`${backendUrl}/api/favorites?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data.map((fav) => fav.event_id)))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [userId]);

  useEffect(() => {
    setFilteredEvents(
      events.filter((event) =>
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || event.category === selectedCategory.value)
      )
    );
  }, [searchQuery, selectedCategory, events]);

  const toggleFavorite = async (eventId) => {
    if (favorites.includes(eventId)) {
      setFavorites((prev) => prev.filter((id) => id !== eventId));
      const backendUrl = process.env.REACT_APP_BACKEND_URL;

      try {
        await fetch(`${backendUrl}/api/favorites/${userId}/${eventId}`, { method: "DELETE" });
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      setFavorites((prev) => [...prev, eventId]);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;

      try {
        await fetch(`${backendUrl}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, event_id: eventId }),
        });
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      // Store category immediately when clicked
      await axios.post(`${backendUrl}/api/search-history`, {
        user_id: userId,
        search_query: "",  // No input text, just category
        category: category.value,
      });
    } catch (error) {
      console.error("Error storing category in search history:", error);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    if (e.target.value) {
      try {
        // Store the search input text as well
        await axios.post(`${backendUrl}/api/search-history`, {
          user_id: userId,
          search_query: e.target.value,
          category: selectedCategory ? selectedCategory.value : "",
        });
      } catch (error) {
        console.error("Error storing search input in search history:", error);
      }
    }
  };

  return (
    <AllEventsContainer>
      <h1>All Events</h1>
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <Select
          options={categories}
          value={selectedCategory}
          onChange={handleCategoryClick}
          placeholder="Filter by category"
          isClearable
          menuPortalTarget={document.body} // Ensures the dropdown appears above other elements
          styles={{
            menu: (provided) => ({ ...provided }) // Ensures dropdown is on top
          }}
        />
      </SearchBarContainer>
      <EventsContainer>
        {filteredEvents.map((event) => (
          <EventCard key={event.id}>
            <div>
            <EventImage src={event.bg_image} alt={event.event_name} />
            <EventTitle>{event.event_name}</EventTitle>
            <EventDetails>{event.date} • {event.location}</EventDetails>
            <EventDetails>Entry: {event.entry_price === 0 ? "Free" : `₹${event.entry_price}`}</EventDetails>
            </div>
            <ButtonsContainer>
              <LikeButton favorite={favorites.includes(event.id)} onClick={() => toggleFavorite(event.id)}>
                <FontAwesomeIcon icon={faHeart} />
              </LikeButton>
              <Link to={`/event/${event.id}`}>
                <MoreButton >
                  More <FontAwesomeIcon icon={faArrowRight} />
                </MoreButton>
              </Link>
            </ButtonsContainer>
          </EventCard>
        ))}
      </EventsContainer>
    </AllEventsContainer>
  );
};

export default AllEvents;
