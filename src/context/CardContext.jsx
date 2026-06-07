import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const CardContext = createContext();

const CATEGORIES = [
  'information', 'technology', 'project-planning', 'project-control', 'engineering'
];

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribes = CATEGORIES.map(category => {
      const colRef = collection(db, 'Web-Hub-Tech-Partner', 'root', category);
      return onSnapshot(colRef, (snapshot) => {
        const fetchedCards = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCards(prev => {
          const otherCards = prev.filter(c => c.category !== category);
          return [...otherCards, ...fetchedCards];
        });
      }, (error) => {
         console.error(`Error fetching category ${category}:`, error);
      });
    });

    setLoading(false);
    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const addCard = async (newCard) => {
    try {
      const category = newCard.category;
      if (!category) throw new Error("Category is required");
      
      const cardId = `card_${Date.now()}`;
      const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', category, cardId);
      
      const cardWithId = { ...newCard, id: cardId };
      await setDoc(docRef, cardWithId);
      return cardWithId;
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const updateCard = async (id, updatedCard) => {
    try {
      const currentCard = cards.find(c => c.id === id);
      const category = updatedCard.category || (currentCard && currentCard.category);
      
      if (!category) throw new Error("Category is missing for update");
      
      const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', category, id);
      await updateDoc(docRef, updatedCard);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const deleteCard = async (id) => {
    try {
      const currentCard = cards.find(c => c.id === id);
      if (!currentCard) return;
      
      const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', currentCard.category, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, deleteCard, loading }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
