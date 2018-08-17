const request = require('request');
const cheerio = require('cheerio');
const http = require('http');
const URL = require('url');

const getVersion = ($) => {
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

  $(links).each((i, link) => {
    const checkLink = `${$(link).attr('href')}`;
    // check for external links with http keyword
    if (checkLink.startsWith('http')) {
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

const asyncInaccessibleCheck = (url) => {
  return new Promise((resolve, reject) => {
    try {
      let options = {
        method: 'HEAD',
        host: URL.parse(url).host,
        path: URL.parse(url).pathname
      };

      req = http.request(options, function(r) {
        let statusCode = JSON.stringify(r.statusCode);
        if (statusCode > 400) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      });
      req.on('error', (err) => {
        return resolve(false);        
      })
      req.end();
    } catch (e) {
      return resolve(false);
    }
  });
}

const getInaccessibleLinks = ($) => {
  const links = $('a');
  const promises = [];
  $(links).each((i, link) => {
    let checkLink = `${$(link).attr('href')}`;
    if (checkLink.startsWith('http')) {
      promises.push(asyncInaccessibleCheck(checkLink));
    }
  });
  return Promise.all(promises);
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

const analyseWebsite = (req, res) => {
  return new Promise((resolve, reject) => {
    let website = req.body.website;
  
    // check for dtd websites
    if (website.endsWith('dtd')) {
      website = website.substring(0, website.length - 4);
    }
    try {
      request(website, (err, resp, html) => {
        if (!err) {
          const result = [];

          result.push({ key: 'Status Code', value: resp.statusCode });
    
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
          
          // get inaccessible links
          getInaccessibleLinks($).then((data) => {
            let inaccessibleCount = 0;
            data.forEach((access) => {
              if (!access) {
                inaccessibleCount++;
              }
            });
            result.push({ key: 'Inaccessible Links', value: inaccessibleCount });
            return resolve(result);
          });
        } else {
          return reject([]);
        }
      });
    } catch (e) {
      return reject([]);
    }
  });
}

module.exports = {
  analyseWebsite
}