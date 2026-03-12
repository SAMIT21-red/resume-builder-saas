import api from "./axiosConfig";

export const createResume = (data) =>
  api.post("/resume", data);

export const getMyResumes = () =>
  api.get("/resume/my");

export const generateResumePdf = (id) =>
  api.get(`/resume/generate/${id}`, {
    responseType: "blob"
  });