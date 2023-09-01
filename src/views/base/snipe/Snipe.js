import axios from 'axios';

const baseURL = 'https://your-ocs-inventory-api'; // Replace with your Snipe-IT API URL

export const getITAssets = async () => {
  try {
    const response = await axios.get(`${baseURL}/inventory/computers/all`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to retrieve IT assets');
  }
};

export default getITAssets;