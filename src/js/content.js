/* global chrome */
const jobTags = [].map.call(document.querySelectorAll('.basic-info__tag .tag[href^="/jobs?tag"]'), el => el.innerText);
const skillTags = [].map.call(document.querySelectorAll('.basic-info__tag .tag[href^="/jobs?skillTag"]'), el => el.innerText);
const title = document.querySelector('.basic-info h1').innerText;

chrome.storage.local.set({ title, jobTags, skillTags });
