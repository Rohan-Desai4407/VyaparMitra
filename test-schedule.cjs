const http = require("http");
const payload = JSON.stringify({ capital: 25000, projectCost: 200000, categoryId: "mock-1", stateId: "mock-1" });
const req = http.request({
  hostname: "localhost",
  port: 3001,
  path: "/api/financial/calculate-schedule",
  method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": payload.length }
}, res => {
  let body = "";
  res.on("data", d => body += d);
  res.on("end", () => {
    console.log(body);
  });
});
req.write(payload);
req.end();
