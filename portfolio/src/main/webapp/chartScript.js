

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/** Returns boolean of whether list contains s. */
function contains(list, s) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] == s) {
      return true;
    }
  }
  return false;
}


/** Fetches color data and uses it to create a chart. */

function drawChart() {
  const ageRanges = ['0-9','10-19','20-29','30-39','40-49','50+'];
  fetch('/chart').then(response => response.json())
  .then((ageData) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Age');
    data.addColumn('number', 'Votes');

    for (var i = 0; i < ageRanges.length; i++) {
      range = ageRanges[i];
      console.log(range);
      console.log(Object.keys(ageData))
      if (contains(Object.keys(ageData), range)){
        console.log("in if");
        //console.log(ageData[range]);
        data.addRow([range, ageData[range]]);
      }
      else {
        console.log("in else");
        data.addRow([range, 0]); //should be zero, change later
      }
    }

    const options = {
      'title': 'Ages of Website Users',
      'width':600,
      'height':500
    };

    const chart = new google.visualization.PieChart(
      document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}
