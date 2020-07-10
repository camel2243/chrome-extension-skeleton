/* global chrome */

function queryES() {
  const data = JSON.stringify({ from: 0, size: 20, query: { bool: { should: [{ nested: { path: 'educations', query: { bool: { should: [{ match: { 'educations.department': { query: '台灣大學', boost: 1.4 } } }, { match: { 'educations.department': { query: '台灣大學', operator: 'AND', boost: 2 } } }, { match: { 'educations.school': { query: '台灣大學', boost: 1.4 } } }, { match: { 'educations.school': { query: '台灣大學', operator: 'AND', boost: 2 } } }] } } } }, { nested: { path: 'experiences', query: { bool: { should: [{ match: { 'experiences.title': { query: '台灣大學', boost: 1.4 } } }, { match: { 'experiences.title': { query: '台灣大學', operator: 'AND', boost: 2 } } }, { match: { 'experiences.company': { query: '台灣大學', boost: 1.4 } } }, { match: { 'experiences.company': { query: '台灣大學', operator: 'AND', boost: 2 } } }, { match: { 'experiences.content': { query: '台灣大學', boost: 1 } } }, { match: { 'experiences.content': { query: '台灣大學', operator: 'AND', boost: 1 } } }] } } } }, { nested: { path: 'languages', query: { bool: { should: [{ match: { 'languages.name': { query: '台灣大學', boost: 1.4 } } }, { match: { 'languages.name': { query: '台灣大學', operator: 'AND', boost: 2 } } }, { match: { 'languages.degree': { query: '台灣大學', boost: 1.4 } } }, { match: { 'languages.degree': { query: '台灣大學', operator: 'AND', boost: 2 } } }] } } } }, { nested: { path: 'skills', query: { bool: { should: [{ match: { 'skills.name': { query: '台灣大學', boost: 1.4 } } }, { match: { 'skills.name': { query: '台灣大學', operator: 'AND', boost: 2 } } }, { match: { 'skills.content': { query: '台灣大學', boost: 1 } } }, { match: { 'skills.content': { query: '台灣大學', operator: 'AND', boost: 1 } } }] } } } }, { match: { 'information.name': { query: '台灣大學', boost: 1.4 } } }, { match: { 'information.name': { query: '台灣大學', operator: 'AND', boost: 2 } } }, { match: { summary: { query: '台灣大學', boost: 1 } } }, { match: { summary: { query: '台灣大學', operator: 'AND', boost: 1 } } }] } }, highlight: { pre_tags: ['<tag1>'], post_tags: ['</tag1>'], fragment_size: 100, number_of_fragments: 2, fields: { '*': { fragment_size: 150, number_of_fragments: 3 } } } });

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.responseText);
      console.log(response);
      document.querySelector('#info').insertAdjacentHTML('beforeend', response.hits.hits.reduce((acc, record) => `${acc}<fieldset>
        <legend>${record._source.id}</legend>
        <table>
          ${record._source.skills.reduce((html, skill) => `${html}<tr><td>skill</td><td>${skill.name}, ${skill.content}</td></tr>`, '')}
        </table>
        <table>
          ${record._source.experiences.reduce((html, experience) => `${html}<tr><td>exp</td><td>${experience.title}, ${experience.content}</td></tr>`, '')}
        </table>
      </fieldset>`, '<h3>推薦人才:</h3>'));
    }
  });

  xhr.open('GET', 'https://li2009-165.members.linode.com:9200/admin_resumes/_search');
  xhr.setRequestHeader('Authorization', `${Authentication}`);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(data);
}

// receive title, job tags, skill tags from content script
chrome.storage.local.get({ title: '', jobTags: [], skillTags: [] }, (info) => {
  const { title, jobTags, skillTags } = info;

  document.querySelector('#info').style.display = 'block';
  document.querySelector('h2').innerHTML = title;
  document.querySelector('#jobTags').innerHTML = jobTags.join(', ');
  document.querySelector('#skillTags').innerHTML = skillTags.join(', ');

  queryES();
});
