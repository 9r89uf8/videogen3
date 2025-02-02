import { useStore } from '../store/store'; // Ensure you import the correct store


export const createVideo = async (formData) => {
    try {
        const response = await fetch('/api/generateVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();

            return data;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error.message);
        return null;
    }
};

export const getVideo = async (formData) => {
    try {
        const response = await fetch('/api/getVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const data = await response.json();

            return data;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error.message);
        return null;
    }
};

export const getVideos = async (formData) => {
    try {
        const setPosts = useStore.getState().setPosts;
        const response = await fetch('/api/getVideos', {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
            return data;
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating:', error.message);
        return null;
    }
};

