// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import departmentsSlice from "./departmentsSlice";
import projectsSlice from "./projectsSlice";
import vacationsSlice from "./vacationsSlice"
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    projectStore: projectsSlice,
    departmentStore: departmentsSlice,
    vacationsStore: vacationsSlice,
    userStore: userSlice,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
