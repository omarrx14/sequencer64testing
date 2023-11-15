import store from 'App/store';
import axios from 'axios';
import { HOST } from 'utils/network';

export const apiGetUser = () =>
  axios.get(`${HOST}/user`, {
    withCredentials: true,
    headers: { authorization: 'Bearer ' + store.getState().app.authToken },
  });

export const apiGetSequence = (_id) =>
  axios({
    url: `${HOST}/user/sequence`,
    method: 'POST',
    data: { _id },
    withCredentials: true,
  });

export const apiSaveSequence = (sequence) =>
  axios({
    url: `${HOST}/user/sequence/save`,
    method: 'POST',
    data: sequence,
    withCredentials: true,
    headers: { authorization: 'Bearer ' + store.getState().app.authToken },
  });

export const apiDeleteSequence = (_id) =>
  axios({
    url: `${HOST}/user/sequence/delete`,
    method: 'POST',
    data: { _id },
    withCredentials: true,
    headers: { authorization: 'Bearer ' + store.getState().app.authToken },
  });

export const preFetchSamples = async (samples) => {
  const promises = [];
  samples.forEach((sample) => {
    promises.push(fetch(sample.path));
  });
  let received, error;
  try {
    await Promise.all(promises);
    received = true;
  } catch (e) {
    error = e;
  } finally {
    return [received, error];
  }
};
