import React, { useEffect, useState } from 'react';
import Card from './Card';
import axios from 'axios';
import uuid from "uuid/v4";

const API_URL = 'https://deckofcardsapi.com/api/deck/';

function Deck() {
  // state for the deckId
  const [deckId, setDeckId] = useState(null);
  // state for cards [{image, value, suit}]
  const [cards, setCards] = useState([]);

  // the effect should fetch the deck from API every time we mount // run out of cards
  useEffect(function fetchDeckWhenMounted() {
    async function fetchDeck() {
      const resp = await axios.get(`${API_URL}/new/shuffle/?deck_count=1`);
      console.log('response....', resp.data);
      setDeckId(resp.data.deck_id);
    }
    fetchDeck();
  }, []);

  async function fetchNextCardFromDeck() {
    const resp = await axios.get(`${API_URL}${deckId}/draw/?count=1`);
    console.log(resp);
    setCards((currCards) => {
      let card = resp.data.cards[0];
      card.id = uuid();
      return [card, ...currCards];
    });
  }

  function handleNewCard() {
    fetchNextCardFromDeck();
  }

  return (
    <div>
      <button onClick={handleNewCard}>GIMMIE A CARD!</button>
      <div>{cards.map(card => <Card {...card} key={card.id} />)}</div>
    </div>
  );
}

export default Deck;

// btn that clicks for new card
// if remaining cards === 0, get a new deck
