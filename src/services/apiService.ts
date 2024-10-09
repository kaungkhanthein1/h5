import axios from 'axios';
import { encryptWithRsa, generateSignature } from './encryptionService';

const API_URL = '';

// Service function to make a POST request
export async function postRequest(endpoint: string, data: object) {
    const encryptedData = encryptWithRsa(JSON.stringify(data));
    const signature = generateSignature(encryptedData);

    try {
        const response = await axios.post(`${API_URL}${endpoint}`, {
            pack: encryptedData,
            signature: signature
        });

        return response.data;
    } catch (error) {
        console.error('API POST Error:', error);
        throw error;
    }
}

// Service function to make a GET request
export async function getRequest(endpoint: string, params: object = {}) {
    const encryptedData = encryptWithRsa(JSON.stringify(params));
    const signature = generateSignature(encryptedData);

    try {
        const response = await axios.get(`${API_URL}${endpoint}`, {
            params: {
                pack: encryptedData,
                signature: signature
            }
        });

        return response.data;
    } catch (error) {
        console.error('API GET Error:', error);
        throw error;
    }
}
