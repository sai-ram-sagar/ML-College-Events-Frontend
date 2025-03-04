import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import eventData from "../data/events.json";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #5F388C;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 50px auto;
`;

const FavoritesContainer = styled.div`
  padding: 25px;
  h1 {
    text-align: center;
  }
  @media screen and (max-width: 500px) {
    padding-top: 40px;
  }
  @media (max-width: 500px) {
    h1 {
      font-size: 24px;
    }
  }
`;

const FavoritesList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
`;

const EventTitle = styled.h3`
  font-size: 1.4rem;
  margin: 10px 0;
  color: #333;
`;

const EventDetails = styled.p`
  color: #555;
`;

const ButtonsContainer = styled.p`
  display: flex;
  justify-content: space-between;
`;

const LikeButton = styled.button`
  color: ${({ favorite }) => (favorite ? "grey" : "red")};
  background-color: transparent;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s ease-in-out;
  font-size: 20px;
  &:hover {
    color: ${({ favorite }) => (favorite ? " rgb(100, 100, 100)" : "rgba(255, 0, 0, 0.83)")};
  }
`;

const MoreButton = styled.button`
  color: #5F388C;
  background-color: transparent;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 20px;
`;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    fetch(`${backendUrl}/api/favorites?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const favoriteEvents = data.map((fav) =>
          eventData.find((event) => event.id === fav.event_id)
        ).filter(Boolean);
        setFavorites(favoriteEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setLoading(false);
      });
  }, [userId]);

  const handleUnlike = async (eventId) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/api/favorites/${userId}/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((event) => event.id !== eventId));
      } else {
        console.error("Failed to remove favorite");
      }
    } catch (err) {
      console.error("Error unliking event:", err);
    }
  };

  return (
    <FavoritesContainer>
      <h1>Your Favorites</h1>
      {loading ? (
        <Loader />
      ) : favorites.length > 0 ? (
        <FavoritesList>
          {favorites.map((event) => (
            <EventCard key={event.id}>
              <EventImage src={event.bg_image} alt={event.event_name} />
              <EventTitle>{event.event_name}</EventTitle>
              <EventDetails>{event.date} • {event.location}</EventDetails>
              <EventDetails>Entry: {event.entry_price === 0 ? "Free" : `₹${event.entry_price}`}</EventDetails>
              <ButtonsContainer>
                <LikeButton unlike onClick={() => handleUnlike(event.id)}>
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
        </FavoritesList>
      ) : (
        <p style={{ textAlign: "center" }}>No favorites yet.</p>
      )}
    </FavoritesContainer>
  );
};

export default Favorites;
