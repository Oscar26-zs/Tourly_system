import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../app/config/firebase';

/**
 * Upload a file to Firebase Storage and return its download URL.
 * @param file File selected by the user
 * @param path optional custom path (e.g. `tours/<guideId>/...`). If omitted a path is generated under `uploads/`.
 */
export async function uploadImageFile(file: File, path?: string): Promise<string> {
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const uploadPath = path ? `${path}/${fileName}` : `uploads/${fileName}`;
  const storageRef = ref(storage, uploadPath);

  return new Promise<string>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      () => {
        // progress can be observed by the consumer if needed
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
