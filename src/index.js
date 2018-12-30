// allows async document.write script calls
document.write = (html) => {
  document.querySelector(
    "script[src='" + document.currentScript.src + "']"
  ).parentNode.innerHTML += html;
};

var request = new XMLHttpRequest()
request.open('GET', 'https://api.github.com/users/codeartery/gists', true)
request.onload = function () {
  var data = JSON.parse(this.response)
  // TODO: only add languages related to page
  const eParent = document.getElementById("g-parent")
  var gitId, gitName, gitDesc
  var eDiv1, eDiv2,eButton, eScript
  data.forEach(snip => {
    gitId = snip.id
    gitDesc = snip.description
    gitName = Object.keys(snip.files)[0]
    // create html    
    eDiv1 = document.createElement('div')
    eDiv1.className = 'g-child'
    eDiv3 = document.createElement('div')
    eDiv3.className = 'collapsible'
    eDiv3.innerHTML = '<h3>' + gitName + '</h3><div>' + gitDesc + '<div class="collapse-indicator">▼</div></div>'
    eDiv2 = document.createElement('div')
    eDiv2.className = 'content'
    eScript = document.createElement('script')
    eScript.src = 'https://gist.github.com/codeartery/' + gitId + '.js'
    eDiv2.appendChild(eScript)
    eDiv1.appendChild(eDiv3)
    eDiv1.appendChild(eDiv2)
    eParent.appendChild(eDiv1)
  })

  addListeners()
};
request.send()

function addListeners() {
  const collapseButtons = document.getElementsByClassName('collapsible')
  for (let i = 0; i < collapseButtons.length; i++) {
    collapseButtons[i].addEventListener('click', function () {
      this.classList.toggle('active')
      if ( this.classList.contains('active') ) {
        this.querySelector('.collapse-indicator').innerHTML = '▲'
      }
      else {
        this.querySelector('.collapse-indicator').innerHTML = '▼'
      }            
      let content = this.nextElementSibling
      if (content.style.display === 'block') {
        content.style.display = 'none'
      }
      else {
        content.style.display = 'block'
      }
    })//addEventListener/
  }//for/
}//addListeners/