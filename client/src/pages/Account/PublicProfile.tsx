import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as client from './client';
import { FaUser, FaArrowLeft } from 'react-icons/fa';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await client.findPublicUserById(userId);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>{error || "User not found"}</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh',
      background: '#fff'
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          color: '#666',
          fontSize: '14px'
        }}
      >
        <FaArrowLeft /> Back
      </button>

      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '40px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '48px'
        }}>
          <FaUser />
        </div>
        <h1 style={{ margin: '0 0 10px 0' }}>
          {profile.firstName} {profile.lastName}
        </h1>
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
          @{profile.username}
        </p>
      </div>

      {/* Profile Info */}
      <div style={{
        background: '#f9f9f9',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Profile Information</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              fontWeight: '600', 
              color: '#666',
              fontSize: '14px',
              display: 'block',
              marginBottom: '4px'
            }}>
              Role
            </label>
            <div style={{
              padding: '8px 16px',
              background: getRoleColor(profile.role),
              color: 'white',
              borderRadius: '20px',
              display: 'inline-block',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {profile.role}
            </div>
          </div>

          <div>
            <label style={{ 
              fontWeight: '600', 
              color: '#666',
              fontSize: '14px',
              display: 'block',
              marginBottom: '4px'
            }}>
              Member Since
            </label>
            <p style={{ margin: 0, fontSize: '16px' }}>
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div style={{
        background: '#f9f9f9',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ marginTop: 0 }}>Activity</h3>
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          {profile.role === 'COURTOWNER' 
            ? 'Court owner on BookMyCourt platform' 
            : 'Active member of the BookMyCourt community'}
        </p>
      </div>
    </div>
  );
};

// Helper function for role colors
function getRoleColor(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '#dc3545';
    case 'COURTOWNER':
      return '#28a745';
    case 'CUSTOMER':
      return '#007bff';
    default:
      return '#6c757d';
  }
}

export default PublicProfile;