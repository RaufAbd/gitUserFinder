let userData = [];
let input = document.querySelector('.search-input');
let btn = document.querySelector('button');
let form = document.querySelector('form')

let mainPage = document.querySelector('.mainpage');
let userPage = document.createElement('div');
let repositories = document.createElement('div');
let reposHeader = document.createElement('h2');
let reposCount = document.createElement('span');
let reposContainer = document.createElement('div');

userPage.classList.add('user-page', 'flex-column')
repositories.classList.add('repositories');
reposContainer.classList.add('repos-container');
reposHeader.innerText = `Repositories - `;


function removeEl(selector) {
    mainPage.removeChild(document.querySelector(selector))
}

function mainPageFindChild(child) {
    return [...mainPage.children].find(el => el == document.querySelector(child))
}

function loadingPageCreator() {
    let loadingPageEl = document.createElement('div');
    let loadingEl = document.createElement('div');
    let loadingText = document.createElement('h1');

        loadingPageEl.classList.add('loading-page')
        loadingEl.classList.add('loading');
        loadingText.innerText = 'Please wait';

        loadingEl.append(loadingText);
        loadingPageEl.append(loadingEl);

    mainPage.append(loadingPageEl);
}

function alertValue(value) {
    let alertBox = document.createElement('div');
    let alerText = document.createElement('p');

        alertBox.classList.add('alert');
        alerText.innerText = `${value} is not found in users list`;

        alertBox.append(alerText);

    mainPage.append(alertBox)
}

function loading(active) {
        if(active) loadingPageCreator() 
        else removeEl(`.loading-page`);
}

async function success(obj, repos) {
        if(mainPageFindChild('.user-page')) {
            removeEl('.user-page');
            reposContainer.innerHTML = '';
            repositories.innerHTML = '';
            userPage.innerHTML = '';
        }

        return new Promise(resolve => resolve(obj, repos))
        .then(() => {
            userBiography(obj);
            repos.forEach(repo => userRepositories(repo, repos.length))
        })
        .then(() => mainPage.append(userPage))
        .then(() => setTimeout(() => loading(false), 500))
}

function badResult(value) {
            new Promise(resolve => resolve())
            .then(() => setTimeout(() => loading(false), 1500))
            .then(() => setTimeout(() => alertValue(value), 1800))
            .then(() => setTimeout(() => removeEl('.alert'), 5000))
}

function userBiography(user) {
    let userBio = document.createElement('div');
    let bio = document.createElement('div');
    let avatar = document.createElement('img');
    let loginHead = document.createElement('h2');
    let statistic = document.createElement('div');
    let followersTab = document.createElement('div');
    let followingTab = document.createElement('div');
    let followersHead = document.createElement('h3');
    let followingHead = document.createElement('h3');
    let count1 = document.createElement('p');
    let count2 = document.createElement('p');
    let userProfile = document.createElement('a')
    
    count1.innerText = `${user.followers}`;
    count2.innerText = `${user.following}`;
    followersHead.innerText = 'Followers'; 
    followingHead.innerText = 'Following';
    loginHead.innerText = `${user.login}`;
    avatar.src = user.avatar_url;
    userProfile.href = user.html_url
    
    userProfile.classList.add('user-login')
    followersTab.classList.add('follows-box', 'flex-column');
    followingTab.classList.add('follows-box', 'flex-column');
    statistic.classList.add('statistic');
    bio.classList.add('bio', 'flex-column');
    avatar.classList.add('avatar');
    userBio.classList.add('user-bio');
    
    userProfile.append(loginHead);
    followersTab.append(followersHead, count1);
    followingTab.append(followingHead, count2);
    statistic.append(followersTab, followingTab);
    bio.append(userProfile, statistic);
    userBio.append(avatar, bio);
    userPage.append(userBio);
    
}

function userRepositories(repo, repoCount) {
    let repoBox = document.createElement('div');
    let repoName = document.createElement('a');
    let publickMark = document.createElement('p');
    let repoDescription = document.createElement('p');
    let language = document.createElement('p');
    
    
    repoBox.classList.add('repos-box');
    publickMark.classList.add('public-mark');
    repoDescription.classList.add('repo-description');
    language.classList.add('languages');
    
    repoName.href = repo.html_url;
    repoName.innerText = repo.name;
    repoDescription.innerText = repo.description;
    language.innerText = repo.language;
    reposCount.innerText = repoCount;
    
    (!repo.private) ? publickMark.innerText = 'Public' : publickMark.innerText = 'Private';
    
    repoBox.append(repoName, publickMark, repoDescription);
    if(repo.language) repoBox.append(language);
    reposContainer.append(repoBox);
    reposHeader.append(reposCount)
    repositories.append(reposHeader, reposContainer);
    userPage.append(repositories)
}

window.addEventListener('DOMContentLoaded', () => {
    input.focus();
    
    let find = JSON.parse(localStorage.getItem('users'))?.at(-1);
    // console.log(find)
    
    
    // if(find) {
    //     setTimeout(() => userBiography(find),5000)
    // }
}) 

async function requestToServer(url) {
    let request = await fetch(url);
    let response = request.json();  
    return response
}



form.onsubmit = async (e) => {
    e.preventDefault();
    loading(true);

    let value = input.value;
    let userAPI_url = `https://api.github.com/users/${value}`;
    let user = userData.find(user => user.login.toLowerCase() == value.toLowerCase());

    if(user) success(user, await requestToServer(user.repos_url));
    else {
        let response = await requestToServer(userAPI_url);
        console.log(user)
 
        if(response.message !== 'Not Found'){
            let repos = await requestToServer(`${response.repos_url}`)

            userData.push(response);

            success(response, repos);
            // localStorage.setItem('users', JSON.stringify(userData));

       } else badResult(value)
    }
   
   e.target.reset()
   input.focus()
   console.log(userData)
}

