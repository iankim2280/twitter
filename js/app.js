const AVATAR_URL = "https://avatars1.githubusercontent.com/u/44171725?v=4";
const main = document.querySelector("main");
const tweetBtn = document.querySelector("form");
const tweet = document.querySelector("#tweet");
const myAvatar = [...document.querySelectorAll(".my_avatar")];
myAvatar.forEach(img => {
  img.src = AVATAR_URL;
});
const imgGifPoll = document.querySelector("#imgGifPoll");
const searchGifBtn = document.querySelector("#searchGifBtn");
const searchGif = document.querySelector("#searchGif");
const browseGifs = document.querySelector("#browsegifs");
const switchGif = document.querySelector("#switchGif");
const pollBtn = document.querySelector('#pollbtn')

const emojibtn = document.querySelector("#emojibtn");
const emojimodalbody = document.querySelector("#emojimodalbody");
const textarea = document.querySelector("#textarea");
const searchEmoji = document.querySelector("#searchEmoji");
const emojiCategories = document.querySelector("#emojiCategories");

let emojis = [];
// Create an empty array called gifs
let gifs = [];
// this will be our text and any images, gifs and polls the user posts
let tweets = [];

// these gifs will be displayed and will be a subset of originalGifs
// (but it's totally up to you how you want to implement it;
// you could for example just use originalGifs alone)

// these gifs are the original JSON we got from our fetch in case we need it
const originalGifs = [];

// this will display all the objects in my tweets array
// where each object contains avatar url, username, name and text
function render() {
  remember();

  main.innerHTML = tweets.map((tweet, idx) => {
    return `
        <aside>
         <div>
            <img class="avatar" src="${tweet.avatar}">
         </div>
         <div class="formatted-tweet">
            <h6><a href="https://twitter.com/${tweet.username}">${tweet.name}</a> <span class="username">@${tweet.username}</span></h6>
            <p>${tweet.tweet}</p>
            <div class="imgGifPoll">
              ${tweet.isPollCreated ? displayVotes(tweet, idx) : tweet.img }
            </div>
            <div>
                <section>
                    <div id="reactions" class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-message-outline"
                            aria-label="reply"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-twitter-retweet"
                            aria-label="retweet"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-heart-outline"
                            aria-label="like"
                            style=""
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-upload"
                            aria-label="share"
                        ></button>
                    </div>
                </section>
            </div>
        </div>
        </aside>
          `;
  }).join('');
}

// tweeting
function tweeting(e) {
  e.preventDefault();
  const voteOptions = {
    a: imgGifPoll.querySelector('#pollchoice1') ? imgGifPoll.querySelector('#pollchoice1').value : '',
    b: imgGifPoll.querySelector('#pollchoice2') ? imgGifPoll.querySelector('#pollchoice2').value : '',
    c: imgGifPoll.querySelector('#pollchoice3') ? imgGifPoll.querySelector('#pollchoice3').value : '',
    d: imgGifPoll.querySelector('#pollchoice4') ? imgGifPoll.querySelector('#pollchoice4').value : '',
  }

  if (textarea) {
    // store tweet text in tweets object
    tweets.unshift({
      avatar: AVATAR_URL,
      name: 'Ian Kim',
      username: 'camelkish1',
      tweet: textarea.value,
      img: imgGifPoll.innerHTML,
      video: '',
      isPollCreated: !!(voteOptions.a && voteOptions.b && voteOptions.c && voteOptions.d),
      voteOptions,
      pollResults: {},
      isPollDone: false
    });

  }

  // clear textbox and any image
  textarea.value = '';
  imgGifPoll.innerHTML = '';

  render();
}

// select image
function handleFileSelect(e) {
  const reader = new FileReader();

  reader.addEventListener('load', (evt) => {
    imgGifPoll.innerHTML = `<img class="thumb" src="${evt.target.result}" style="width: 100%;" />`;
  });

  // Read in the image file as a data URL base64
  reader.readAsDataURL(e.target.files[0]);
}
const input = document.querySelector('#uploadPic');
input.addEventListener('change', handleFileSelect);

