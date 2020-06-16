// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.ArrayList;
import java.util.Set;
import java.util.Stack;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {   
    // Make optional attendees mandatory if there are no mandatory attendees.
    Collection<String> attendees = request.getAttendees();
    Collection<String> optionalAttendees = request.getOptionalAttendees();
    if (attendees.size() == 0 && optionalAttendees.size() > 0) {
      attendees = optionalAttendees;
      optionalAttendees = new ArrayList<String>();
    }

    if (optionalAttendees.size() == 0) {
      return FindMeetingTimes(events, request, attendees);
    }
    Collection<String> allAttendees = merge(attendees, optionalAttendees);
    Collection<TimeRange> meetingTimes = FindMeetingTimes(events, request, allAttendees);
    if (meetingTimes.size() == 0) {
      System.out.println("return for no optional attendees");
      return FindMeetingTimes(events, request, attendees);
    }
    System.out.println("returning for optional attendees");
    return meetingTimes;
  }

  /* Finds Meeting Times for All People Given */
  private Collection<TimeRange> FindMeetingTimes(Collection<Event> events, MeetingRequest request, Collection<String> attendees) {
    // Create list of all events an attendee for this meeting is going to.  
    ArrayList<TimeRange> eventsAttendedTimes = new ArrayList();
    for (Event event : events) {
      if (sharesAttendee(event, attendees)) {
        System.out.println(event.getWhen().toString());
        eventsAttendedTimes.add(event.getWhen());
      }
    }
    // Sort eventsAtendedTimes in ascending order of event start time.
    Collections.sort(eventsAttendedTimes, TimeRange.ORDER_BY_START);   
    // Merge overlapping TimeRange's in eventAttededTimes.
    Stack<TimeRange> stack = new Stack<TimeRange>();
    if (eventsAttendedTimes.size() > 0) {
      stack.push(eventsAttendedTimes.get(0)); 
    }
    TimeRange nextTime;   
    for (int i = 1; i < eventsAttendedTimes.size(); i++) {
      nextTime = eventsAttendedTimes.get(i);
      if (stack.peek().overlaps(nextTime)) {
        if (nextTime.end() > stack.peek().end()) {
          // pop from stack, use pop's start
          int start = stack.pop().start();
          stack.push(TimeRange.fromStartEnd(start, nextTime.end(), false));
        }
      }
      else {
        stack.push(nextTime);
      }
    }
    // Store all available time ranges long enough to contain meeting.
    Collection<TimeRange> availableTimes = findAvailableTimes(new ArrayList(stack), request.getDuration());
    Collection<TimeRange> meetingTimes = new ArrayList<TimeRange>();
    for (TimeRange time : availableTimes) {
      if (time.duration() >= request.getDuration()){
        meetingTimes.add(time);
      }
    }
    return meetingTimes;
  }

  /* Checks if event shares attendes with list of attendees */
  private Boolean sharesAttendee(Event event, Collection<String> attendeeList){
    Set<String> eventAttendees = event.getAttendees();
    for (String attendee : eventAttendees){
      if (attendeeList.contains(attendee)) {
        return true;
      }
    }
    return false;
  }

  /** Returns available TimeRange's from list of unavailable times and duration */
  private Collection<TimeRange> findAvailableTimes(ArrayList<TimeRange> unavailableTimes, long duration) {
      Collection<TimeRange> returnRanges = new ArrayList<TimeRange>();
      // Return all day if unavailableTimes is empty.
      if (unavailableTimes.size() == 0) {
        returnRanges.add(TimeRange.WHOLE_DAY);
        return returnRanges;
      }
      // Check from beginning of day to start time of first element.
      TimeRange firstRange = unavailableTimes.get(0);
      if (firstRange.start() != TimeRange.START_OF_DAY) {
        returnRanges.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, firstRange.start(), false));
      }
      // Check middle of the day.
      if (unavailableTimes.size() > 1) {
        TimeRange thisRange;
        TimeRange nextRange;
        TimeRange newTime;
        for (int i = 0; i < unavailableTimes.size() - 1; i++) {
          thisRange = unavailableTimes.get(i);
          nextRange = unavailableTimes.get(i + 1);
          newTime = TimeRange.fromStartEnd(thisRange.end(), nextRange.start(), false);
          if (newTime.duration() > 0) {
            returnRanges.add(newTime);
          }
        }
      }
      // Check from end time of last element to end of day.
      TimeRange lastRange = unavailableTimes.get(unavailableTimes.size() - 1);
      if (lastRange.end() < TimeRange.END_OF_DAY) {
        returnRanges.add(TimeRange.fromStartEnd(lastRange.end(), TimeRange.END_OF_DAY, true));
      }
      return returnRanges;
  }

  private Collection<String> merge(Collection<String> listA, Collection<String> listB) {
    Collection<String> returnList = new ArrayList<String>();
    for (String s : listA) {
      returnList.add(s);
    }
    for (String s : listB) {
      returnList.add(s);
    }
    return returnList;
  }
}
