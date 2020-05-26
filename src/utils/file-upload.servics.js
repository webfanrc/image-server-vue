import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

function httpUpload(formData) {
  const url = `${BASE_URL}/photo/upload`;

  return axios.post(url, formData);
}

export {httpUpload}