import express from "express";
import  http from "http";

const app = express();

const filterByDate = (data, date) => {
  return data.result.filter((item) => {
      const itemDate = new Date(item.startTime).getTime();
      const filteredDate = new Date(date).getTime();
      return itemDate >= filteredDate;
    });
}

// Factory method to creat a handler for specified URL
const getHandler = (url) => {
  return (req, res) => {
    let request = http.get(url, (proxyRes) => {
      if (res.statusCode !== 200) {
        console.error(`Did not get an OK from the server. Code: ${proxyRes.statusCode}`);
        proxyRes.resume();
        return;
      }

      let data = '';

      proxyRes.on('data', (chunk) => {
        data += chunk;
      });

      proxyRes.on('close', () => {
        let date = req.query.date;

        // the API returns a json obj with error message and result which is array of content
        let content = JSON.parse(data);

        if (date) {
          content.result = filterByDate(content, date)
          console.log(`Filetering by date: ${date} gave ${content.length} objects`);
        }
        // Now respond with the data to our requester
        res.send(content);
      });

    });
  }
}

app.get("/", getHandler("http://localhost:8088/pods"));
app.get("/pods", getHandler("http://localhost:8088/pods"));
app.get("/deployments", getHandler("http://localhost:8088/deployments"));

let server = app.listen(3005, () =>
  console.log("filtersvr running at 3005")
);

app.get("/exit", (req, res) => {
  res.send('closing..');
  server.close();
});