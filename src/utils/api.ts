import axios from 'axios';

const BASE_URL = process.env.REACT_APP_AWS_API_BASE_ENDPOINT;

//会議を作成する
export async function createMeeting(externalMeetingId: string, externalAttendeeId: string, maxAttendee: number) {
  const response = await axios.post(BASE_URL + '/lambda/createMeeting', {
    ExternalMeetingId: externalMeetingId,
    ExternalAttendeeId: externalAttendeeId,
    MaxAttendee: maxAttendee
  })
  .then(res => {
    console.log(res.data);
    return res.data;
  })
  .catch(() => {
    console.error("error at createMeeting axios function.")
  });

  return response;
}

//会議に参加する
export async function joinMeeting(meetingId: string, externalAttendeeId: string) {
  const response = await axios.post(BASE_URL + '/lambda/joinMeeting', {
    MeetingId: meetingId,
    ExternalAttendeeId: externalAttendeeId,
  })
  .then(res => {
    return res.data.AttendeeInfo;
  })
  .catch(() => {
    console.error("error at joinMeeting axios function.");
  });

  return response;
}

//会議を終了する
export async function endMeeting(meetingId: string, externalMeetingId: string) {
  await axios.post(BASE_URL + `/lambda/endMeeting`, {
    MeetingId: meetingId,
    ExternalMeetingId: externalMeetingId
  })
  .then(() => {
    console.log("OK");
  })
  .catch(() => {
    console.error("error at endMeeting axios function.");
  });
}

//会議から退出する
export async function leaveMeeting(meetingId: string, attendeeId: string) {
  await axios.post(BASE_URL + `/lambda/leaveMeeting`, {
    MeetingId: meetingId,
    AttendeeId: attendeeId
  })
  .then(() => {
    console.log("OK");
  })
  .catch(() => {
    console.error("error at leaveMeeting axios function.")
  });
}

//DynamoDBから会議情報を取得する
export async function getMeetingFromDB(externalMeetingId: string) {
  let response = await axios.get(BASE_URL + `/dynamoDB/getMeeting/${externalMeetingId}`)
  .then(res => {
    return res.data.MeetingInfo;
  })
  .catch(() => {
    console.error("error at getMeetingFromDB axios function.")
  });

  return response;
}

//DynamoDBから参加者情報を取得する
export async function getAttendeeFromDB(attendeeId: string) {
  let response = await axios.get(BASE_URL + `/dynamoDB/getAttendee/${attendeeId}`)
  .then(res => {
    return res.data.ExternalAttendeeId;
  })
  .catch(() => {
    console.error("error at getAttendeeFromDB axios function.")
  });

  return response;
}
