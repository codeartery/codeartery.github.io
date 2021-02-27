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

function copyToClipboard(event, self) {
    // prevent div from collapsing or expanding
    event.stopPropagation();

    // get text
    var lines = [];
    self.parentElement.parentElement.querySelectorAll('.content .file table td:nth-child(2)').forEach(td => lines.push(td.innerText));    
    var text = lines.join('\r\n');
    
    // copy to clipboard
    var textarea = document.createElement('textarea');
    textarea.id = 'temp_element';
    textarea.style.height = 0;
    document.body.appendChild(textarea);
    textarea.value = text;
    var selector = document.querySelector('#temp_element');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // alert user
    $.notify({message:'Source code copied to clipboard.'}, {type:'primary'});
}

var request = new XMLHttpRequest();
request.open('GET', uriBaseApi, true);
request.onload = function () {

    // set language for page
    var libraryLang = /library\/(\w+)/.exec(location.pathname)[1];
    document.title = 'CodeArtery - Library.' + libraryLang;
    document.getElementById('libraryLang').innerText = extToLang[libraryLang];

    var data = JSON.parse(this.response);
    const eParent = document.getElementById('g-parent');
    const eTemplate = document.querySelector('template');
    var gitId, gitName, gitDesc;
    var eDiv1, eDiv2, eScript;
    data.forEach(snip => {
        gitId = snip.id;
        gitDesc = snip.description;
        gitName = Object.keys(snip.files)[0];

        // only display gist if its language matches the current page
        if (libraryLang == gitName.slice(gitName.lastIndexOf('.') + 1)) {
            // create collapsible gist entry
            
            var eContent = eTemplate.content.cloneNode(true);
            eContent.querySelector('.g-title').innerText = gitName;
            eContent.querySelector('.g-desc').innerText = gitDesc;
            eContent.querySelector('.g-script').src = uriBaseGist + gitId + '.js';
            eParent.appendChild(eContent);
            
            /*
            eDiv1 = document.createElement('div');
            eDiv1.className = 'g-child';
            eDiv3 = document.createElement('div');
            eDiv3.className = 'collapsible';
            eDiv3.innerHTML = `
                <div class="g-title">${gitName}</div>
                <span class="material-icons g-icons" title="Copy code." style="top:15px" onclick="copyToClipboard(event, this)">content_copy</span>
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
            */
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
                    elem.classList.remove('g-active')
                    elem.nextElementSibling.style.display = 'none';
                    elem.querySelector('.g-icons').classList.remove('md-light');
                }
            });

            // collapse/expand current item
            this.classList.toggle('g-active');
            if (this.classList.contains('g-active')) {
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
