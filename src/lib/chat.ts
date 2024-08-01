import { fetchAuth } from "@/lib/fetch";
import { createPayload } from "@/lib/utils";

const createRoom = async (userId: string) => {
  const payload = createPayload({
    uid: userId,
  });

  const { data } = await fetchAuth({
    url: "/chat/create-room",
    method: "POST",
    payload,
  });

  return data;
};
