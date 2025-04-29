// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const product = action.payload;
//       const existingItem = state.cartItems.find((item) => item.id === product.id);

//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         state.cartItems.push({ ...product, quantity: 1 });
//       }

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     removeFromCart: (state, action) => {
//       state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload;
//       const item = state.cartItems.find((item) => item.id === id);
//       if (item) {
//         item.quantity = quantity;
//       }
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     clearCart: (state) => {
//       state.cartItems = [];
//       localStorage.removeItem("cartItems");
//     },
//   },
// });

// export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// export default cartSlice.reducer;
