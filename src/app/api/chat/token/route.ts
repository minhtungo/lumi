import { auth } from "@/auth";
import { ApiResponse } from "@/lib/response";
import { getChatUser } from "@/lib/session";
import { getTokenUseCase } from "@/use-cases/api";
import { StatusCodes } from "http-status-codes";

export const GET = auth(async (req) => {
  const existingUser = req?.auth?.user;

  const user = await getChatUser(existingUser);

  const token = await getTokenUseCase({
    userId: user.id,
  });

  console.log("****************GET request chat token", user, token);

  return Response.json(
    ApiResponse.success(
      "Successfully fetched token",
      { token },
      StatusCodes.OK,
    ),
    {
      status: 200,
      statusText: "OK",
    },
  );
});