// search GIF
async function getGifs() {

  const doubleCheck = searchGif.value;
  if (doubleCheck.length >= 3) {
    const res = await fetch(`https://api.giphy.com/v1/gifs/search?q=${doubleCheck}&api_key=cYUc2Dr22ss8jrMJHnUa0fgbJge7GBsr&limit=12`);

    const data = await res.json();
    gifs = data.data;

    const newImgages = gifs.map((g, i) => `<img src="${g.images.fixed_height_small.url}" data-index="${i}"/>`).join('');
    browseGifs.innerHTML = newImgages;
  } else {
    browseGifs.innerHTML = "";
  }
}

function chooseGif(e) {
  if (!e.target.matches('img')) {
    return
  }
  const index = e.target.dataset.index;
  imgGifPoll.innerHTML = `<img src="${gifs[index].images.original.url}">`
}
browseGifs.addEventListener('click', chooseGif);
searchGif.addEventListener('keyup', getGifs);

// emoji function from lab -4

tweetBtn.addEventListener('submit', tweeting);



// vote - poll from Albert's codes
function remember() {
  // store our current tweets array in localstorage
  // but remove last memory of it first
  localStorage.removeItem('twitter');

  // remember tweets array
  localStorage.setItem('twitter', JSON.stringify(tweets));
}

function getData() {
  tweets = JSON.parse(localStorage.getItem('twitter'));
  if (tweets == null || tweets.length == 0) {
    tweets = [];
  }
  render();
}

function votesToPercentages(votes) {
  const total = votes.a + votes.b + votes.c + votes.d;
  return {
    a: Math.floor((votes.a / total) * 100),
    b: Math.floor((votes.b / total) * 100),
    c: Math.floor((votes.c / total) * 100),
    d: Math.floor((votes.d / total) * 100),
    total
  }
}

function displayVotes(tweet, idx) {
  const percents = votesToPercentages(tweets[idx].pollResults) // {a: 33, b: 20, ,,,, total: 133}
  const letterChosen = tweets[idx].pollResults.youChose; // a b c d 

  if (tweet.isPollDone) {
    return `
    <div class="bargraph">
    <div id="bar1" class="bar" style="flex-basis: ${
      percents.a
    }%" data-vote="a">${tweets[idx].voteOptions.a} ${
    letterChosen == "a" ? "&check;" : ""
  }</div>
    <div id="percentage1">${percents.a}%</div>
  </div>
  <div class="bargraph">
    <div id="bar2" class="bar" style="flex-basis: ${
      percents.b
    }%" data-vote="b">${tweets[idx].voteOptions.b} ${
    letterChosen == "b" ? "&check;" : ""
  }</div>
    <div id="percentage2">${percents.b}%</div>
  </div>
  <div class="bargraph">
    <div id="bar3" class="bar" style="flex-basis: ${
      percents.c
    }%" data-vote="c">${tweets[idx].voteOptions.c} ${
    letterChosen == "c" ? "&check;" : ""
  }</div>
  <div id="percentage3">${percents.c}%</div>
  </div>
  <div class="bargraph">
    <div id="bar4" class="bar" style="flex-basis: ${
      percents.d
    }%" data-vote="d">${tweets[idx].voteOptions.d} ${
    letterChosen == "d" ? "&check;" : ""
  }</div>
  <div id="percentage4">${percents.d}%</div>
  </div>
  <div id="totalVotes">${percents.total} votes</div>    
    `
  }
  return `
  <div class="poll flex-col" data-idx="${idx}">
     <button class="vote" value="a">${tweet.voteOptions.a}</button>
     <button class="vote" value="b">${tweet.voteOptions.b}</button>
     <button class="vote" value="c">${tweet.voteOptions.c}</button>
     <button class="vote" value="d">${tweet.voteOptions.d}</button>
  </div>
  `
}

