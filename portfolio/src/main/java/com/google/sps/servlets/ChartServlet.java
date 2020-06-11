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
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;


@WebServlet("/chart")
public class ChartServlet extends HttpServlet {
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Sets up datastore.
    Query query = new Query("Task");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);


    // Represents strings in datastore as HashMap.
    Map<String, Integer> ageData = new HashMap<>();
    String ageRange;
    int currentVotes;
    for (Entity entity : results.asIterable()) {
      ageRange = (String) entity.getProperty("range");
      currentVotes = ageData.containsKey(ageRange) ? ageData.get(ageRange) : 0;
      ageData.put(ageRange, currentVotes + 1);
    }

    // Writes output as json.
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(ageData);
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Convert request to a string representing an age range.
    int age= -1;
    String ageString = request.getParameter("age");
    try {
      age = Integer.parseInt(ageString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + ageString);
    }

    // Convert to ageRange and store if input is proper. 
    String ageRange = convertToRange(age);
    if (ageRange != "Invalid Age") {
      storeData(ageRange);
    }
    else {
      System.err.println("Improper value entered");
    }
    response.sendRedirect("/chart.html");
  }

  /** Stores age range string in datastore. */
  private void storeData(String range) {
    Entity taskEntity = new Entity("Task");
    taskEntity.setProperty("range", range);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(taskEntity);
  }
  
  /** Converts age number to range string.*/
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
    return range; 
  }
}
