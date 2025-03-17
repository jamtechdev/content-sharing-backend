const RtcTokenRepository = require("../repositories/RtcTokenRepository");

const { generateRtcToken } = require("../utils/generateRtcToken");

class RtcTokenService {
  async createVideoCall(data) {
    const { callerId, receiverId } = data;
    console.log("Create call service===>", callerId, receiverId)
    // const ongoingCall = await RtcTokenRepository.getSpecificOngoingCall(
    //   callerId,
    //   receiverId
    // );
    // await RtcTokenRepository.update({status: "ended"}, callerId, receiverId)
    // if (!ongoingCall) {
      const response = await generateRtcToken(callerId, receiverId);
      console.log(response)
      const callDetails = {
        caller_id: callerId,
        receiver_id: receiverId,
        channel_name: channelName,
        start_time: new Date(),
        // status : "ongoing", // how to identify status
      };
      await RtcTokenRepository.create(callDetails);
      return response;
    }
  }
// }

module.exports = new RtcTokenService();
