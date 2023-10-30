"use client";

import {
  type NullableUser,
  type NullableProfile,
  type NullablePSNProfile,
} from "@/models/AuthModel";
import API from "@/utils/api";
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ProfileProviderProps extends PropsWithChildren {
  initialUser: NullableUser;
  initialProfile: NullableProfile;
  initialPSNProfile: NullablePSNProfile;
}

interface ProfilesState {
  psn: NullablePSNProfile;
  profile: NullableProfile;
  user: NullableUser;
}

interface ProfileContext extends ProfilesState {
  isAuth: boolean;
  setUser: Dispatch<SetStateAction<NullableUser>>;
  setPSN: Dispatch<SetStateAction<NullablePSNProfile>>;
  setProfile: Dispatch<SetStateAction<NullableProfile>>;
  updateProfile: () => void;
  updatePSNProfile: () => void;
}

const initialContextValue: ProfileContext = {
  isAuth: false,
  user: null,
  setUser: () => null,
  psn: null,
  setPSN: () => null,
  profile: null,
  setProfile: () => null,
  updateProfile: () => null,
  updatePSNProfile: () => null,
};

const Context = createContext(initialContextValue);

const ProfileProvider: FC<ProfileProviderProps> = (props) => {
  const {
    children,
    initialUser = null,
    initialProfile = null,
    initialPSNProfile = null,
  } = props;
  const [user, setUser] = useState<NullableUser>(initialUser);
  const [profile, setProfile] = useState<NullableProfile>(initialProfile);
  const [psn, setPSN] = useState<NullablePSNProfile>(initialPSNProfile);

  const updateProfile = (): void => {
    API.get("/profile")
      .then(({ data }) => {
        setProfile(data?.profile ?? null);
      })
      .catch((error) => {
        console.error("unable to fetch profile", error);
      });
  };

  const updatePSNProfile = (): void => {
    API.get("/profile/psn")
      .then(({ data }) => {
        setPSN(data?.profile ?? null);
      })
      .catch((error) => {
        console.error("unable to fetch psn profile", error);
      });
  };

  const exposed: ProfileContext = {
    isAuth: psn !== null && user !== null,
    user,
    setUser,
    psn,
    setPSN,
    profile,
    setProfile,
    updateProfile,
    updatePSNProfile,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useProfiles = (): ProfileContext => useContext(Context);

export default ProfileProvider;
