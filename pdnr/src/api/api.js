export const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:3000/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  return response.json();
};
