import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  getRecentPosts,
  signInAccount,
  signOutAccount,
} from "../appwrite/services";
import { INewPost, INewUser } from "@/types";
import { QueryKeys } from "./queryKeys";

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

export const useSignOutAccount = () => {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: signOutAccount,
  });

  return { mutate, isPending, isSuccess };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_RECENT_POSTS],
      }),
  });

  return { mutateAsync, isPending };
};

export const useGetRecentPosts = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: [QueryKeys.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });

  return { data, isPending, isError };
};
