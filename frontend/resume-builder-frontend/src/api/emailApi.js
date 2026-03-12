import api from "./axiosConfig";

export const sendAttachmentEmail = (email) =>
  api.post("/email/send-attachment", null, {
    params: { to: email }
  });