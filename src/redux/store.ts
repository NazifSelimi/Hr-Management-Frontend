// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projectsSlice";
import departmentsReducer from "./departmentsSlice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    departments: departmentsReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
