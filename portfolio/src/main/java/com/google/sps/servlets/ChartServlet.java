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

package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/chart")
public class ChartServlet extends HttpServlet {

  /*
  private Map<String, Integer> ageData = Map.of(
    "0-9", 0,
    "10-19", 0,
    "20-29", 0,
    "30-39", 0,
    "40-49", 0,
    "50+", 0
  );
  */
  private Map<String, Integer> ageData = new HashMap<>();
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(ageData);
    System.out.println(json);
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Convert request to a string representing an age range.
    int age= -1; // THROW AN ERROR LATER?
    String ageString = request.getParameter("age");
    try {
      age = Integer.parseInt(ageString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + ageString);
    }
    String ageRange = convertToRange(age);
    
    // Update ageData with new vote.
    //int currentVotes = ageData.get(ageRange);
    //ageData.replace(ageRange, currentVotes + 1);
    int currentVotes = ageData.containsKey(ageRange) ? ageData.get(ageRange) : 0;
    ageData.put(ageRange, currentVotes + 1);

    // DEBUGGING
    ageData.forEach((key, value) -> System.out.println(key + ":" + value));

    response.sendRedirect("/chart.html");
  }
  
  private String convertToRange(int age) {
    age = age / 10;
    String range = "Invalid Age";
    switch (age) {
      case 0:
        range = "0-9";
        break;
      case 1:
        range = "10-19";
        break;
      case 2:
        range = "20-29";
        break;
      case 3:
        range = "30-39";
        break;
      case 4:
        range = "40-49";
        break;
    }
    if (age >= 5) {
      range = "50+";
    }
    return range; // THROW AN ERROR? 
  }
  
}
