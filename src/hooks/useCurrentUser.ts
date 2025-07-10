import { useUser } from '../context/UserContext';

export const useCurrentUser = () => {
  const { user } = useUser();
  
  const getCurrentUserId = () => {
    if (user?.representativeId) {
      return user.representativeId;
    }
    return user?.username || 'unknown';
  };
  
  return {
    user,
    getCurrentUserId
  };
};