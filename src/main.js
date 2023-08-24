import "./main.scss"

// une variable qui stocke l'offset des emojiGroups pour pagination
let emojiGroupsOffset = 0

const quoteBtn = document.querySelector("#quoteBtn")

/**
 * fonction qui choisi une couleur de fond au hasard, et qui va chercher une citation
 */
function getQuote() {
  getQuoteBackground()
  getQuoteContent()
}

function getQuoteBackground(){
  quoteBloc.style.backgroundColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function getQuoteContent() {
  
  document.querySelector("#quoteContent").style.visibility = "hidden";
  document.querySelector("#quoteLoader").style.display = "inline";

  let category = document.querySelector("#quoteCategory").value
  if(category !== "") {
    category = "?category="+category
  }

  fetch("https://api.api-ninjas.com/v1/quotes"+category, { headers: {"X-Api-Key":"2Dst7djyWZH/iSyUenkgOw==rRyQbQZw2NyxaWI3"}})
  .then(response => {
    if(response.status === 200) return response.text()
  })
  .then(data => { 
    if(data) {  
      //console.log(JSON.parse(data))
      quoteLine.innerHTML = `"${JSON.parse(data)[0].quote}"`
      quoteAuthor.href = `https://fr.wikipedia.org/wiki/${JSON.parse(data)[0].author}`
      quoteAuthor.innerHTML = JSON.parse(data)[0].author
      quoteAuthor.target = "_blank"

      document.querySelector("#emojis").innerHTML = ""
      
      document.querySelector("#quoteLoader").style.display = "none";
      document.querySelector("#quoteContent").style.visibility = "visible";
    }
    else quote.innerHTML = ""
  })
  .catch((error) => {
    console.log(error)
  })
  
}

/**
 * fonction qui retourne un element TD pour l'emoji à afficher dans la table à gauche, et qui créé l'émoji 
 * sous la citation
 * @param {*} element 
 * @param {*} key 
 * @returns un element TD
 */
function createEmojiTD(element, key){
  const tdEmojiForTable = document.createElement("td")
  tdEmojiForTable.className = "clickable"
  tdEmojiForTable.id = `emoji${key}`

  const character = document.createTextNode(element.character);
  tdEmojiForTable.appendChild(character);

  tdEmojiForTable.addEventListener('click', function(){

    console.log(`${element.character}`)
    
    const tdEmojeed = document.createElement("td")
    tdEmojeed.className = "clickable"
    tdEmojeed.id = `emojeed${key}`
    const newCharacter = document.createTextNode(element.character);
    tdEmojeed.appendChild(newCharacter)

    tdEmojeed.addEventListener('click', function(){
      document.querySelector("#emojis").removeChild(tdEmojeed)
    })

    document.querySelector("#emojis").appendChild(tdEmojeed)

  })
  return tdEmojiForTable
}

/**
 * fonction qui va chercher les emojis d'un groupe et les insère dans un tableau de 5*6
 */
function getEmojiContentByGroup(offset = 0) {

  console.log(offset)

  let emojiGroupSelect= document.querySelector("#emojiGroupSelect").value
  if(emojiGroupSelect!== "") {
    emojiGroupSelect= "?group="+emojiGroupSelect+"&offset="+offset.toString()
  }

  fetch("https://api.api-ninjas.com/v1/emoji"+emojiGroupSelect, { headers: {"X-Api-Key":"2Dst7djyWZH/iSyUenkgOw==rRyQbQZw2NyxaWI3"}})
  .then(response => {
    if(response.status === 200) return response.text()
  })
  .then(data => { 
    if(data) { 

      const tableData = JSON.parse(data) 
      //console.log(tableData)

      emojiList.innerHTML = ""
      const tbody = document.createElement("tbody")
      const tr = document.createElement("tr")      
      const tr2 = document.createElement("tr")
      const tr3 = document.createElement("tr")
      const tr4 = document.createElement("tr")
      const tr5 = document.createElement("tr")
      const tr6 = document.createElement("tr")

      tableData.forEach((element, key) => {
        if(key < 5)          
          tr.appendChild(createEmojiTD(element, key))                               
        else if(key < 10)        
          tr2.appendChild(createEmojiTD(element, key))        
        else if(key < 15)
          tr3.appendChild(createEmojiTD(element, key))
        else if(key < 20)
          tr4.appendChild(createEmojiTD(element, key))   
        else if(key < 25)
          tr5.appendChild(createEmojiTD(element, key))
        else 
          tr6.appendChild(createEmojiTD(element, key))
      })

      tbody.appendChild(tr)
      tbody.appendChild(tr2)
      tbody.appendChild(tr3)
      tbody.appendChild(tr4)
      tbody.appendChild(tr5)
      tbody.appendChild(tr6)
      emojiList.appendChild(tbody)

    }
    else quote.innerHTML = ""
  });
  
}

function getNextEmojiGroup() {
  emojiGroupsOffset += 30
  getEmojiContentByGroup(emojiGroupsOffset)
  precEmojiGroupBtn.style.display = "inline"
  
}
function getPrecEmojiGroup() {
  emojiGroupsOffset -= 30
  getEmojiContentByGroup(emojiGroupsOffset)

  if(emojiGroupsOffset === 0) precEmojiGroupBtn.style.display = "none"
}
function emojiGroupSelectChange() {
  emojiGroupsOffset = 0
  precEmojiGroupBtn.style.display = "none"
  getEmojiContentByGroup()
}
document.addEventListener('DOMContentLoaded', getQuote)
quoteBtn.addEventListener('click', getQuote)

getEmojiContentByGroup()
emojiGroupSelect.addEventListener('change', emojiGroupSelectChange)
precEmojiGroupBtn.addEventListener('click', getPrecEmojiGroup)
nextEmojiGroupBtn.addEventListener('click', getNextEmojiGroup)
