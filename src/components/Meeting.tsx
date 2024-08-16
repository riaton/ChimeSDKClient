import React, { FC } from 'react';

import {
  AudioInputControl,
  AudioOutputControl,
  ControlBar,
  ControlBarButton,
  Phone,
  useMeetingManager,
  MeetingStatus,
  useMeetingStatus,
  VideoInputControl,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react';
import { endMeeting, leaveMeeting } from '../utils/api';

const Meeting: FC = () => {
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();

  const clickedEndMeeting = async () => {
    const meetingId = meetingManager.meetingId;
    let externalMeetingId = meetingManager.meetingSessionConfiguration?.externalMeetingId;
    if (meetingId) {
      if(!externalMeetingId){
        externalMeetingId = '';
      }
      await endMeeting(meetingId, externalMeetingId);
      await meetingManager.leave();
    }
  }

  const clickedLeaveMeeting = async () => {
    const meetingId = meetingManager.meetingId;
    const attendeeId = meetingManager.meetingSession?.configuration?.credentials?.attendeeId;
    if (meetingId && attendeeId) {
      console.log("leave meeting");
      await leaveMeeting(meetingId, attendeeId);
      await meetingManager.leave();
    }
  }
  
  return (
      <div style={{marginTop: '2rem', height: '40rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <VideoTileGrid/>
        {meetingStatus === MeetingStatus.Succeeded ? 
          <ControlBar
            layout="undocked-horizontal"
            showLabels
          >
            <AudioInputControl />
            <VideoInputControl />
            <AudioOutputControl />
            <ControlBarButton icon={<Phone />} onClick={clickedLeaveMeeting} label="Leave" />
            <ControlBarButton icon={<Phone />} onClick={clickedEndMeeting} label="End" />
          </ControlBar> 
          :
          <div/>
        }
      </div>
  );
};

export default Meeting;