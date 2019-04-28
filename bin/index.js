const BASE_GISTS_URL = 'https://api.github.com/users/codeartery/gists';

// allows async document.write script calls
document.write = (html) => {
  document.querySelector(
    "script[src='" + document.currentScript.src + "']"
  ).parentNode.innerHTML += html;
};

function copyToClipboard( event, text ) {
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
request.open('GET', BASE_GISTS_URL, true);
request.onload = function () {
  var data = JSON.parse(this.response);  
  const eParent = document.getElementById("g-parent");
  var gitId, gitName, gitDesc;
  var eDiv1, eDiv2, eScript;
  data.forEach(snip => {
    gitId = snip.id;
    gitDesc = snip.description;
    gitName = Object.keys(snip.files)[0];
    
    // only display gist if its language matches the current page
    if ( location.pathname.includes(gitName.slice(gitName.lastIndexOf('.')+1)) ) {          
      // create collapsible gist entry
      eDiv1 = document.createElement('div');
      eDiv1.className = 'g-child';
      eDiv3 = document.createElement('div');
      eDiv3.className = 'collapsible';
      eDiv3.innerHTML = '<h3>' + gitName + '</h3><img src="../bin/copy.svg" alt="Copy the code to your clipboard." title="Copy" style="top:10px" class="g-image" onclick="copyToClipboard(event, this.parentElement.parentElement.querySelector(\'.content .file table\').innerText)" /><div>' + gitDesc + '<img src="../bin/unfold-more.svg" title="Show/hide code" style="bottom:10px" class="collapse-indicator g-image"/></div>';
      eDiv2 = document.createElement('div');
      eDiv2.className = 'content';
      eScript = document.createElement('script');
      eScript.src = 'https://gist.github.com/codeartery/' + gitId + '.js';
      eDiv2.appendChild(eScript);
      eDiv1.appendChild(eDiv3);
      eDiv1.appendChild(eDiv2);
      eParent.appendChild(eDiv1);
    }//if/

  });//forEach/

  addListeners();

};//onload/

request.send();

function addListeners() {
  const collapseButtons = document.getElementsByClassName('collapsible');
  for (let i = 0; i < collapseButtons.length; i++) {
    collapseButtons[i].addEventListener('click', function () {
      // collapse all other  items
      var self = this;
      document.querySelectorAll('.collapsible').forEach((elem) => {
        if ( self != elem ) {
          elem.classList.remove('active')
          elem.nextElementSibling.style.display = 'none';
          elem.querySelector('.collapse-indicator').setAttribute('src' ,'../bin/unfold-more.svg');
        }
      });
      
      // collapse/expand current item
      this.classList.toggle('active');
      if ( this.classList.contains('active') ) {
        this.querySelector('.collapse-indicator').setAttribute('src', '../bin/unfold-less.svg');
      }
      else {
        this.querySelector('.collapse-indicator').setAttribute('src' ,'../bin/unfold-more.svg');
      }       
      let content = this.nextElementSibling;
      if (content.style.display === 'block') {
        content.style.display = 'none';
      }
      else {
        content.style.display = 'block';
      }

      this.scrollIntoView(true)
    })//addEventListener/
  }//for/
}//addListeners/