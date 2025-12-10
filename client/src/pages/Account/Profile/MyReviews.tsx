import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const HTTP_SERVER = import.meta.env.VITE_API_URL || "http://localhost:4000";

const MyReviews: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReviews();
  }, [currentUser]);

  const fetchMyReviews = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${HTTP_SERVER}/api/users/${currentUser._id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>My Reviews</h2>
      
      {reviews.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          You haven't written any reviews yet. Book a court and share your experience!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <Link 
                  to={`/turf/${review.turfId}`}
                  style={{ 
                    textDecoration: 'none',
                    color: '#333',
                    flex: 1
                  }}
                >
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>
                    {review.turfName}
                  </h3>
                </Link>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '4px',
                  color: '#ffc107',
                  fontSize: '16px'
                }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar 
                      key={i}
                      style={{ 
                        color: i < review.rating ? '#ffc107' : '#e0e0e0' 
                      }}
                    />
                  ))}
                </div>
              </div>

              <p style={{ 
                margin: '0 0 12px 0',
                color: '#555',
                lineHeight: '1.6'
              }}>
                {review.comment}
              </p>

              <div style={{ 
                fontSize: '12px',
                color: '#999',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                
                <Link 
                  to={`/turf/${review.turfId}`}
                  className="btn btn-sm btn-outline-primary"
                  style={{ 
                    fontSize: '12px',
                    padding: '4px 12px'
                  }}
                >
                  View Turf
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;