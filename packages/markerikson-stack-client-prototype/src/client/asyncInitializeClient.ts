import { UserInfo } from "../graphql/types";
import { getCurrentUserInfo } from "../graphql/User";

import globalReplayClient from "./globalReplayClient";

export default async function asyncInitializeClient() {
  // Read some of the hard-coded values from query params.
  // (This is just a prototype; no sense building a full authentication flow.)
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get("accessToken");
  const recordingId = url.searchParams.get("recordingId");
  console.log({ accessToken, recordingId });
  if (!recordingId) {
    throw Error(`Must specify "recordingId" parameter.`);
  }

  const sessionId = await globalReplayClient.initialize(recordingId, accessToken);
  const endpoint = await globalReplayClient.getSessionEndpoint(sessionId);
  console.log("Loaded session: ", sessionId);

  // The demo doesn't use these directly, but the client throws if they aren't loaded.
  // await replayClient.findSources();

  let currentUserInfo: UserInfo | null = null;
  if (accessToken) {
    currentUserInfo = await getCurrentUserInfo(accessToken);
  }

  return {
    accessToken: accessToken || null,
    currentUserInfo,
    duration: endpoint.time,
    endPoint: endpoint.point,
    recordingId,
    sessionId,
  };
}
