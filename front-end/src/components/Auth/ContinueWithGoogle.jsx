import React, { useState } from 'react';
import { googleProvider, auth } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

const ContinueWithGoogle = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const idToken = await user.getIdToken();
      
      const userData = {
        idToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      };
      
      const response = await dispatch(googleLogin(userData)).unwrap();
      
      if (response.success) {
        toast.success(response.message);
       
      }
      
    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked by browser');
      } else {
        toast.error(error.message || 'Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading || isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-green-500 rounded-lg shadow-sm bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {loading || isLoading ? (
          <div className="w-5 h-5 border-2 border-green-300 border-t-green-500 rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="text-green-700">
          {loading || isLoading ? 'Signing in...' : 'Continue with Google'}
        </span>
      </Button>
    </div>
  );
};

export default ContinueWithGoogle;