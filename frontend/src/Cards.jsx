import { useEffect, useState } from 'react';

function Cards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/cards')
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Cards</h1>

      {cards.map(card => (
        <div key={card.id}>
          <p><strong>{card.front}</strong></p>
          <p>{card.back}</p>
        </div>
      ))}
    </div>
  );
}

export default Cards;