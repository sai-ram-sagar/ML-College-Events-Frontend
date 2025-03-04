import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeart } from "@fortawesome/free-solid-svg-icons";

const MachineLearning = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");
  
    useEffect(() => {
      if (!userId) return;
  
      const fetchData = async () => {
        try {
          const [recResponse, favResponse] = await Promise.all([
            fetch(`${process.env.REACT_APP_BACKEND_URL}/machinelearning/${userId}`),
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorites?userId=${userId}`)
          ]);
  
          const recData = await recResponse.json();
          const favData = await favResponse.json();
  
          console.log("Recommendations API Response:", recData);  // Debugging line
  
          setRecommendations(Array.isArray(recData) ? recData : []);
          setFavorites(Array.isArray(favData) ? favData.map((fav) => fav.event_id) : []);
        } catch (error) {
          console.error("Error fetching data:", error);
          setRecommendations([]);  // Ensure it's an empty array on failure
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [userId]);
  
  const toggleFavorite = async (eventId) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (favorites.includes(eventId)) {
      setFavorites((prev) => prev.filter((id) => id !== eventId));

      try {
        await fetch(`${backendUrl}/api/favorites/${userId}/${eventId}`, { method: "DELETE" });
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      setFavorites((prev) => [...prev, eventId]);

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

  return (
    <Container>
      <h1>Recommended Events</h1>
      {loading ? (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      ) : recommendations.length === 0 ? (
        <p>No recommendations available</p>
      ) : (
        <EventList>
          {recommendations.map((event) => (
            <EventCard key={event.id}>
              <EventImage src={event.bg_image} alt={event.event_name} />
              <EventTitle>{event.event_name}</EventTitle>
              <EventDetails>{event.date} • {event.location}</EventDetails>
              <EventDetails>
                Entry: {event.entry_price === 0 ? "Free" : `₹${event.entry_price}`}
              </EventDetails>
              <ButtonsContainer>
                <LikeButton favorite={favorites.includes(event.id)} onClick={() => toggleFavorite(event.id)}>
                  <FontAwesomeIcon icon={faHeart} />
                </LikeButton>
                <Link to={`/event/${event.id}`}>
                  <MoreButton>
                    More <FontAwesomeIcon icon={faArrowRight} />
                  </MoreButton>
                </Link>
              </ButtonsContainer>
            </EventCard>
          ))}
        </EventList>
      )}
    </Container>
  );
};

export default MachineLearning;

// Styled Components
const Container = styled.div`
  text-align: center;
  padding: 30px 10px;

  @media (max-width: 500px) {
    h1 {
      font-size: 24px;
    }
  }
`;

const EventList = styled.div`
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

const EventCard = styled.div`
  width: 300px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  background: #fff;
`;

const EventImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
`;

const EventTitle = styled.h3`
  font-size: 1.2em;
  margin-top: 10px;
`;

const EventDetails = styled.p`
  font-size: 1em;
  color: #555;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const LikeButton = styled.button`
  color: ${({ favorite }) => (favorite ? "red" : "grey")};
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.3s ease-in-out;
  font-size: 20px;

  &:hover {
    color: ${({ favorite }) => (favorite ? "rgba(255, 0, 0, 0.83)" : "rgb(100, 100, 100)")};
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const MoreButton = styled.button`
  color: #5F388C;
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// Loader Animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Loader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid rgb(84, 84, 84);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;

  @media (max-width: 480px) {
    border: 3px solid #f3f3f3;
    border-top: 3px solid rgb(84, 84, 84);
    width: 20px;
    height: 20px;
  }
`;
