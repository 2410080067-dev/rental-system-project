// Utility to check current authentication status
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const user = localStorage.getItem('user');
  
  console.log('=== Auth Status ===');
  console.log('Token:', token ? 'Present' : 'Missing');
  console.log('Role:', role);
  console.log('User ID:', userId);
  console.log('User:', user ? JSON.parse(user) : 'None');
  console.log('================');
  
  return { token, role, userId, user: user ? JSON.parse(user) : null };
};
