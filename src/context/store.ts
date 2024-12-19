// src/store.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import playerReducer from "../features/player/playerSlice";
import { searchApi } from "../pages/search/services/searchApi";
import HistorySlice from "../pages/search/slice/HistorySlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import FavoriteSlice from "../pages/search/slice/FavoriteSlice";
import HomeSlice from "../pages/home/slice/HomeSlice";
import ExploreSlice from "../pages/explorer/slice/ExploreSlice";
import modelReducer from "..//features/login/ModelSlice";
import { homeApi } from "../pages/home/services/homeApi";
import { explorerAPi } from "../pages/explorer/services/explorerAPi";
import { profileApi } from "../pages/profile/services/profileApi";
import UserSlice from "../pages/profile/components/slice/UserSlice";
import ErrorSlice from "../pages/profile/error/ErrorSlice";
import RegisterApi from "../features/login/RegisterApi";
import ShareApi from "../features/share/ShareApi";
import AdsApi from "../features/share/AdsApi";
import { socialApi } from "../pages/social/services/socialApi";

// Define persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["history", "favorite", "user", "explore", "home", "model"], // Reducers you want to persist
};

// Combine all reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  episode: playerReducer,
  model: modelReducer,
  history: HistorySlice,
  favorite: FavoriteSlice,
  error: ErrorSlice,
  user: UserSlice,
  home: HomeSlice,
  explore: ExploreSlice,

  [searchApi.reducerPath]: searchApi.reducer,
  [socialApi.reducerPath]: socialApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
  [explorerAPi.reducerPath]: explorerAPi.reducer,
  [RegisterApi.reducerPath]: RegisterApi.reducer,
  [ShareApi.reducerPath]: ShareApi.reducer,
  [AdsApi.reducerPath]: AdsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    })
      .concat(searchApi.middleware)
      .concat(profileApi.middleware)
      .concat(homeApi.middleware)
      .concat(explorerAPi.middleware)
      .concat(RegisterApi.middleware)
      .concat(ShareApi.middleware)
      .concat(AdsApi.middleware)
      .concat(socialApi.middleware),
});

export const persistor = persistStore(store);

export default store;
