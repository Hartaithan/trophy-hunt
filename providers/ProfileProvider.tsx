import API from "@/api/API";
import {
  type NullableProfile,
  type NullablePSNProfile,
} from "@/models/AuthModel";
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useState,
  useContext,
} from "react";

interface IProfileProvider extends PropsWithChildren {
  initialProfile: NullableProfile;
  initialPSNProfile: NullablePSNProfile;
}

interface IProfilesState {
  psn: NullablePSNProfile;
  profile: NullableProfile;
}

interface IProfileContext {
  profiles: IProfilesState;
  updatePSNProfile: () => void;
}

const initialContextValue: IProfileContext = {
  profiles: { psn: null, profile: null },
  updatePSNProfile: () => null,
};

const Context = createContext(initialContextValue);

const ProfileProvider: FC<IProfileProvider> = (props) => {
  const { children, initialProfile, initialPSNProfile } = props;
  const initialProfiles: IProfilesState = {
    psn: initialPSNProfile ?? null,
    profile: initialProfile ?? null,
  };
  const [profiles, setProfiles] = useState<IProfilesState>(initialProfiles);

  const updatePSNProfile = (): void => {
    API.get("/auth/profile")
      .then(({ data }) => {
        const psn_profile = data.profile;
        setProfiles((prev) => ({ ...prev, psn: psn_profile }));
      })
      .catch((error) => {
        console.error("unable to fetch profile", error);
      });
  };

  const exposed: IProfileContext = {
    profiles,
    updatePSNProfile,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useProfiles = (): IProfileContext => useContext(Context);

export default ProfileProvider;
