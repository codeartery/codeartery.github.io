const uriBaseApi = 'https://api.github.com/users/codeartery/gists';
const uriBaseGist = 'https://gist.github.com/codeartery/';

const extToLang = {
    'js': 'JavaScript (.js)',
    'vbs': 'VBScript (.vbs)',
    'ps1': 'PowerShell (.ps1)'
}

// allows async document.write script calls
document.write = (html) => {
    document.querySelector(
        "script[src='" + document.currentScript.src + "']"
    ).parentNode.innerHTML += html;
};

function copyToClipboard(event, text) {
    // prevent div from collapsing or expanding
    event.stopPropagation();

    // get rid of extra lines and spaces in code
    text = text.replace(/(^\s*$\s)|(^\s{8})/gm, '');
    var textarea = document.createElement('textarea');
    textarea.id = 'temp_element';
    textarea.style.height = 0;
    document.body.appendChild(textarea);
    textarea.value = text;
    var selector = document.querySelector('#temp_element');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

var request = new XMLHttpRequest();
request.open('GET', uriBaseApi, true);
request.onload = function () {

    // set language for page
    var libraryLang = /library\/(\w+)/.exec(location.pathname)[1];
    document.title = 'CodeArtery - Library.' + libraryLang;
    document.getElementById('libraryLang').innerText = extToLang[libraryLang];

    var data = JSON.parse(this.response);
    const eParent = document.getElementById("g-parent");
    var gitId, gitName, gitDesc;
    var eDiv1, eDiv2, eScript;
    data.forEach(snip => {
        gitId = snip.id;
        gitDesc = snip.description;
        gitName = Object.keys(snip.files)[0];

        // only display gist if its language matches the current page
        if (libraryLang == gitName.slice(gitName.lastIndexOf('.') + 1)) {
            // create collapsible gist entry
            eDiv1 = document.createElement('div');
            eDiv1.className = 'g-child';
            eDiv3 = document.createElement('div');
            eDiv3.className = 'collapsible';
            eDiv3.innerHTML = `
                <div class="g-title">${gitName}</div>
                <span class="material-icons g-icons" title="Copy code." style="top:15px" onclick="copyToClipboard(event, this.parentElement.parentElement.querySelector('.content .file table').innerText)">content_copy</span>
                <span class="material-icons g-icons" title="Show/hide code." style="bottom:15px">code</span>
                <div>${gitDesc}</div>`;
            eDiv2 = document.createElement('div');
            eDiv2.className = 'content';
            eScript = document.createElement('script');
            eScript.src = uriBaseGist + gitId + '.js';
            eDiv2.appendChild(eScript);
            eDiv1.appendChild(eDiv3);
            eDiv1.appendChild(eDiv2);
            eParent.appendChild(eDiv1);
        } //if/

    }); //forEach/

    addListeners();

}; //onload/

request.send();

function addListeners() {
    const collapseButtons = document.getElementsByClassName('collapsible');
    for (let i = 0; i < collapseButtons.length; i++) {
        collapseButtons[i].addEventListener('click', function () {
            // collapse all other  items
            var self = this;
            document.querySelectorAll('.collapsible').forEach((elem) => {
                if (self != elem) {
                    elem.classList.remove('active')
                    elem.nextElementSibling.style.display = 'none';
                    elem.querySelector('.g-icons').classList.remove('md-light');
                }
            });

            // collapse/expand current item
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.querySelector('.g-icons').classList.add('md-light');
            } else {
                this.querySelector('.g-icons').classList.remove('md-light');
            }
            let content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
                this.scrollIntoView(true)
            }

        }) //addEventListener/
    } //for/
} //addListeners/