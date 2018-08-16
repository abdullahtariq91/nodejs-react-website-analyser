const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('dist'));

app.post('/api/website', (req, res) => {
  const website = req.body.website;
  request(website, (err, resp, html) => {
    if (!err) {
      const result = [];
      let linksInternal = 0;
      let linksExternal = 0;
      const linksExternalArray = [];

      // load html into cheerio
      const $ = cheerio.load(html);

      // html version
      const versionString = $.html().toString().split('<')[1].split('>')[0];
      result.push({ key: 'HTML Version', value: versionString });

      // get title
      const title = $('title').text();
      const links = $('a');
      result.push({ key: 'Title', value: title });

      // check links
      $(links).each((i, link) => {
        const checkLink = `${$(link).attr('href')}`;
        if (checkLink.startsWith('http')) {
          linksExternalArray.push(checkLink);
          linksExternal++;
        } else {
          linksInternal++;
        }
      });

      result.push(
        { key: 'Internal Links', value: linksInternal },
        { key: 'External Links', value: linksExternal }
      );

      // get headings
      const headings = $(':header');
      const heading = {};
      $(headings).each((i, head) => {
        if (heading[$(head).prop('tagName')] === undefined) {
          heading[$(head).prop('tagName')] = 1;
        } else {
          heading[$(head).prop('tagName')] += 1;
        }
      });

      for (const prop in heading) {
        if (heading.hasOwnProperty(prop)) {
          const innerObj = {};
          innerObj.key = `Number of ${prop}`;
          innerObj.value = heading[prop];
          result.push(innerObj);
        }
      }

      // check login form
      const pattern = new RegExp('Login', 'gi');
      const match = $('body').text().match(pattern);
      let login_form = false;

      if ($('form').length > 0 && $('form input[type="password"]').length > 0 && match && match.length > 0) {
        login_form = "Present";
      } else {
        login_form = "Not present";
      }

      result.push({ key: 'Login Form Present', value: login_form });
      res.send(result);
    } else {
      res.send([]);
    }
  });
});

app.listen(8080, () => console.log('Listening on port 8080!'));
