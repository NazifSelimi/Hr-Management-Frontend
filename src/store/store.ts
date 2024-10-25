// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import departmentsSlice from "./employee/departmentsSlice";
import projectsSlice from "./employee/projectsSlice";
import vacationsSlice from "./employee/vacationsSlice"
import userSlice from "./employee/userSlice";
import vacationAdminSlice from "./admin/vacationAdminSlice"
const store = configureStore({
  reducer: {
    projectStore: projectsSlice,
    departmentStore: departmentsSlice,
    vacationsStore: vacationsSlice,
    userStore: userSlice,
    vacationAdminStore: vacationAdminSlice,
    // userAdminStore: userAdminSlice
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
  