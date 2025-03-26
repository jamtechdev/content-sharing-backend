const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const APP_ID = "73b4d9a9751c4042ba81f5e53ce7e261";
const APP_CERTIFICATE = "f2e0660b765040de862ff3960c125369";

module.exports.generateRtcToken = async (channelName) => {
  // channelName = `call${Math.floor(Date.now()/1000)}_${callerId}_${receiverId}`;
// module.exports.generateRtcToken = async (callerId, receiverId) => {
//   channelName = `call${Math.floor(Date.now()/1000)}_${callerId}_${receiverId}`;
  
  const uid = Math.round(Date.now() / 1000);
  const role = RtcRole.SUBSCRIBER;
  const expireTime = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  return { token, channelName, uid };
};
