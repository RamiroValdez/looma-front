import { useState, useEffect } from 'react';
import { getUserProfile, type UserProfile } from '../../infrastructure/services/ProfileService';

export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const profileData = await getUserProfile(userId);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refetch: () => {
      if (userId) {
        const fetchProfile = async () => {
          setLoading(true);
          setError(null);
          
          try {
            const profileData = await getUserProfile(userId);
            setProfile(profileData);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
          } finally {
            setLoading(false);
          }
        };
        fetchProfile();
      }
    }
  };
};