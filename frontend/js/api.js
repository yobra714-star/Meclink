
//UPDATED JS (static logic swapped with fetch to connect front end with backend)
const API_BASE_URL = 'https://meclink.onrender.com/api'; //changed from local host to api url

const api = {
    // Create a new request (Car Owner)
    createRequest: async (data) => {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Get jobs for the mechanic
    getAvailableJobs: async () => {
        const response = await fetch(`${API_BASE_URL}/requests/available`);
        return response.json();
    },

    // Update job status (Accept, Start, Finish)
    updateStatus: async (requestId, status, mechanicId = null) => {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, mechanicId }),
        });
        return response.json();
    }
};
