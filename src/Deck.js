import React, { useEffect, useState } from 'react';
import Card from './Card';
import axios from 'axios';
import uuid from "uuid/v4";

const API_URL = 'https://deckofcardsapi.com/api/deck/';

function Deck() {
  // state for the deckId
  const [deckId, setDeckId] = useState(null);
  // state for cards [{image, value, suit, code, id}]
  const [cards, setCards] = useState([]);
  // state for cards remaining
  const [remaining, setRemaining] = useState(null);
  // state for getting a new deck of cards
  const [newDeck, setNewDeck] = useState(false);

  // the effect should fetch the deck from API every time we mount
  // or request a new deck of cards 
  useEffect(function fetchDeckWhenMounted() {
    async function fetchDeck() {
      const resp = await axios.get(`${API_URL}/new/shuffle/?deck_count=1`);
      setDeckId(resp.data.deck_id);
      setRemaining(true);
    }
    fetchDeck();

    return function cleanUp() {
      setCards([]);
    };
  }, [newDeck]);

  async function fetchNextCardFromDeck() {
    const resp = await axios.get(`${API_URL}${deckId}/draw/?count=1`);

    setCards((currCards) => {
      let card = resp.data.cards[0];
      card.id = uuid();
      return [card, ...currCards];
    });
    if (resp.data.remaining === 0) {
      setRemaining(false);
    }
  }

  function handleNewCard() {
    fetchNextCardFromDeck();
  }
  function handleErrorMsg() {
    alert("Error: no cards remaining!");
  }

  return (
    <div>
      <button onClick={remaining ? handleNewCard : handleErrorMsg}>GIMMIE A CARD!</button>
      {!remaining ? <button onClick={() => setNewDeck(!newDeck)}>GIMMIE A NEW DECK!</button> : null}
      <div>{cards.map(card => <Card {...card} key={card.id} />)}</div>
    </div>
  );
}

export default Deck;