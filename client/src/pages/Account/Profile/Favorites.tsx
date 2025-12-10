import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as client from '../client';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';

const Favorites: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [currentUser]);

  const fetchFavorites = async () => {
    if (!currentUser) return;
    
    try {
      const data = await client.getFavorites(currentUser._id);
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (turfId: string) => {
    try {
      await client.removeFavorite(currentUser._id, turfId);
      setFavorites(favorites.filter(f => f._id !== turfId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) return <div>Loading favorites...</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>My Favorite Turfs</h2>
      
      {favorites.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          No favorites yet. Browse turfs and click the heart icon to save your favorites!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {favorites.map((turf) => (
            <div
              key={turf._id}
              style={{
                background: '#f9f9f9',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #e0e0e0'
              }}
            >
              <Link 
                to={`/turf/${turf._id}`}
                style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
              >
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                    {turf.name}
                  </h3>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                    {turf.address}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>
                      <FaStar style={{ color: '#ffc107' }} /> {turf.rating}
                    </span>
                    <span style={{ color: '#4caf50', fontWeight: '600' }}>
                      ${turf.pricePerHour}/hour
                    </span>
                  </div>
                </div>
              </Link>
              
              <button
                onClick={() => removeFavorite(turf._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <FaHeart style={{ color: '#f44336', fontSize: '24px' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;