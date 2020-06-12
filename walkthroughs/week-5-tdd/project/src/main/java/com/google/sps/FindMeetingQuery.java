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
    
    // Create list of all events an attendee for this meeting is going to.
    Collection<String> attendees = request.getAttendees();
    ArrayList<TimeRange> eventsAttendedTimes = new ArrayList();
    for (Event event : events) {
      if (sharesAttendee(event, attendees)) {
        eventsAttendedTimes.add(event.getWhen());
      }
    }

    // Sort eventsAtendedTimes in ascending order of event start time.
    Collections.sort(eventsAttendedTimes, TimeRange.ORDER_BY_START);
    
    // Merge overlapping TimeRange's in eventAttededTimes.
    Stack<TimeRange> stack = new Stack<TimeRange>();
    stack.push(eventsAttendedTimes.get(0)); 
    TimeRange nextTime;   
    for (int i = 1; i < eventsAttendedTimes.size(); i++) {
      nextTime = eventsAttendedTimes.get(i);
      if (stack.peek().overlaps(nextTime)) {
        // pop from stack, use pop's start
        int start = stack.pop().start();
        stack.push(TimeRange.fromStartEnd(start, nextTime.end(), true)); // not sure about boolean
      }
      else {
        stack.push(nextTime);
      }
    }

    // DEBUGGING
    for (TimeRange time : stack) {
      System.out.println("Start " + time.start() + " , end " + time.end());
    }

    // Return available times
    // return findAvailableTimes(new ArrayList(stack), request.getDuration());

    throw new UnsupportedOperationException("TODO: Implement this method.");
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
      // Check from beginning of day to start time of first element.

      // Check middle.

      // Check from end time of last element to end of day.
  }
}
