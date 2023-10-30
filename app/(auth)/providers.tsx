import {
  type NullablePSNProfile,
  type NullableProfile,
  type NullableUser,
} from "@/models/AuthModel";
import ProfileProvider from "@/providers/ProfileProvider";
import { type FC, type PropsWithChildren } from "react";

interface ProvidersProps extends PropsWithChildren {
  initialUser?: NullableUser;
  initialProfile?: NullableProfile;
  initialPSNProfile?: NullablePSNProfile;
}

const Providers: FC<ProvidersProps> = (props) => {
  const {
    initialUser = null,
    initialProfile = null,
    initialPSNProfile = null,
    children,
  } = props;
  return (
    <ProfileProvider
      initialUser={initialUser}
      initialProfile={initialProfile}
      initialPSNProfile={initialPSNProfile}>
      {children}
    </ProfileProvider>
  );
};

export default Providers;
