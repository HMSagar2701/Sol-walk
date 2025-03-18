import { API } from "./axios";

export const getGroupChallengesRequest = async () => {
  console.log("API", API);
  const response = await API.get("/api/group/");
  console.log("response", response);
  // const response = await API.get("/api/group-challenges/")
};

export const createGroupChallengesRequest = async () => {
  // const response = await API.post("/api/group-challenges/create-group-challenge", {})
};

export const createGroupReuest = async () => {
  // const response = await API.post("/api/group-challenges/create-group-challenge", {})
};

export const joinGroupChallengeRequest = async () =>{

}
