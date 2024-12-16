export const API_BASE_URL = 'http://88.151.101.171:3349/v1';

export const fetchAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-auth`, {
      method: 'GET',
      credentials: 'include', // Ensures cookies are sent with the request
      headers: {
        'Content-Type': 'application/json', // Adjust if your API uses a different content type
      },
    });

    if (!response.ok) {
      throw new Error(`Auth check failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Example response structure
    // {
    //   isAuth: true,
    //   userData: { id: 1, name: 'John Doe', email: 'john@example.com' }
    // }

    return data; // Ensure this matches your backend response structure
  } catch (error) {
    console.error('Error fetching auth status:', error);
    throw error; // Propagate the error for the caller to handle
  }
};


export const registerUser = async (ic_name, steam_name, dc_name, email, password, otpCode) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ic_name,
      steam_name,
      dc_name,
      email,
      password,
      otpCode
    }),
    credentials: 'include', // Handles cookies if needed
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include', // Important to include cookies
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.statusText}`);
  }

  return response.json();
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

export const fetchLastEndedDuty = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/lastEndedDuty`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies in the request
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return {
      lastEndedDutyDate: new Date(data.lastEndedDutyDate),
      totalDutyTime: data.totalDutyTime,
      lastDutyDuration: data.lastDutyDuration
    };
  } catch (e) {
    throw new Error(`Nem sikerült lekérni az utolsó befejezett szolgálat dátumát: ${e.message}`);
  }
};