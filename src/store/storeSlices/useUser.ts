import {StateCreator} from "zustand";
import SpaceGameStateUtils from "../SpaceGameStateUtils";
import { UserState, UserType } from "../StoreState";

const useUser: StateCreator<
  UserState,
  [],
  [],
  UserState
> = (set) => ({
  isLoggedIn: false,
  user: {
    homebase: '',
    solarSystem: '',
    name: ''
  },
  logIn: (user: UserType, logOut?: boolean) => set((state) => ({
    user: user, isLoggedIn: logOut ? false : true
  })),
})


export default useUser;