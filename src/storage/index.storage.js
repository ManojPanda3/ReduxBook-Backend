import { getStorage, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref } from "firebase/storage";
import { unlinkSync } from "fs"
import firebaseApp from "../firebase/index.js"

class FirebaseStorage {
  constructor(dirs) {
    this.firebaseApp = firebaseApp;
    this.storage = getStorage(firebaseApp, "gc://" + process.env.STORAGEBUCKET);
    this.Ref = {
    };
    Object.keys(dirs).forEach((key) => this.Ref[key] = ref(this.storage, dirs[key]));
  }
  async firebaseFileUpload(file, ref) {
    try {
      const uploadedFile = await uploadBytes(file, this.Ref[ref]);
      const uploadedFileURI = await getDownloadURL(uploadedFile.ref);
      unlinkSync(file);
      return uploadedFileURI;
    } catch (error) {
      console.error("something happened while uploading file: ", file, "\nError: ", error);
    }
  }
  async firebaseFileDelete(file, ref) {
    try {
      const fileRef = ref(ref, file);
      await deleteObject(fileRef);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default FirebaseStorage;
