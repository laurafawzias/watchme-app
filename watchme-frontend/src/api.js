import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/shows' });

export const getShows = async () => {
  const response = await API.get('/');
  return response.data; // Return just the data array, not the entire response
};

export const addShow = async (data) => {
  const response = await API.post('/', data);
  return response.data;
};

export const deleteShow = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export const updateShow = async (id, data) => {
  const response = await API.put(`/${id}`, data);
  return response.data;
};
