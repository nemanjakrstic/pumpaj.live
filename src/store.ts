import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Location } from "./types/Location";
import { v4 } from "uuid";

const DEFAULT_PLACE = {
  id: "AQAAADgAHxUwsWPixsURVUgqSMjwC2gUNMHpcHhrvzZnGqqHCmE1wuvrqge89adStMaSrF37sj_8mZtnNHRt7ldbOiKi2Mj_sgyetLkNptJeMJ3bks2agFRlqktZBw",
  title: "Beograd",
};

const DEFAULT_LOCATION = {
  lng: 20.4632,
  lat: 44.8131,
};

interface Store {
  acknowledged: boolean;
  place: { id: string; title: string };
  location: Location;
  user: string;
}

export const useStore = create(
  persist<Store>(
    () => ({
      acknowledged: false,
      place: DEFAULT_PLACE,
      location: DEFAULT_LOCATION,
      user: v4(),
    }),
    {
      name: "pumpaj.live",
      version: 1,
      migrate: (persistedState, version) => {
        const state = persistedState as Store;

        if (version === 0) {
          state.user = v4();
        }

        return state;
      },
    }
  )
);
