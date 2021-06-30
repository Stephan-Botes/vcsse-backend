const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// GitHub Functions
// Function used to retrieve GitHub user data
async function fetchGithubUser(user) {
  // Attempts to find a user by the provided username.
  // If none found or an error occurs it returns an empty array
  try {
    let userArr = [];
    const api = await fetch(`https://api.github.com/users/${user}`);
    const data = await api.json();

    // Replaces any null values with an empty string, to avoid errors on the frontend
    const username = replaceNullValues(data.name);
    const avatar = replaceNullValues(data.avatar_url);
    const bio = replaceNullValues(data.bio);
    const userpage = replaceNullValues(data.html_url);
    const repolink = replaceNullValues(data.repos_url);

    // Adds the found user information to the user array
    userArr.push({
      username: username,
      avatar: avatar,
      bio: bio,
      userpage: userpage,
      repolink: repolink,
      vcs: 'github'
    })

    // Searches the user's repositories and adds the results to the user array
    const repoArr = await fetchGithubRepos(data.repos_url);
    userArr.push(repoArr);
    return userArr;
  } catch (e) {
    return [];
  }
}

// Function used to retrieve GitHub user's repository information
async function fetchGithubRepos(repolink) {
  let repoArr = [];
  const api = await fetch(repolink);
  const data = await api.json();

  // Finds a repo's: name, description, creation date, last commit date, last 5 commit descriptions
  for (let i = 0; i < 5; i++) {
    if (data[i] !== undefined) {
      const repoName = data[i].name;
      const description = data[i].description;
      const creationDate = data[i].created_at;
      const lastCommitDate = data[i].pushed_at;
      let commitsURL = data[i].commits_url;
      commitsURL = commitsURL.substring(0, commitsURL.length - 6);
      // Searches the repository's commit information to add the latest commit messages
      const commitDescriptions = await fetchGithubCommitDescriptions(commitsURL);

      // Adds the data of each repository to the repoArr
      repoArr.push({
        repoName: repoName,
        repoDescription: description,
        creationDate: creationDate,
        lastCommitDate: lastCommitDate,
        commitDescriptions: commitDescriptions
      })
    }
  }
  return repoArr;
}

// Function that retrieves a GitHub repo's last 5 commit descriptions
async function fetchGithubCommitDescriptions(commitlink) {
  let commitDescriptions = [];
  const api = await fetch(commitlink);
  const data = await api.json();

  // Cycles through the latest 5 commit messages and adds them to the array to be returned
  for (let i = 0; i < 5; i++) {
    if (data[i] !== undefined)
      commitDescriptions.push(data[i].commit.message);
  }
  return commitDescriptions;
}

// GitLab Functions
// Function used to retrieve GitLab user data
async function fetchGitlabUser(user) {
  let id = 0;

  // Attempts to find a user by the provided username to extract an ID for further use
  // If none found or an error occurs it returns an empty array
  try {
    const api = await fetch(`https://gitlab.com/api/v4/users?username=${user}`);
    const data = await api.json();
    id = data[0].id;
  } catch (e) {
    return [];
  }

  // Attempts to find the user information with the provided ID
  // If none found or an error occurs it returns an empty array
  try {
    let userArr = [];
    const api = await fetch(`https://gitlab.com/api/v4/users/${id}`);
    const data = await api.json();

    // Replaces any null values with an empty string, to avoid errors on the frontend
    const username = replaceNullValues(data.name);
    const avatar = replaceNullValues(data.avatar_url);
    const bio = replaceNullValues(data.bio);
    const userpage = replaceNullValues(data.web_url);
    const repolink = replaceNullValues(`https://gitlab.com/api/v4/users/${id}/projects`);

    // Adds the found user information to the user array
    userArr.push({
      username: username,
      avatar: avatar,
      bio: bio,
      userpage: userpage,
      repolink: repolink,
      vcs: 'gitlab'
    })

    // Searches the user's repositories and adds the results to the user array
    const repoArr = await fetchGitlabRepos(userArr[0].repolink);
    userArr.push(repoArr);
    return userArr;
  } catch (e) {
    return [];
  }
}

// Function used to retrieve GitLab user's repository information
async function fetchGitlabRepos(repolink) {
  let repoArr = [];
  const api = await fetch(repolink);
  const data = await api.json();

  // Finds a repo's: id, name, description, creation date, last commit date, last 5 commit descriptions
  for (let i = 0; i < 5; i++) {
    if (data[i] !== undefined) {
      const repoID = data[i].id;
      const repoName = data[i].name;
      const description = data[i].description;
      const creationDate = data[i].created_at;
      const lastCommitDate = data[i].last_activity_at;
      const commitsURL = `https://gitlab.com/api/v4/projects/${repoID}/repository/commits`;
      // Searches the repository's commit information to add the latest commit messages
      const commitDescriptions = await fetchGitlabCommitDescriptions(commitsURL);

      // Adds the data of each repository to the repoArr
      repoArr.push({
        repoName: repoName,
        repoDescription: description,
        creationDate: creationDate,
        lastCommitDate: lastCommitDate,
        commitDescriptions: commitDescriptions
      })
    }
  }
  return repoArr;
}