function insertPoll() {
  // todo: disable the tweet button until all fields plus a question is inserted
  textarea.placeholder = 'Ask a question...';

  imgGifPoll.innerHTML = `
                <form>
                  <div class="form-group">
                    <input type="text" class="form-control" id="pollchoice1" aria-describedby="" maxlength="25" placeholder="Choice 1">
                    <br>
                    <input type="text" class="form-control" id="pollchoice2" aria-describedby="" maxlength="25" placeholder="Choice 2">
                    <br>
                    <input type="text" class="form-control" id="pollchoice3" aria-describedby="" maxlength="25" placeholder="Choice 3">
                    <br>
                    <input type="text" class="form-control" id="pollchoice4" aria-describedby="" maxlength="25" placeholder="Choice 4">
                    <br><br>
                    <h6>Poll length</h6>
                    <hr style="margin:0">
                    <div class="row">
                      <div class="col">
                        <label for="polldays">Days</label>
                        <select class="form-control" id="polldays">
                          <option>0</option>
                          <option selected>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="col">
                        <label for="pollhours">Hours</label>
                        <select class="form-control" id="pollhours">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="col">
                        <label for="pollminutes">Minutes</label>
                        <select class="form-control" id="pollminutes">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>                        
                    </div>
                  </div>
                </form>

  `;
}

async function vote(e) {
  if (!e.target.matches('.vote')) {
    return;
  }

  // find data-idx's value so we know which element in tweets array to change
  const index = e.target.closest('.poll').dataset.idx;

  const res = await fetch('https://my.api.mockaroo.com/votes.json?key=2d95a440')
  const data = await res.json(); // {"a":"05-658-6533","b":"60-026-8075","c":"89-841-5434","d":"65-564-0648"}
  const keyValues = Object.entries(data); // [["a","05-658-6533"], ...]
  const newKeyValues = keyValues.map(keyValArr => [keyValArr[0], parseInt(keyValArr[1].slice(-2), 10)]) // [["a",33], ...]

  // push JSON results into our tweets array
  tweets[index].pollResults = Object.fromEntries(newKeyValues) // {"a":33], ...}
  tweets[index].pollResults.youChose = e.target.value // a b c d
  tweets[index].isPollDone = true;

  render();
}

pollBtn.addEventListener('click', insertPoll);
main.addEventListener('click', vote)

// emojis
// Fetch from  https://unpkg.com/emoji.json@12.1.0/emoji.json to get the list of emojis in JSON format,  then store the data inside your array called emojis.
async function browseEmojis() {
  const res = await fetch(`https://unpkg.com/emoji.json@12.1.0/emoji.json`);
  const data = await res.json();
  emojis = data;

  const getEmoji = emojis
    .map(emoji => `<div class="emoji">${emoji.char}</div>`)
    .join("");
  emojimodalbody.innerHTML = getEmoji;
}

// Your fetch code will live inside an async function called browseGifs, and is called when the emoji icon button is clicked
emojibtn.addEventListener("click", browseEmojis);

// After you fetch the code, display the emojis using:
// .map(emoji => `<div class="emoji">${emoji.char}</div>`)

// When user clicks on an emoji, that emoji gets displayed the textarea box

function chooseEmoji(e) {
  // debugger;
  if (!e.target.className == "emoji") {
    return;
  }
  textarea.value += e.target.textContent;
}
emojimodalbody.addEventListener("click", chooseEmoji);

// If user types in a search term inside #searchEmoji, use a keyup event listener so it runs a function called searchEmojis
function searchEmojis() {
  // debugger;
  const getEmoji = emojis
    .filter(g => g.name.includes(searchEmoji.value))
    .map(emoji => `<div class="emoji">${emoji.char}</div>`)
    .join("");

  emojimodalbody.innerHTML = getEmoji
}
searchEmoji.addEventListener("keyup", searchEmojis);

// Inside searchEmojis, use .filter and .map and .includes to display the relevant emojis

emojiCategories.addEventListener("click", emojiCategory);

function emojiCategory(e) {
  if (e.target.dataset.category != "") {
    const favouriteEmojis = emojis.filter(emoji =>
      emoji.category.includes(e.target.dataset.category)
    );
    searchEmojis(favouriteEmojis);
  }
}

getData();