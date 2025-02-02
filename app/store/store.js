// store/store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createPostsSlice } from './postsSlice';

export const useStore = create(
    persist(
        (set, get) => ({
            ...createPostsSlice(set, get),
            hasHydrated: false,
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'vidgen3',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.log('An error occurred during hydration', error);
                } else {
                    state.setHasHydrated(true);
                }
            },
        }
    )
);

export default useStore;




