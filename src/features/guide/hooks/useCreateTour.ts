import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { createTour, type CreateTourInput } from '../services/createTour';

export function useCreateTour(
  options?: UseMutationOptions<string, Error, CreateTourInput, unknown>
) {
  const qc = useQueryClient();

  return useMutation<string, Error, CreateTourInput, unknown>({
    ...options,
    mutationFn: async (input: CreateTourInput) => {
      return await createTour(input);
    },
    // lifecycle wrapper that invalidates relevant queries and still calls user handlers
    async onSuccess(data, variables, context) {
      try {
        // try to resolve guideId whether it's string or a DocumentReference-like object
        const gid = (variables as any)?.idGuia;
        const guideId =
          typeof gid === 'string' ? gid : gid && (gid.id || gid.path?.split('/').pop());

        if (guideId) {
          qc.invalidateQueries({ queryKey: ['guideTours', guideId] });
        }

        // invalidate generic tours list or specific tour cache
        qc.invalidateQueries({ queryKey: ['tours'] });
        if (data) qc.invalidateQueries({ queryKey: ['tour', data] });
      } finally {
        if (options?.onSuccess) (options.onSuccess as any)(data, variables, context);
      }
    },
    onError(error, variables, context) {
      if (options?.onError) (options.onError as any)(error, variables, context);
    },
  });
}