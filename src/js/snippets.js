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
    self.parentElement.parentElement.querySelectorAll('.g-content .file table td:nth-child(2)').forEach(td => lines.push(td.innerText));    
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
    Toastify({
        text: "Source code copied to clipboard.",
        duration: 2000,
        gravity: "top",
        position: 'right',
    }).showToast();
}

function addListeners() {
    const collapseButtons = document.getElementsByClassName('g-card');
    for (let i = 0; i < collapseButtons.length; i++) {
        collapseButtons[i].addEventListener('click', function () {
            // collapse all other  items
            var self = this;
            document.querySelectorAll('.g-card').forEach((elem) => {
                if (self != elem) {
                    elem.classList.remove('g-active')
                    elem.nextElementSibling.style.display = 'none';
                }
            });

            // collapse/expand current item
            this.classList.toggle('g-active');
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


var request = new XMLHttpRequest();
request.open('GET', uriBaseApi, true);
request.onload = function () {

    // set language for page
    var snippetLang = /snippets\/(\w+)/.exec(location.pathname)[1];
    document.title = 'CodeArtery - Snippet.' + snippetLang;
    document.getElementById('snippetLang').innerText = extToLang[snippetLang];

    var data = JSON.parse(this.response);
    const eParent = document.getElementById('g-parent');
    const eTemplate = document.querySelector('template');

    data.forEach(snip => {
        var gitId = snip.id;
        var gitDesc = snip.description;
        var gitName = Object.keys(snip.files)[0];

        // only display gist if its language matches the current page
        if (snippetLang == gitName.slice(gitName.lastIndexOf('.') + 1)) {
            
            // create collapsible gist entry from template
            var eContent = eTemplate.content.cloneNode(true);
            eContent.querySelector('.g-title').innerText = gitName;
            eContent.querySelector('.g-desc').innerText = gitDesc;
            eContent.querySelector('.g-script').src = uriBaseGist + gitId + '.js';
            eParent.appendChild(eContent);
            
        } //if/

    }); //forEach/

    addListeners();

}; //onload/

request.send();
