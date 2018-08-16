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

const getVersion = ($) => {
  // add check for comments
  const versionString = $.html().toString().split('<')[1].split('>')[0];
  let doctypeCheck = versionString;
  // check for doctype keyword
  if (!doctypeCheck.toLowerCase().includes('doctype')) {
    return { key: 'HTML Version', value: 'DOCTYPE not present' };
  } else {
    return { key: 'HTML Version', value: versionString };
  }
}

const getTitle = ($) => {
  const title = $('title').text();
  return { key: 'Title', value: title };
}

const getLinks = ($) => {
  const links = $('a');
  let linksInternal = 0;
  let linksExternal = 0;
  const linksExternalArray = [];

  $(links).each((i, link) => {
    const checkLink = `${$(link).attr('href')}`;
    // check for external links with http keyword
    if (checkLink.startsWith('http')) {
      linksExternalArray.push(checkLink);
      linksExternal++;
    } else {
      linksInternal++;
    }
  });
  return [
    { key: 'Internal Links', value: linksInternal },
    { key: 'External Links', value: linksExternal }
  ]
}

const getHeadings = ($) => {
  const headings = $(':header');
  const heading = {};
  let headingsArray = [];
  // populate object with h1, h2, h3, etc key value pairs
  $(headings).each((i, head) => {
    if (heading[$(head).prop('tagName')] === undefined) {
      heading[$(head).prop('tagName')] = 1;
    } else {
      heading[$(head).prop('tagName')] += 1;
    }
  });

  // push objects with { "key": "Number of h1", "value": "3" } format
  for (const prop in heading) {
    if (heading.hasOwnProperty(prop)) {
      const innerObj = {};
      innerObj.key = `Number of ${prop}`;
      innerObj.value = heading[prop];
      headingsArray.push(innerObj);
    }
  }
  return headingsArray;
}

const checkLogin = ($) => {
  const pattern = new RegExp('Login', 'gi');
  const match = $('body').text().match(pattern);
  let loginForm = false;

  // checks for form, input type 'password, and 'login' keyword regex
  if ($('form').length > 0 && $('form input[type="password"]').length > 0 && match && match.length > 0) {
    loginForm = 'Present';
  } else {
    loginForm = 'Not present';
  }

  return { key: 'Login Form Present', value: loginForm };
}

app.post('/api/website', (req, res) => {
  let website = req.body.website;

  // check for dtd websites
  if (website.endsWith('dtd')) {
    website = website.substring(0, website.length - 4);
  }

  request(website, (err, resp, html) => {
    if (!err) {
      const result = [];

      // load html into cheerio
      const $ = cheerio.load(html);

      // html version
      result.push(getVersion($));

      // get title
      result.push(getTitle($));

      // check links
      let linksArray = getLinks($);
      linksArray.forEach((link) => {
        result.push(link);
      });

      // get headings
      let headingsArray = getHeadings($);
      headingsArray.forEach((heading) => {
        result.push(heading);
      });

      // check login form
      result.push(checkLogin($));

      res.send(result);
    } else {
      res.send([]);
    }
  });
});

app.listen(8080, () => console.log('Listening on port 8080!'));
