import { get, put, del } from "@/actions/fetch-client";

export function getMyAccount() {
  return get("/me");
}

export function updateMyProfile(data) {
  return put("/me/profile", data);
}

export function changeMyPassword(data) {
  return put("/me/password", data);
}

export async function uploadMyAvatar(file) {
  const formData = new FormData();

  formData.append("file", file);

  return put(`/me/avatar`, formData);
}

export function deleteMyAccount() {
  return del("/me");
}
