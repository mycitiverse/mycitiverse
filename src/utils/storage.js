// Get all user events from localStorage
export const getUserEvents = () => {
  const data = localStorage.getItem("userEvents");
  return data ? JSON.parse(data) : [];
};

// Save a new user event to localStorage with a unique ID
export const saveUserEvent = (event) => {
  const current = getUserEvents();
  const newEvent = {
    ...event,
    id: Date.now(), // Generate unique ID using timestamp
  };
  current.push(newEvent);
  localStorage.setItem("userEvents", JSON.stringify(current));
};

// Delete a user event by its ID
export const deleteUserEvent = (eventId) => {
  const current = getUserEvents();
  const updated = current.filter(event => event.id !== eventId);
  localStorage.setItem("userEvents", JSON.stringify(updated));
};
