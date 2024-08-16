import React, { ChangeEvent, FC, FormEvent, useState } from 'react';

import {
  Flex,
  FormField,
  Input,
  PrimaryButton,
  useMeetingManager,
} from 'amazon-chime-sdk-component-library-react';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
import { createMeeting, getAttendeeFromDB, getMeetingFromDB, joinMeeting } from '../utils/api';

const MeetingForm: FC = () => {
  const meetingManager = useMeetingManager();
  const [meetingTitle, setMeetingTitle] = useState('');
  const [attendeeName, setName] = useState('');
  const [maxAttendee, setMaxAttendee] = useState(10);

  function getAttendeeCallback() {
    return async (chimeAttendeeId: string, externalUserId?: string) => {
      const attendeeInfo: any = await getAttendeeFromDB(chimeAttendeeId);
      return {
        name: attendeeInfo
      };
    }
  }

  const clickedJoinMeeting = async (event: FormEvent) => {
    event.preventDefault();

    meetingManager.getAttendee = getAttendeeCallback();
    const title = meetingTitle.trim();
    const name = attendeeName.trim();

    const meetingResponse: any = await getMeetingFromDB(title);

    try {
      if (meetingResponse !== "") {
        console.log("join exising meeting");
        const meetingInfo = JSON.parse(meetingResponse);
        const res = await joinMeeting(meetingInfo.MeetingId, name);
        const attendeeInfo = JSON.parse(res);

        const config = new MeetingSessionConfiguration(meetingInfo, attendeeInfo);
        await meetingManager.join(config);
      } else {
        console.log("create meeting");

        const res = await createMeeting(title, name, maxAttendee);
        const meetingInfo = JSON.parse(res.MeetingInfo);
        const attendeeInfo = JSON.parse(res.AttendeeInfo);

        const config = new MeetingSessionConfiguration(meetingInfo, attendeeInfo);
        await meetingManager.join(config);
      }
      
    } catch (error) {
      console.log(error);
    }

    await meetingManager.start();
  };

  return (
    <form>
      <FormField
        field={Input}     
        label='External Meeting Id'
        value={meetingTitle}
        fieldProps={{
          name: 'External Meeting Id',
          placeholder: 'Enter a External Meeting ID',
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setMeetingTitle(e.target.value);
        }}
      />
      <FormField
        field={Input}
        label="External Attendee Id"
        value={attendeeName}
        fieldProps={{
          name: 'External Attendee Id',
          placeholder: 'Enter a External Attendee ID'
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setName(e.target.value);
        }}
      />
      <FormField
        field={Input}
        label="Max Attendee"
        value={maxAttendee.toString()}
        fieldProps={{
          name: 'Max Attendee',
          placeholder: 'Enter maximum number of attendees',
          type: 'number'
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setMaxAttendee(Number(e.target.value));
        }}
      />
      <Flex
        container
        layout="fill-space-centered"
        style={{ marginTop: '2.5rem' }}
      >
          <PrimaryButton label="Join Meeting" onClick={clickedJoinMeeting} />
      </Flex>
    </form>
  );
};

export default MeetingForm;
