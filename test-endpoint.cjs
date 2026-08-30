const http = require("http");
const payload = JSON.stringify({ projectCost: 150000, marginCapital: 15000 });
const req = http.request({
  hostname: "localhost",
  port: 3001,
  path: "/api/schemes/evaluate",
  method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": payload.length }
}, res => {
  let body = "";
  res.on("data", d => body += d);
  res.on("end", () => {
    const data = JSON.parse(body);
    console.log(data.success ? "SUCCESS" : "ERROR");
    console.log(Object.keys(data));
    if (data.data) {
        console.log(Object.keys(data.data));
        console.log("Number of schemes:", data.data.schemes?.length);
    } else {
        console.log("No data field in response:", data);
    }
  });
});
req.write(payload);
req.end();
