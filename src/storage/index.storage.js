import { getStorage, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from "firebase/storage";

import { ref } from "firebase/storage";
import { readFileSync, unlinkSync } from "fs"
import firebaseApp from "../firebase/index.js"

class FirebaseStorage {
  constructor(dirs) {
    this.firebaseApp = firebaseApp();
    this.storage = getStorage();
    this.rootRef = ref(this.storage);
    this.Ref = {
    };
    this.metadata = {
      contentType: 'image/jpeg'
    };

    Object.keys(dirs).forEach((key) => this.Ref[key] = ref(this.rootRef, dirs[key]));
  }
  async firebaseFileUpload(file, Ref) {
    try {
      const fileName = file.split("/").pop();
      console.log(fileName)
      const fileRef = ref(this.Ref[Ref], fileName);
      const uploadedFile = await uploadBytesResumable(fileRef, readFileSync("./public/temp/" + fileName), this.metadata);
      const uploadedFileURI = await getDownloadURL(uploadedFile.ref);
      console.log(uploadedFileURI);
      unlinkSync("./public/temp/" + fileName);
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
