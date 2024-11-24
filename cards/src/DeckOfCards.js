import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DeckOfCards = () => {
    const [cards, setCards] = useState([])
    const [deckId, setDeckId] = useState(null)
    const [isShuffle, setIsShuffle] = useState(false)
    const [remaining, setRemaining] = useState(52)


    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/")
                setDeckId(res.data.deck_id)
            } catch (e) {
                console.error("Error fetching Deck", e)
            }
        }
        fetchDeck()
    }, []);

    const drawCard = async () => {
        if (!drawCard) return;
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
            if (res.data.remaining === 0) {
                alert("Error: no cards remaining!")
            } else {
                setCards((cards) => [...cards, ...res.data.cards])
            }
            setRemaining(res.data.remaining);

        } catch (e) {
            console.error("Error drawing card:", e)
        }
    }

    const shuffleDeck = async () => {
        if (!deckId) return;

        setIsShuffle(true);
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            setCards([])
            setRemaining(res.data.remaining);
        } catch (e) {
            console.error("Error shuffling deck:", e);
        } finally {
            setIsShuffle(false);
        }
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Deck of Cards</h1>
            <div>
                <button onClick={drawCard} disabled={!deckId || isShuffle || remaining === 0}>
                    Draw a Card
                </button>
                <button onClick={shuffleDeck} disabled={!deckId || isShuffle}>
                    {isShuffle ? "Shuffling..." : "Shuffle Deck"}
                </button>
            </div>
            <div style={{ marginTop: "20px" }}>
                {cards.map((card, index) => (
                    <img
                        key={index}
                        src={card.image}
                        alt={`${card.value} of ${card.suit}`}
                        style={{ margin: "5px", width: "150px" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default DeckOfCards;



