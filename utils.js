var http = require('http');
var https = require('https');

const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

// 去头尾指定字符
const strip = (str, chars) => {
  let newStr = str;
  chars.forEach(char => {
    newStr = newStr.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');
  });
  return newStr;
};

const post =  async (url, data, token)  => {
  var client = (url.protocol == "https:") ? https : http;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token" : token
    },
    timeout: 60000, // in ms
  };
  console.log("data:", data);
  return new Promise((resolve, reject) => {
    const req = client.request(url, options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        console.log(res.statusCode)
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }

      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        console.log(resString)
        resolve(JSON.parse(resString));
      });
    });

    req.on("error", (err) => {
      console.log(err)
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      console.log("Request time out")
      reject(new Error("Request time out"));
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

module.exports = {
  sleep,
  strip,
  post
};
