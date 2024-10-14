const API_BASE_URL = 'http://localhost:3000/v1';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include', // Important to include cookies
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const requestPassword = async (userEmail) => {
  const response = await fetch(`${API_BASE_URL}/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail }),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Something went wrong!');
  }

  const data = await response.json(); // Get the response data
  return data.message; // Return the success message
};

export const startDuty = async () => {
  const response = await fetch(`${API_BASE_URL}/startDuty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies with requests
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error starting duty!');
  }

  const data = await response.json(); // Get the response data
  return data.message; // Return the success message
};

export const stopDuty = async () => {
  const response = await fetch(`${API_BASE_URL}/stopDuty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies with requests
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error stopping duty!');
  }

  const data = await response.json(); // Get the response data
  return data.message; // Return the success message
};
