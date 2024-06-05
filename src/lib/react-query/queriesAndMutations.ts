import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentUser,
  getPostById,
  getRecentPosts,
  likePost,
  savePost,
  signInAccount,
  signOutAccount,
  updatePost,
} from "../appwrite/services";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { QueryKeys } from "./queryKeys";
import { toast } from "@/components/shadcn/use-toast";

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

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) =>
      likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_RECENT_POSTS, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_POSTS, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_CURRENT_USER, data?.$id],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_CURRENT_USER],
      });

      toast({ title: "Post saved successfully!" });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_CURRENT_USER],
      });

      toast({ title: "Post removed from Saved!" });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) => {
      return deletePost(postId, imageId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_RECENT_POSTS],
      });
    },
  });
};
