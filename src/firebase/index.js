import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../constants/index.const.js";
const fireBaseApp = initializeApp(firebaseConfig);
export default fireBaseApp;
