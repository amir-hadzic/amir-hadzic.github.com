/**
 * Author: Amir Hadzic
 * Web: http://randomshouting.com
 */
var canvasTyper = {};

(function(){
    var canvas = null;
    var ctx = null;
    var words = new Array();
    var activeWords = new Array();
    var typedWord = null;
    var typedLetters = 0;
    var lives = 3;
    var gameOver = false;
    var points = 0;
    
    const FONT_HEADER = "bold 16px Monospace";
    const FONT_WORD = "bold 18px Monospace";
    const FONT_GAME_OVER = "bold 32px Monospace";
    const FONT_DEFAULT = "bold 16px Monospace";
    
    const STYLE_HEADER = "black";
    const STYLE_WORD = "yellow";
    const STYLE_GUESSED_WORD = "blue";
    const STYLE_GAME_OVER = "red";
    const STYLE_DEFAULT = "white";
    
    this.log = function(string)
    {
        window.console && console.log(string);    
    };
    
    this.init = function(canvasId)
    {
        this.log("Initializing on: " + canvasId);
        canvas = document.getElementById(canvasId);
        
        if (canvas && canvas.getContext){
            ctx = canvas.getContext('2d');
            
            this.log("Initializing word list.");
            
            if(!this.loadWordList()){
                return;
            }
            
            document.onkeypress = this.keypress;
            this.spawnWord(this);
            this.paint(this);
        } else {
            this.log("Initialization failed. Canvas element not found or" 
                     + " not supported");
        }
    };
    
    this.loadWordList = function()
    {
        this.log("Sending request for words list file.");
        var request = new XMLHttpRequest();
        
        request.open("GET", "http://my.blog.com/static/word-list.txt", false);
        request.send(null);
        
        if (request.readyState == 4){
            words = request.responseText.split("\n")
            
            // See if the last element is empty and remove it.
            if (words[words.length-1] == ""){
                words.splice(words.length-1, 1);
            }
            
            this.log("Words loaded.");
            return true;
        } else {
            this.log("Unable to load words file.");
            return false;
        }
        
    };
    
    this.getRandomWord = function()
    {
        return words[Math.floor(Math.random()*(words.length+1))];    
    };
    
    this.findActiveWord = function(word){
        for (var i = 0; i < activeWords.length; i++){
            if (activeWords[i].text == word){
                return i;
            }
        }
        
        return -1;    
    };
    
    this.fillCenterText = function(text, ypos)
    {
        var xpos = (canvas.width / 2) - (ctx.measureText(text).width / 2);        
        
        ctx.fillText(text, xpos, ypos);
    };
    
    this.spawnWord = function(that)
    {
        var word = "";
        
        // Fetch some random word and make sure not to 
        // select some already selected word.
        do
        {
            word = that.getRandomWord();    
        } while (that.findActiveWord(word, that) != -1)
        
        var maxXPos = canvas.width - ctx.measureText(word).width;
        
        wordObject = {
            text: word,
            xpos: Math.floor(Math.random() * (maxXPos + 1)),
            ypos: 0
        }
        
        activeWords.push(wordObject);
        setTimeout(
            that.spawnWord,
            300+Math.floor(Math.random()*1501),
            that
        );
    };
    
    this.keypress = function(e)
    {
        var typedLetter = String.fromCharCode(e.charCode);
        
        if (typedWord != null) {
            var typedWordObject = activeWords[typedWord];
            
            if (typedWordObject.text[typedLetters] == typedLetter){
                // The next letter is typed correctly               
                typedLetters++;
                
                if (typedLetters == typedWordObject.text.length){
                    activeWords.splice(typedWord, 1);
                    typedLetters = 0;
                    typedWord = null;
                    points++;
                }
            } else {
                // Error while typing.
                typedWord = null;
                typedLetters = 0;
            }
        } else {
            for(var i = activeWords.length-1; i >= 0; i--){
                var activeWord = activeWords[i];
                
                if (activeWord.text[0] == typedLetter){
                    typedWord = i;
                    typedLetters = 1;
                }
            }
        }
    };
    
    this.paint = function(that)
    {        
        // Draw the background.
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the header.
        ctx.fillStyle = "rgba(240,240,50, 0.9)";
        ctx.fillRect(0, 0, canvas.width, 25);
        
        ctx.font = FONT_HEADER;
        ctx.fillStyle = STYLE_HEADER;        
        that.fillCenterText("CanvasTyper", 15);
        
        // Draw word and life points
        ctx.font = FONT_DEFAULT;
        ctx.fillStyle = STYLE_DEFAULT;
        ctx.fillText("Points: " + points, 5, 40);
        
        livesMetrics = ctx.measureText("Lives: " + lives);
        ctx.fillText(
            "Lives: " + lives, 
            canvas.width - livesMetrics.width - 5, 
            40
        );
        
        // Draw active words
        ctx.font = FONT_WORD;  
        ctx.fillStyle = STYLE_WORD;          
        
        for(var i = 0; i < activeWords.length; i++){
            var word = activeWords[i];
            
            if (typedWord == i) {
                // Draw the guessed part
                ctx.fillStyle = STYLE_GUESSED_WORD;
                ctx.fillText(
                    word.text.substr(0, that.typedLetters),
                    word.xpos,
                    word.ypos
                );
                
                // Draw the remaining letters
                var xposOffset = ctx.measureText(
                    word.text.substr(0, typedLetters)
                ).width;
                
                ctx.fillStyle = STYLE_WORD;
                ctx.fillText(
                    word.text.substr(typedLetters),
                    xposOffset + word.xpos,
                    word.ypos
                );
            } else {
                ctx.fillText(word.text, word.xpos, word.ypos);
            }
        }
        
        // Move the words down
        for (var i = 0; i < activeWords.length; i++){
            activeWords[i].ypos += 1;
        }
        
        // See if any words are lost
        var lostWords = new Array();
        for (var i = 0; i < activeWords.length; i++){
            var activeWord = activeWords[i];
            
            if (activeWord.ypos > canvas.height){
                lostWords.push(i);
            }
        }
        
        for (var i = 0; i < lostWords.length; i++){
            lives--;
            activeWords.splice(lostWords[i], 1);
            
            if (typedWord == lostWords[i]){
                typedWord = null;
                typedLetters = 0;
            }
        }
        
        if (lives <= 0){
            gameOver = true;
            ctx.font = FONT_GAME_OVER;
            ctx.fillStyle = STYLE_GAME_OVER;
            
            that.fillCenterText("Game Over!", 200);
        }
        
        if (!gameOver){
            setTimeout(that.paint, 10, that);    
        }
    };
    
}).apply(canvasTyper);