// Function that retrieves a GitLab repo's last 5 commit descriptions
async function fetchGitlabCommitDescriptions(commitlink) {
  let commitDescriptions = [];
  const api = await fetch(commitlink);
  const data = await api.json();

  // Cycles through the latest 5 commit messages and adds them to the array to be returned
  for (let i = 0; i < 5; i++) {
    if (data[i] !== undefined)
      commitDescriptions.push(data[i].title);
  }
  return commitDescriptions;
}

// BitBucket Functions
// Function used to retrieve BitBucket user data
async function fetchBitbucketUser(user) {
  let id = 0;

  // Attempts to find a user by the provided username to extract an ID for further use
  // If none found or an error occurs it returns an empty array
  try {
    const api = await fetch(`https://api.bitbucket.org/2.0/workspaces/${user}`);
    const data = await api.json();
    id = data.uuid;
  } catch (e) {
    return [];
  }

  // Attempts to find the user information with the provided ID
  // If none found or an error occurs it returns an empty array
  try {
    let userArr = [];
    const api = await fetch(`https://api.bitbucket.org/2.0/users/${id}`);
    const data = await api.json();

    // Replaces any null values with an empty string, to avoid errors on the frontend
    const username = replaceNullValues(data.display_name);
    const avatar = replaceNullValues(data.links.avatar.href);
    const userpage = replaceNullValues(data.links.html.href);
    const repolink = replaceNullValues(data.links.repositories.href);

    // Adds the found user information to the user array
    userArr.push({
      username: username,
      avatar: avatar,
      bio: '',
      userpage: userpage,
      repolink: repolink,
      vcs: 'bitbucket'
    })

    // Searches the user's repositories and adds the results to the user array
    const repoArr = await fetchBitbucketRepos(userArr[0].repolink);
    userArr.push(repoArr);
    return userArr;
  } catch (e) {
    return [];
  }
}

// Function used to retrieve BitBucket user's repository information
async function fetchBitbucketRepos(repolink) {
  let repoArr = [];
  const api = await fetch(repolink);
  const data = await api.json();

  // Finds a repo's: name, description, creation date, last commit date, last 5 commit descriptions
  for (let i = 0; i < 5; i++) {
    if (data.values[i] !== undefined) {
      const repoName = data.values[i].name;
      const description = data.values[i].description;
      const creationDate = data.values[i].created_on;
      const lastCommitDate = data.values[i].updated_on;
      const commitsURL = data.values[i].links.commits.href;
      // Searches the repository's commit information to add the latest commit messages
      const commitDescriptions = await fetchBitbucketCommitDescriptions(commitsURL);

      // Adds the data of each repository to the repoArr
      repoArr.push({
        repoName: repoName,
        repoDescription: description,
        creationDate: creationDate,
        lastCommitDate: lastCommitDate,
        commitDescriptions: commitDescriptions
      })
    }
  }
  return repoArr;
}

// Function that retrieves a BitBucket repo's last 5 commit descriptions
async function fetchBitbucketCommitDescriptions(commitlink) {
  let commitDescriptions = [];
  const api = await fetch(commitlink);
  const data = await api.json();

  // Cycles through the latest 5 commit messages and adds them to the array to be returned
  for (let i = 0; i < 5; i++) {
    if (data.values[i] !== undefined)
      commitDescriptions.push(data.values[i].message);
  }
  return commitDescriptions;
}

// Function used to replace any null fields with an empty string
function replaceNullValues(input) {
  if (input === null)
    return '';
  return input;
}

// GET Route when using async await
router.get('/', async (req, res) => {
  const username = req.query.q;
  const userGithubData = await fetchGithubUser(username);
  const userGitlabData = await fetchGitlabUser(username);
  const userBitbucketData = await fetchBitbucketUser(username);
  const userData = [userGithubData, userGitlabData, userBitbucketData]
  res.send(userData);
})

module.exports = router;

/*
Example of async vs promise implementations with fetch and routes

// Fetch function using promises
function fetchData(user) {
    let arr = [];
    return fetch(`https://api.github.com/users/${user}/repos`)
        .then(res => res.json())
}

// Route when using promises
router.get('/a', (req, res) => {
    const user = fetchGithubUser('Stephan-Botes')
        .then(response => {
                res.send(response);
            }
        )
})

// Fetch function using async await
async function fetchGithubUser(user) {
    let userArr = [];
    const api = await fetch(`https://api.github.com/users/${user}`);
    const data = await api.json();
    return data;
}

// Route when using async await
router.get('/api', async (req, res) => {
    // const user = await fetchGithubUser('Stephan-Botes');
    res.send(repos)
})
 */