const VideoCallRepository = require("../repositories/VideoCallRepository");

const { generateRtcToken } = require("../utils/generateRtcToken");

class VideoCallService {
  async createVideoCall(data) {
    const { callerId, receiverId } = data;
    console.log("Create call service===>", callerId, receiverId)
    // const ongoingCall = await VideoCallRepository.getSpecificOngoingCall(
    //   callerId,
    //   receiverId
    // );
    // await VideoCallRepository.update({status: "ended"}, callerId, receiverId)
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
      await VideoCallRepository.create(callDetails);
      return response;
    }
  }
// }

module.exports = new VideoCallService();
