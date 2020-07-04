import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import axios from 'axios';
import uuid from "uuid/v4";
import "./Deck.css";

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
  // state to set the interval id
  const [intervalId, setIntervalId] = useState(0);

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
      card.angle = Math.floor(Math.random() * 360);
      return [...currCards, card];
    });
    if (resp.data.remaining === 0) {
      setRemaining(false);
      handleInterval();
    }
  }

  function handleInterval() {
    if (intervalId === 0) {
      // set interval
      setIntervalId(setInterval(() => {
        fetchNextCardFromDeck();
      }, 100));
    } else {
      // clear interval
      clearInterval(intervalId);
      setIntervalId(() => 0);
    }
  }

  return (
    <div className="Deck">
      {remaining ? (
        <button onClick={handleInterval}>{intervalId === 0 ? "START" : "STOP"} DEALING CARDS!</button>
      ) : (
          <button onClick={() => setNewDeck(!newDeck)}>GIMMIE A NEW DECK!</button>
        )
      }
      <div>{cards.map(card => <Card {...card} key={card.id} />)}</div>
    </div >
  );
}

export default Deck;