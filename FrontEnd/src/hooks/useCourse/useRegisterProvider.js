import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api"; 

const useRegisterProvider = () => {
  return useMutation({
    mutationKey: ["RegisterProvider"],
    mutationFn: async (formData) => {
      const res = await api.post("/provider/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
  });
};

export default useRegisterProvider;