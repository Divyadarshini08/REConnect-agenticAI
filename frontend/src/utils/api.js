export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Utility function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Utility function for authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API}${endpoint}`;
    const config = {
        headers: getAuthHeaders(),
        ...options
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};
