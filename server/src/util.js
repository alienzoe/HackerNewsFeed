import jwt from "jsonwebtoken";

export function getUserId(request) {
  const Authorization = request.get("Authorization");

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    return userId;
  }

  return false;
}
