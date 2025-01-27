import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuthStatus, loginUser as apiLoginUser, logoutUser as apiLogoutUser } from '../../api/dutyApi';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const data = await fetchAuthStatus();
    return data;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const data = await apiLoginUser(credentials.email, credentials.password);
    return data;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await apiLogoutUser();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    lastChecked: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    updateLastChecked(state) {
      state.lastChecked = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.userData;
        state.isAuthenticated = action.payload.isAuth;
        state.loading = false;
        state.lastChecked = Date.now();
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.userData;
        state.isAuthenticated = true;
        state.loading = false;
        state.lastChecked = Date.now();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, async (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.lastChecked = null;
        window.location.reload();
      });
  },
});

export const { clearError, updateLastChecked } = authSlice.actions;

export default authSlice.reducer;

