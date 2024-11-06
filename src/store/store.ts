// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import departmentsSlice from "./employee/departmentsSlice";
import projectsSlice from "./employee/projectsSlice";
import vacationsSlice from "./employee/vacationsSlice"
import userSlice from "./employee/userSlice";
import vacationAdminSlice from "./admin/vacationAdminSlice"
import userAdminSlice from "./admin/userAdminSlice";
import employeeDetailsAdminSlice from "../store/admin/employeeDetailsAdminSlice"
import projectDetailsAdminSlice from "../store/admin/projectDetailsAdminSlice";
import departmentsAdminSlice from "../store/admin/departmentsAdminSlice"

const store = configureStore({
  reducer: {
    projectStore: projectsSlice,
    departmentStore: departmentsSlice,
    vacationsStore: vacationsSlice,
    userStore: userSlice,
    vacationAdminStore: vacationAdminSlice,
    userAdminStore: userAdminSlice,
    employeeDetailsAdminStore: employeeDetailsAdminSlice,
    projectDetailsAdminStore: projectDetailsAdminSlice,
    departmentsAdminStore: departmentsAdminSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
  