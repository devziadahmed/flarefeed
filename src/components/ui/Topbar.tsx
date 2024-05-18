import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../shadcn/button";
import { useSignOutAccount } from "@/lib/react-qurey/queriesAndMutations";
import { useAuth } from "@/context/AuthContext";

const Topbar = () => {
  const {
    mutate: signOut,
    isPending: isSigningOut,
    isSuccess: isSuccessfullySignedOut,
  } = useSignOutAccount();

  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    if (isSuccessfullySignedOut) navigate(0);
  }, [isSuccessfullySignedOut, navigate]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src="./assets/images/logo.png" alt="logo" width={130} height={130} />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
            disabled={isSigningOut}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
