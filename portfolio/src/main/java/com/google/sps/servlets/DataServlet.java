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

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.util.List;
import java.util.Iterator;

/** Servlet that handles comments data. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  public ArrayList<String> comments = new ArrayList<String>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get comments in specified order.
    int orderNum = 0;
    String orderString = request.getParameter("order");
    try {
      orderNum = Integer.parseInt(orderString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + orderString);
    }
    Query query = new Query("Task").addSort("timestamp", SortDirection.DESCENDING);
    if (orderNum == 1) {
      query = new Query("Task").addSort("timestamp", SortDirection.ASCENDING);
    }
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    // Convert the input into an int.
    String maxCommentsString = request.getParameter("max-comments");
    int maxComments = 3;  // 3 is the default value.
    try {
      maxComments = Integer.parseInt(maxCommentsString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + maxCommentsString);
    }

    List<String> comments = new ArrayList<>();
    String fullComment;
    Iterator<Entity> resultsIterator = results.asIterator();
    Entity entity;
    for (int i = 0; i < maxComments; i++) { 
      if (!resultsIterator.hasNext()){ 
        break; 
      }
      entity = resultsIterator.next();
      fullComment = ((String) entity.getProperty("title"));
      if (entity.getProperty("name") != "") {
        fullComment += " - " + ((String) entity.getProperty("name"));
      }
      comments.add(fullComment); 
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Gets input from form.
    String name = request.getParameter("name-input");
    String comment = request.getParameter("text-input");   
    comments.add(comment);
    storeData(name, comment);
    response.sendRedirect("comments.html");
  }
 
  /** Stores comment as an entity. */
  private void storeData(String name, String comment) {
    String title = comment;
    long timestamp = System.currentTimeMillis();

    Entity taskEntity = new Entity("Task");
    taskEntity.setProperty("title", title);
    taskEntity.setProperty("name", name);
    taskEntity.setProperty("timestamp", timestamp);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(taskEntity);
  }
}
