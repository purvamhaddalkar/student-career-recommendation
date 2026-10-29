const initialCareers = [
  {name:'Software Developer', domain:'Software Development', qualification:'BSc Computer Science', skills:'python, java, c++, sql, problem solving, oop', interests:'programming, software development, problem solving', description:'Builds and maintains software applications.'},
  {name:'Web Developer', domain:'Web Development', qualification:'BSc Computer Science', skills:'html, css, javascript, python, sql', interests:'web design, programming, creative design', description:'Creates websites and web applications.'},
  {name:'Data Analyst', domain:'Data Analytics', qualification:'BSc Computer Science', skills:'python, sql, excel, statistics, data visualization', interests:'mathematics, data analysis, research', description:'Analyzes data and prepares useful reports.'},
  {name:'Cybersecurity Analyst', domain:'Cybersecurity', qualification:'BSc Computer Science', skills:'networking, linux, security, python, ethical hacking', interests:'security, networking, problem solving', description:'Protects systems and networks from security threats.'},
  {name:'Database Administrator', domain:'Database Management', qualification:'BSc Computer Science', skills:'sql, dbms, mysql, oracle, backup', interests:'databases, data management, problem solving', description:'Manages, secures and maintains databases.'},
  {name:'Cloud Engineer', domain:'Cloud Computing', qualification:'BSc Computer Science', skills:'cloud, linux, networking, python, devops', interests:'cloud computing, networking, automation', description:'Designs and manages cloud infrastructure.'},
  {name:'UI UX Designer', domain:'Design', qualification:'Any Graduate', skills:'figma, wireframing, prototyping, design, communication', interests:'design, creativity, user experience', description:'Designs simple and useful digital product interfaces.'},
  {name:'AI ML Engineer', domain:'Artificial Intelligence', qualification:'BSc Computer Science', skills:'python, machine learning, statistics, mathematics, data structures', interests:'artificial intelligence, mathematics, research', description:'Builds intelligent systems using data and machine learning.'}
];
let careers = JSON.parse(localStorage.getItem('careerData') || 'null') || initialCareers;
const toSet = value => new Set((value || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
const save = () => localStorage.setItem('careerData', JSON.stringify(careers));

document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.tab,.panel').forEach(x => x.classList.remove('active'));
  button.classList.add('active'); document.getElementById(button.dataset.tab).classList.add('active');
}));
document.getElementById('profileForm').addEventListener('submit', event => {
  event.preventDefault();
  const skills = toSet(document.getElementById('skills').value), interests = toSet(document.getElementById('interests').value);
  const preference = document.getElementById('preference').value.toLowerCase(), education = document.getElementById('education').value.toLowerCase();
  const matches = careers.map(c => {
    const need = toSet(c.skills), wanted = toSet(c.interests);
    const skillScore = 40 * [...skills].filter(x => need.has(x)).length / Math.max(1, need.size);
    const interestScore = 30 * [...interests].filter(x => wanted.has(x)).length / Math.max(1, wanted.size);
    const educationScore = (!c.qualification || c.qualification.toLowerCase().includes('any') || c.qualification.toLowerCase().split(' ').some(x => education.includes(x))) ? 20 : 10;
    const preferenceScore = preference && (c.name.toLowerCase().includes(preference) || c.domain.toLowerCase().includes(preference)) ? 10 : 0;
    return {...c, score: Math.round((skillScore + interestScore + educationScore + preferenceScore) * 10) / 10, missing:[...need].filter(x => !skills.has(x)).join(', ') || 'No major skill gap'};
  }).sort((a,b) => b.score-a.score).slice(0,5);
  const body = document.querySelector('#resultTable tbody'); body.innerHTML = matches.map((m,i) => {
    const level=m.score>=80?'Highly Suitable':m.score>=60?'Suitable':m.score>=40?'Moderately Suitable':'Low Match';
    return `<tr><td>${i+1}</td><td>${m.name}</td><td>${m.score}/100</td><td class="${m.score<40?'low':'badge'}">${level}</td><td>${m.missing}</td><td>${m.description}</td></tr>`;
  }).join('');
  document.getElementById('emptyResult').hidden=true; document.getElementById('resultTable').hidden=false; document.querySelector('[data-tab="results"]').click();
});
function renderCareers(){ document.getElementById('careerRows').innerHTML = careers.map((c,i)=>`<tr><td>${c.name}</td><td>${c.domain}</td><td>${c.skills}</td><td><button class="delete" onclick="removeCareer(${i})">Delete</button></td></tr>`).join(''); }
function removeCareer(i){ careers.splice(i,1); save(); renderCareers(); }
document.getElementById('careerForm').addEventListener('submit', e=>{ e.preventDefault(); const id=x=>document.getElementById(x).value.trim(); careers.push({name:id('careerName'),domain:id('domain'),qualification:id('qualification'),skills:id('careerSkills'),interests:id('careerInterests'),description:id('description')}); save(); e.target.reset(); renderCareers(); alert('Career saved successfully.'); });
renderCareers();
