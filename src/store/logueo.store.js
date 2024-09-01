import { create } from 'zustand';

const useLogueoStore = create((set, get) => ({
    showLG: false,
    form: 2,
    setShowLG: (show) => {
        set({ showLG: show })
    },
    setForm: (form) => {
        set({ form: form })
    },
}));

export { useLogueoStore };