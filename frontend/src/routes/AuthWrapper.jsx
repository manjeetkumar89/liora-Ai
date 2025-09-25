import React, { useEffect } from 'react'

import { Navigate } from 'react-router-dom';
import axiosBaseUrl from '../api/AxiosConfig'
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../store/UserSlice';


const AuthWrapper = (props) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // This will send cookies automatically if { withCredentials: true } is set
        const response = await axiosBaseUrl.post('/api/auth/me', {}, { withCredentials: true });
        const {_id, email, fullName} = response.data.user;
        // console.log("user loaded via calling /me api---->", response.data.user)
        dispatch(loadUser({_id, email, fullName}));
      } catch (error) {
        dispatch(loadUser(null));
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [dispatch]);

  if (loading) return null; // or a loading spinner

  return user ? props.children : <Navigate to='/login' />;
};

export default AuthWrapper