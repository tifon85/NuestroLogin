// _dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
import {bcrypt} from "bcrypt";

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
  };
  
  export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
  };

export const __dirname = dirname(fileURLToPath(import.meta.url));

export default __dirname