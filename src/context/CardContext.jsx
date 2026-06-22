import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [sidebarMenus, setSidebarMenus] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to seed default menus if none exist
  const seedDefaultMenus = async () => {
    try {
      const defaultMenus = [
        { id: 'information', label: 'Information', path: '/information', icon: 'info', color: '#0ea5e9', type: 'main', parentId: '', order: 0 },
        { id: 'technology', label: 'Technology', path: '/technology', icon: 'memory', color: '#8b5cf6', type: 'main', parentId: '', order: 1 },
        { id: 'project-planning', label: 'Project Planning', path: '/project-planning', icon: 'event_note', color: '#f59e0b', type: 'main', parentId: '', order: 2 },
        { id: 'project-control', label: 'Project Control', path: '/project-control', icon: 'precision_manufacturing', color: '#ec4899', type: 'main', parentId: '', order: 3 },
        { id: 'engineering', label: 'Engineering', path: '/engineering', icon: 'architecture', color: '#10b981', type: 'main', parentId: '', order: 4 }
      ];
      for (const menu of defaultMenus) {
        const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'sidebar_menus', menu.id);
        await setDoc(docRef, menu);
      }
    } catch (error) {
      console.error("Error seeding default sidebar menus:", error);
    }
  };

  // 1. Subscribe to sidebar menus
  useEffect(() => {
    const colRef = collection(db, 'Web-Hub-Tech-Partner', 'root', 'sidebar_menus');
    const unsubscribe = onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        console.log("No sidebar menus found, seeding default ones...");
        await seedDefaultMenus();
      } else {
        const fetchedMenus = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort menus by order
        fetchedMenus.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSidebarMenus(fetchedMenus);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching sidebar menus:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Dynamic card subscriptions depending on sidebarMenus
  useEffect(() => {
    const unsubscribes = [];
    const activeIds = sidebarMenus.map(m => m.id);

    if (sidebarMenus.length > 0) {
      sidebarMenus.forEach(menu => {
        const colRef = collection(db, 'Web-Hub-Tech-Partner', 'root', menu.id);
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
          const fetchedCards = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            category: menu.id
          }));
          
          setCards(prev => {
            // Keep cards that are from other active categories and filter out previous version of cards in this category
            const otherCards = prev.filter(c => c.category !== menu.id && activeIds.includes(c.category));
            return [...otherCards, ...fetchedCards];
          });
        }, (error) => {
          console.error(`Error fetching cards for category ${menu.id}:`, error);
        });
        unsubscribes.push(unsubscribe);
      });
    } else {
      setCards([]);
    }

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [sidebarMenus]);

  // Sidebar Menu CRUD
  const addSidebarMenu = async (newMenu) => {
    try {
      const menuId = newMenu.id || `menu_${Date.now()}`;
      let path = newMenu.path || `/${menuId}`;
      if (!path.startsWith('/')) {
        path = `/${path}`;
      }
      const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'sidebar_menus', menuId);
      const menuWithId = { ...newMenu, id: menuId, path };
      await setDoc(docRef, menuWithId);
      return menuWithId;
    } catch (error) {
      console.error("Error adding sidebar menu:", error);
    }
  };

  const updateSidebarMenu = async (id, updatedMenu) => {
    try {
      const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'sidebar_menus', id);
      await updateDoc(docRef, updatedMenu);
    } catch (error) {
      console.error("Error updating sidebar menu:", error);
    }
  };

  const deleteSidebarMenu = async (id) => {
    try {
      // Safeguard: Check if cards exist in context
      const hasCards = cards.some(c => c.category === id);
      if (hasCards) {
        throw new Error("Cannot delete menu because it contains cards.");
      }

      // 1. Delete sidebar menu document
      const docRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'sidebar_menus', id);
      await deleteDoc(docRef);

      // 2. Clean up child menus (set parentId to empty, update type to main)
      const subMenusToUpdate = sidebarMenus.filter(m => m.parentId === id);
      for (const sub of subMenusToUpdate) {
        const subDocRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'sidebar_menus', sub.id);
        await updateDoc(subDocRef, { parentId: '', type: 'main' });
      }
    } catch (error) {
      console.error("Error deleting sidebar menu:", error);
      throw error;
    }
  };

  // Card CRUD
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
    <CardContext.Provider value={{ 
      sidebarMenus, 
      addSidebarMenu, 
      updateSidebarMenu, 
      deleteSidebarMenu,
      cards, 
      addCard, 
      updateCard, 
      deleteCard, 
      loading 
    }}>
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
