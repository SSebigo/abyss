// npm packages
import popura from "popura";

// TODO: remove this line for 1rst release
import { popuraConfig } from "../../abyss.config.js";

// our packages
import db from "../db/index";

// TODO: get user username and password
export const Popura = popura(popuraConfig.username, popuraConfig.password);
