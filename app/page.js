'use client';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthPage() {
  const { data: session, status } = useSession(); // Fetch session details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up

  const [items, setItems] = useState([]); // Items list (for CRUD operations)
  const [newItem, setNewItem] = useState(''); // New item to add
  const [isEditing, setIsEditing] = useState(null); // Track editing state
  const [editedItem, setEditedItem] = useState(''); // Edited item text

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    }
  };

  // CRUD Operations
  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem]);
    setNewItem('');
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleEditItem = (index) => {
    setIsEditing(index);
    setEditedItem(items[index]);
  };

  const handleSaveEdit = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = editedItem;
    setItems(updatedItems);
    setIsEditing(null);
  };

  // Show a loading state while session is being checked
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // If the session is active, show the CRUD operations, otherwise show the auth form
  return (
    <div>
      {!session ? (
        <>
          <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>

          <form onSubmit={handleAuth}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>Welcome, {session.user.email}!</h2>

          {/* Add Item */}
          <div>
            <h3>Add New Item</h3>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new item"
            />
            <button onClick={handleAddItem}>Add Item</button>
          </div>

          {/* Display Items */}
          <h3>Your Items</h3>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {isEditing === index ? (
                  <>
                    <input
                      type="text"
                      value={editedItem}
                      onChange={(e) => setEditedItem(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(index)}>Save</button>
                  </>
                ) : (
                  <>
                    {item}
                    <button onClick={() => handleEditItem(index)}>Edit</button>
                    <button onClick={() => handleDeleteItem(index)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
