
let currentSong = new Audio();
let firstsong = new Audio();
let songs;
let currFolders;

function SecondsToMinutesSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);

    // Format seconds to always be two digits

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingseconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
     currFolders = folder
    let a = await fetch(`http://127.0.0.1:5500/${currFolders}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3") ){
            songs.push(element.href.split(`${currFolders}`)[1])
        }
    }

    let songUl = document.querySelector(".fst").getElementsByTagName("ul")[0]
    songUl.innerHTML =""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                <div class="song-icon">
                  <img class="invert" src="song-icon.svg" alt="">
                </div>
                <div class="info">
                  <span class="track_name" >${song.replaceAll("%20", " ")}</span>
                  <span class="artist_name" >Artist</span>
                </div>
                <div class="playnow">
                  <img id="playnow" class="invert" src="playnow.svg" alt="">
                </div>
              </li>`;
    }

   Array.from(document.querySelector(".fst").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element =>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML) 
     })
   })
   return songs

}

const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `${currFolders}` + track
    currentSong.play()
    play.src="pause.svg"
    document.querySelector(".stitle").innerHTML = track.replaceAll("%20", " ")
    document.querySelector(".duration").innerHTML = "00:00/00:00"
    // document.querySelector("#playnow").src ="pausenow.svg"
    
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card2")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").splice(-1)[0]
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json()
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="c cpreview">
                <div class="play">
                  <img
                    class="play-img"
                    src="https://cdn.hugeicons.com/icons/play-solid-sharp.svg"
                    alt=""
                  />
                </div>
                <img
                  class="song-pic"
                  src="/songs/${folder}/cover.jpeg"
                  alt=""
                />
                <div class="txt">
                  <p>${response.title}</p>
                  <a href="#">${response.description}</a>
                </div>
              </div>`
        }
    }

    Array.from(document.getElementsByClassName("cpreview")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main(){
    await getSongs("/songs/bass")
    console.log(songs)
    // playMusic(songs[0], true)

    displayAlbums()
    
   
   play.addEventListener("click", ()=>{
        if (currentSong.paused){
            // currentSong.src = "/songs/" + songs[0]
            currentSong.play()
            play.src="pause.svg"
    //         document.querySelector(".stitle").innerHTML= currentSong.src.split("/songs/")[1].replaceAll("%20", " ")
    // document.querySelector(".duration").innerHTML = "00:00/00:00"
            // document.querySelector("#playnow").src ="pausenow.svg"
        }
        else{
            play.src="playicon.svg"
            currentSong.pause()
            // document.querySelector("#playnow").src ="playnow.svg"
        }
   })

   currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".duration").innerHTML=`${SecondsToMinutesSeconds(currentSong.currentTime)}/${SecondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left= (currentSong.currentTime / currentSong.duration)*100 + "%"
   })

   document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration)*percent)/100
   })

    previous.addEventListener("click", ()=>{
        console.log("pr")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0 ){
            playMusic(songs[index-1])
        }
    })
    
    next.addEventListener("click", ()=>{
        console.log("ne")
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length ){
            playMusic(songs[index+1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting volume to", e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50
        }
    })

}
main()
