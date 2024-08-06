import { getStorage, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getApp } from "firebase/app";
import { unlinkSync } from "fs"
import firebaseApp from "../firebase/index.js"

const storage = getStorage(firebaseApp);
export const firebaseFileUpload = async (file, ref) => {
  try {
    const uploadedFile = await uploadBytes(file, ref);
    const uploadedFileURI = await getDownloadURL(uploadedFile.ref);
    unlinkSync(file);
    return uploadedFileURI;
  } catch (error) {
    console.error("something happened while uploading file: ", file, "\nError: ", error);
  }
}
export const firebaseFileDelete = async (file, ref) => {
  try {
    const fileRef = ref(ref, file);
    await deleteObject(fileRef);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default storage;
