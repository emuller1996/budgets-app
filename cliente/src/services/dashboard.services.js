/* eslint-disable prettier/prettier */

import axios from "axios";

export const getSales30DaysService = (data) => {
  return axios.get("/dash/sales", data);
};






