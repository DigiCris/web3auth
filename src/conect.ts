import { useEffect, useState } from "react";
import env from "react-dotenv";
const Web3 = require('web3');

export const web3 = new Web3(env.URL_NODE);