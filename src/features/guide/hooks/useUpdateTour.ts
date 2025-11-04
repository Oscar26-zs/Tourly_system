import { useMutation, useQueryClient, type UseMutationOptions, type MutationFunction } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../app/config/firebase';
import type { Tour } from '../../public/types/tour';

type UpdatePayload = {
  id: string;
  data: Partial<Tour>;
  guideId?: string | null;
};

export function useUpdateTour(
  options?: UseMutationOptions<void, Error, UpdatePayload, unknown>
) {
  const qc = useQueryClient();

  // typed mutation function so TS treats the first argument as a MutationFunction
  const mutationFn: MutationFunction<void, UpdatePayload> = async ({ id, data }) => {
    if (!id) throw new Error('Missing tour id');
    const ref = doc(db, 'tours', id);
    await updateDoc(ref, data as any);
  };

  return useMutation<void, Error, UpdatePayload, unknown>({
    mutationFn,
    // include user options first so we can override lifecycle handlers below
    ...options,
    // merge lifecycle handlers so user options still run
    async onSuccess(data: void, variables: UpdatePayload, context: unknown) {
      try {
        if (variables?.guideId) {
          // invalidate guide tours list
          qc.invalidateQueries({ queryKey: ['guideTours', variables.guideId] });
        }
        // invalidate single tour cache
        qc.invalidateQueries({ queryKey: ['tour', variables.id] });
      } finally {
        // call user-provided onSuccess if any
        if (options?.onSuccess) {
          // options.onSuccess has same signature: (data, variables, context)
          // cast to any to satisfy TS in this wrapper
          (options.onSuccess as any)(data, variables, context);
        }
      }
    },
    onError(error: any, variables: any, context: any) {
      if (options?.onError) {
        (options.onError as any)(error, variables, context);
      }
    },
    // other options (onSettled, retry, etc.) already included via ...options
  });
}