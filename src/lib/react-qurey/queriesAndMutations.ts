import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { createUserAccount, signInAccount } from "../appwrite/services";
import { INewUser } from "@/types";

export const useCreateUserAccount = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });

  return { mutateAsync, isPending };
};

export const useSignInAccount = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (user: { email: string; password: string }) => signInAccount(user),
  });

  return { mutateAsync, isPending };
};
