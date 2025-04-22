export const theme = {
    extend: {
        animation: {
            'modal-show': 'modalOpen 0.3s ease-out',
        },
        keyframes: {
            modalOpen: {
                '0%': { opacity: 0, transform: 'scale(0.8)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
            },
        },
    },
};