const letters=document.querySelectorAll(".board-info");
const loadingDiv=document.querySelector(".spiral");

async function init(){
    let currentGuess="";
    let currentRow=0;
    let isLoading=true

    const res=await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj= await res.json();
    const word = resObj.word.toUpperCase();
    isLoading=false;
    console.log(word);
    const wordParts=word.split("");
    setLoading(false);
    let done=true

    function deleteLetter(){
        currentGuess=currentGuess.substring(0, currentGuess.length-1);
        letters[5*currentRow+currentGuess.length].innerText="";
    }

    function addLetter(letter){
        if(currentGuess.length<5){ //answer is 5 letters long
            currentGuess+=letter;
            //add letter to the end
        }else{
            //replace last letter
            currentGuess=currentGuess.substring(0, currentGuess.length-1) + letter;
        }
        letters[5*currentRow+currentGuess.length-1].innerText=letter;
    }

    async function commitWord(){
        console.log(currentGuess)
        if(currentGuess.length!=5){  
            return;
        }
        //validate the word
        isLoading=true;
        setLoading=true;
        const res= await fetch("https://words.dev-apis.com/validate-word",{
            method:"POST",
            body: JSON.stringify({word: currentGuess})
    })
        const resObj=await res.json();
        const validWord=resObj.validWord;
        isLoading=false;
        setLoading=false;
        if(!validWord){
            markInvalidWord();
            return;
        }
        //marking as correct close or wrong
        const guessParts= currentGuess.split("");
        const map=mapLetters(wordParts);
        console.log(map);
        for(let i=0;i<5;i++){
            //mark as correct
            if(guessParts[i]===wordParts[i])
                {
                    letters[currentRow*5+i].classList.add("correct");
            }else if(wordParts.includes(guessParts[i])&&map[guessParts[i]]>0){
                    letters[currentRow*5+i].classList.add("close");
            }else {
                letters[currentRow*5+i].classList.add("wrong");
            }
            map[guessParts[i]]--;
        }
        
        //win or lose ?
        if(currentGuess==word){
            alert("you win");
            done=true;
        }else if(currentRow===5){
            alert(`buhu the word was ${word}`);  
            done=true;
        }else{
            currentRow+=1;
            currentGuess="";   
        }

    }
    function markInvalidWord(){
        alert("not a valid word");
    }
    
    addEventListener("keydown",function HandleInput(event){
        const action=event.key;

        if(action==="Enter"){
            event.preventDefault();
            commitWord();
        } else if (action==="Backspace"){
            deleteLetter();
        } else if (isLetter(action)){
            addLetter(action.toUpperCase());
        }else {
            //suck it do nothing
        }
    })

}
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading){
        loadingDiv.classList.toggle('hidden',!isLoading);
}
function mapLetters(array){
    const obj={};
    for(let i=0;i<array.length;i++){
        const letter=array[i];
        if (obj[letter]){
            obj[letter]++;
        }else{
            obj[letter]=1;
        }
    }
    return obj;
}



init();