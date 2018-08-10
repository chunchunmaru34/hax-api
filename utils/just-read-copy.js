/////////////////////////////////////
// Generic helper functions
/////////////////////////////////////


// Add :scope functionality to QS & QSA
(function(doc, proto) {
try { // Check if browser supports :scope natively
    doc.querySelector(':scope body');
} catch (err) { // Polyfill native methods if it doesn't
    ['querySelector', 'querySelectorAll'].forEach(function(method) {
    var nativ = proto[method];
    proto[method] = function(selectors) {
        if (/(^|,)\s*:scope/.test(selectors)) { // Only if selectors contains :scope
        var id = this.id; // Remember current element id
        this.id = 'ID_' + Date.now(); // Assign new unique id
        selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // Replace :scope with #ID
        var result = doc[method](selectors);
        this.id = id; // Restore previous id
        return result;
        } else {
        return nativ.call(this, selectors); // Use native code for other selectors
        }
    }
    });
}
})(window.document, Element.prototype);


// Add cross-browser fullscreen ability
!function(){"use strict";var a="undefined"!=typeof window&&void 0!==window.document?window.document:{},b="undefined"!=typeof module&&module.exports,c="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,d=function(){for(var b,c=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],d=0,e=c.length,f={};d<e;d++)if((b=c[d])&&b[1]in a){for(d=0;d<b.length;d++)f[c[0][d]]=b[d];return f}return!1}(),e={change:d.fullscreenchange,error:d.fullscreenerror},f={request:function(b){var e=d.requestFullscreen;b=b||a.documentElement,/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)?b[e]():b[e](c&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){a[d.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},onchange:function(a){this.on("change",a)},onerror:function(a){this.on("error",a)},on:function(b,c){var d=e[b];d&&a.addEventListener(d,c,!1)},off:function(b,c){var d=e[b];d&&a.removeEventListener(d,c,!1)},raw:d};if(!d)return void(b?module.exports=!1:window.screenfull=!1);Object.defineProperties(f,{isFullscreen:{get:function(){return Boolean(a[d.fullscreenElement])}},element:{enumerable:!0,get:function(){return a[d.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return Boolean(a[d.fullscreenEnabled])}}}),b?module.exports=f:window.screenfull=f}();


function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Mute a singular HTML5 element
function muteMe(elem) {
    elem.muted = true;
    elem.pause();
}

// Try to mute all video and audio elements on the page
function mutePage() {
    var videos = document.querySelectorAll("video"),
        audios = document.querySelectorAll("audio");

    [].forEach.call(videos, function(video) { muteMe(video); });
    [].forEach.call(audios, function(audio) { muteMe(audio); });
}



/////////////////////////////////////
// Extension-related helper functions
/////////////////////////////////////

// From https://stackoverflow.com/a/14824756/2065702
function isRTL(s) {           
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};

function checkElemForDate(elem, attrList, deleteMe) {
    var myDate = false;
    if(elem) {
        for(var i = 0; i < attrList.length; i++) {
            if(elem[attrList[i]]
            && elem[attrList[i]] != "" //  Make sure it's not empty
            && elem[attrList[i]].split(' ').length < 10) { // Make sure the date isn't absurdly long
                myDate = elem[attrList[i]];

                if(deleteMe) {
                    elem.dataset.simpleDelete = true; // Flag it for removal later
                }
            }
        }
    }

    return myDate;
}

function getArticleDate() {
    // Make sure that the pageSelectedContainer isn't empty
    if(pageSelectedContainer == null)
        pageSelectedContainer = document.body;

    // Check to see if there's a date class
    var date = false,
        toCheck = [
            [pageSelectedContainer.querySelector('[class^="date"]'), ["innerText"], true],
            [pageSelectedContainer.querySelector('[class*="-date"]'), ["innerText"], true],
            [pageSelectedContainer.querySelector('[class*="_date"]'), ["innerText"], true],
            [document.body.querySelector('[class^="date"]'), ["innerText"], false],
            [document.body.querySelector('[class*="-date"]'), ["innerText"], false],
            [document.body.querySelector('[class*="_date"]'), ["innerText"], false],
            [document.head.querySelector('meta[name^="date"]'), ["content"], false],
            [document.head.querySelector('meta[name*="-date"]'), ["content"], false],
            [pageSelectedContainer.querySelector('time'), ["datetime", "innerText"], true],
            [document.body.querySelector('time'), ["datetime", "innerText"], false],
        ];


    for(var i = 0; i < toCheck.length; i++) {
        if(!date) {
            var checkObj = toCheck[i];
            date = checkElemForDate(checkObj[0], checkObj[1], checkObj[2])
        }
    }

    if(date)
        return date.replace(/on\s/gi, '').replace(/(?:\r\n|\r|\n)/gi, '&nbsp;').replace(/[<]br[^>]*[>]/gi,'&nbsp;'); // Replace <br>, \n, and "on"

    return "Unknown date";
}

function getArticleTitle() {
    // Get the page's title
    var title = document.head.querySelector("title");
    if(title) {
        title = title.innerText;

        // Get the part before the first — if it exists
        if(title.indexOf(' — ') > 0) {
            return title.substr(0, title.indexOf(' — '));
        }

        // Get the part before the first – if it exists
        if(title.indexOf(' – ') > 0) {
            return title.substr(0, title.indexOf(' – '));
        }

        // Get the part before the first - if it exists
        if(title.indexOf(' - ') > 0) {
            return title.substr(0, title.indexOf(' - '));
        }

        // Get the part before the first | if it exists
        if(title.indexOf(' | ') > 0) {
            return title.substr(0, title.indexOf(' | '));
        }

        // Get the part before the first : if it exists
        if(title.indexOf(' : ') > 0) {
            return title.substr(0, title.indexOf(' : '));
        }
    } else {
        title = "Unknown title";
    }

    return title;
}

function getArticleAuthor() {
    // Make sure that the pageSelectedContainer isn't empty
    if(pageSelectedContainer == null)
        pageSelectedContainer = document.body;

    var author = null;

    // Check to see if there's an author rel in the article
    var elem = pageSelectedContainer.querySelector('[rel*="author"]');
    if(elem) {
        if(elem.innerText.split(/\s+/).length < 5 && elem.innerText.replace(/\s/g,'') !== "") {
            elem.dataset.simpleDelete = true; // Flag it for removal later
            author = elem.innerText;
        }
    }

    // Check to see if there's an author class
    elem = pageSelectedContainer.querySelector('[class*="author"]');
    if(author === null && elem) {
        if(elem.innerText.split(/\s+/).length < 5 && elem.innerText.replace(/\s/g,'') !== "") {
            elem.dataset.simpleDelete = true; // Flag it for removal later
            author = elem.innerText;
        }
    }

    elem = document.head.querySelector('meta[name*="author"]');
    // Check to see if there is an author available in the meta, if so get it
    if(author === null && elem)
        author = elem.getAttribute("content");

    // Check to see if there's an author rel in the body
    elem = document.body.querySelector('[rel*="author"]');
    if(elem) {
        if(elem.innerText.split(/\s+/).length < 5 && elem.innerText.replace(/\s/g,'') !== "") {
            author = elem.innerText;
        }
    }

    elem = document.body.querySelector('[class*="author"]');
    if(author === null && elem) {
        if(elem.innerText.split(/\s+/).length < 6 && elem.innerText.replace(/\s/g,'') !== "") {
            author = elem.innerText;
        }
    }

    if(author !== null && typeof author !== "undefined") {
        // If it's all caps, try to properly capitalize it
        if(author === author.toUpperCase()) {
            var words = author.split(" "),
                wordsLength = words.length;
            for(var i = 0; i < wordsLength; i++) {
                if(words[i].length < 3 && i != 0 && i != wordsLength)
                    words[i] = words[i].toLowerCase(); // Assume it's something like "de", "da", "van" etc.
                else
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1).toLowerCase();
            }
            author = words.join(' ');
        }
        return author.replace(/by\s/ig, ''); // Replace "by"
    }

    return "Unknown author";
}

function getContainer() {
    var numWordsOnPage = document.body.innerText.match(/\S+/g).length,
        ps = document.body.querySelectorAll("p");
    
    // Find the paragraphs with the most words in it
    var pWithMostWords = document.body,
        highestWordCount = 0;

    if(ps.length === 0) {
        ps = document.body.querySelectorAll("div");
    }

    for(var i = 0; i < ps.length; i++) {
        if(checkAgainstBlacklist(ps[i]) // Make sure it's not in our blacklist
        && checkAgainstBlacklist(ps[i].parentNode) // and its parent...
        && ps[i].offsetHeight !== 0) { //  Make sure it's visible on the regular page
            var myInnerText = ps[i].innerText.match(/\S+/g);
            if(myInnerText) {
                var wordCount = myInnerText.length;
                if(wordCount > highestWordCount) {
                    highestWordCount = wordCount;
                    pWithMostWords = ps[i];
                }
            }
        }

        // Remove elements in JR that were hidden on the original page
        if(ps[i].offsetHeight === 0)
            ps[i].dataset.simpleDelete = true;
    }

    // Keep selecting more generally until over 2/5th of the words on the page have been selected
    var selectedContainer = pWithMostWords,
        wordCountSelected = highestWordCount;
    
    while(wordCountSelected / numWordsOnPage < 0.4 
    && selectedContainer != document.body
    && selectedContainer.parentNode.innerText) {
        selectedContainer = selectedContainer.parentNode;
        wordCountSelected = selectedContainer.innerText.match(/\S+/g).length;
    }

    // Make sure a single p tag is not selected
    if(selectedContainer.tagName === "P") {
        selectedContainer = selectedContainer.parentNode;
    }
    
    return selectedContainer;
}


// Handle link clicks
function linkListener(e) {
    if(!simpleArticleIframe.body.classList.contains("simple-deleting")) {
        // Don't change the top most if it's not in the current window
        if(e.ctrlKey
        || e.shiftKey
        || e.metaKey
        || (e.button && e.button == 1)
        || this.target === "about:blank"
        || this.target === "_blank") {
            return; // Do nothing
        }

        // Don't change the top most if it's referencing an anchor in the article
        var hrefArr = this.href.split("#");
        
        if(hrefArr.length < 2 // No anchor
        || (hrefArr[0].replace(/\/$/, "") != top.window.location.origin + top.window.location.pathname.replace(/\/$/, "") // Anchored to an ID on another page
            && hrefArr[0] != "about:blank"
            && hrefArr[0] != "_blank")
        || (simpleArticleIframe.getElementById(hrefArr[1]) == null // The element is not in the article section
            && simpleArticleIframe.querySelector("a[name='" + hrefArr[1] + "']") == null)
        ) {
            top.window.location.href = this.href; // Regular link
        } else { // Anchored to an element in the article
            top.window.location.hash = hrefArr[1];
            simpleArticleIframe.location.hash = hrefArr[1];
        }
    }
}

// Check given item against blacklist, return null if in blacklist
var blacklist = ["comment"];
function checkAgainstBlacklist(elem) {
    if(typeof elem != "undefined" && elem != null) {
        var className = elem.className,
            id = elem.id;
        for(var i = 0; i < blacklist.length; i++) {
            if((typeof className != "undefined" && className.indexOf(blacklist[i]) >= 0) 
            || (typeof id != "undefined" && id.indexOf(blacklist[i]) >= 0)
            ) {
                return null;
            }
        }
    }
    return elem;
}



/////////////////////////////////////
// Extension-related adder functions
/////////////////////////////////////

// Add the article author and date
function addArticleMeta() {
    var metaContainer = document.createElement("div");
    metaContainer.className = "simple-meta";
    var author = document.createElement("div"),
        date = document.createElement("div"),
        title = document.createElement("h1");

    var authorContent = document.createElement("div"),
        dateContent = document.createElement("div"),
        titleContent = document.createElement("div");

    author.className = "simple-author";
    date.className = "simple-date";
    title.className = "simple-title";

    // Check a couple places for the date, othewise say it's unknown
    dateContent.innerHTML = getArticleDate();
    date.appendChild(dateContent);
    // Check to see if there is an author available in the meta, if so get it, otherwise say it's unknown
    authorContent.innerHTML = getArticleAuthor();
    author.appendChild(authorContent);
    // Check h1s for the title, otherwise say it's unknown
    titleContent.innerText = getArticleTitle();
    title.appendChild(titleContent);

    metaContainer.appendChild(date);
    metaContainer.appendChild(author);
    metaContainer.appendChild(title);

    return metaContainer;
}



/////////////////////////////////////
// Actually create the iframe
/////////////////////////////////////

var simpleArticleIframe,
    isInDelMode = false;
var pageSelectedContainer;
function createSimplifiedOverlay() {

    // Create an iframe so we don't use old styles
    var simpleArticle = document.createElement("iframe");
    simpleArticle.id = "simple-article";
    simpleArticle.className = "simple-fade-up no-trans"; // Add fade

    var container = document.createElement("div");
    container.className = "simple-container";

   
    pageSelectedContainer = getContainer();

    var pattern =  new RegExp ("<br/?>[ \r\n\s]*<br/?>", "g");
    pageSelectedContainer.innerHTML = pageSelectedContainer.innerHTML.replace(pattern, "</p><p>");


    selected = pageSelectedContainer;

    // Get the title, author, etc.
    container.appendChild(addArticleMeta())

    // Set the text as our text
    var contentContainer = document.createElement("div");
    contentContainer.className = "content-container";
    contentContainer.innerHTML = pageSelectedContainer.innerHTML;


    // Strip inline styles
    var allElems = contentContainer.getElementsByTagName("*");
    for (var i = 0, max = allElems.length; i < max; i++) {
        var elem = allElems[i];

        if(elem != undefined) {
            elem.removeAttribute("style");
            elem.removeAttribute("color");
            elem.removeAttribute("width");
            elem.removeAttribute("height");
            elem.removeAttribute("background");
            elem.removeAttribute("bgcolor");
            elem.removeAttribute("border");

            // Remove elements that only have &nbsp;
            if(elem.dataset && elem.innerHTML.trim() === '&nbsp;')
                elem.dataset.simpleDelete = true;

            // See if the pres have code in them
            var isPreNoCode = true;
            if(elem.nodeName === "PRE" && !leavePres) {
                isPreNoCode = false;

                for(var j = 0, len = elem.children.length; j < len; j++) {
                    if(elem.children[j].nodeName === "CODE")
                        isPreNoCode = true;
                }

                // If there's no code, format it
                if(!isPreNoCode) {
                    elem.innerHTML = elem.innerHTML.replace(/\n/g, '<br/>')
                }
            }

            // Replace the depreciated font element and pres without code with ps
            if(elem.nodeName === "FONT" || !isPreNoCode) {
                var p = document.createElement('p');
                p.innerHTML = elem.innerHTML;

                elem.parentNode.insertBefore(p, elem);
                elem.parentNode.removeChild(elem);
            }

            // Remove any inline style, LaTeX text, or noindex elements and things with aria hidden
            if((elem.nodeName === "STYLE"
            || elem.nodeName === "NOINDEX"
            || elem.nodeName === "LINK"
            || elem.getAttribute("encoding") == "application/x-tex"
            || (elem.getAttribute("aria-hidden") == "true" 
                && !elem.classList.contains("mwe-math-fallback-image-inline"))))
                elem.setAttribute("data-simple-delete", true);

            // Show LaTeX plain text on hover
            if(elem.classList.contains("mwe-math-fallback-image-inline")) {
                var plainText = document.createElement("div");
                plainText.className = "simple-plain-text";
                plainText.innerText = elem.alt;
                elem.parentNode.insertBefore(plainText, elem.nextSibling);
            }
        }
    }

    // Handle RTL sites
    var direction = window.getComputedStyle(document.body).getPropertyValue("direction");
    if(direction === "rtl" || isRTL(contentContainer.firstChild.innerText)) {
        container.classList.add("rtl");
    }

    container.appendChild(contentContainer);

    // Remove the elements we flagged earlier
    var deleteObjs = container.querySelectorAll("[data-simple-delete]");
    for (var i = 0, max = deleteObjs.length; i < max; i++) {
        deleteObjs[i].parentNode.removeChild(deleteObjs[i]);
    };

    // Add our iframe to the page
    document.body.appendChild(simpleArticle);

    // Focus the article so our shortcuts work from the start
    document.getElementById("simple-article").focus();

    // Append our custom HTML to the iframe
    simpleArticleIframe = document.getElementById("simple-article").contentWindow.document;
    simpleArticleIframe.body.appendChild(container);


    // Add MathJax support
    var mj = document.querySelector("script[src *= 'mathjax");
    if(mj) {
        var mathjax = document.createElement("script");
        mathjax.src = mj.src;
        simpleArticleIframe.head.appendChild(mathjax);

        var scripts = document.getElementsByTagName("script");
        for(var i = 0; i < scripts.length; i++) {
            if(scripts[i].innerText.indexOf("MathJax.Hub.Config") >= 0) {
                var clone = scripts[i].cloneNode(true);
                container.appendChild(clone);
            }
        }
    }

    // Fade in and move up the simple article
    setTimeout(function() {
        simpleArticle.classList.remove("no-trans");
        simpleArticle.classList.remove("simple-fade-up");

        // Disable scroll on main page until closed
        document.documentElement.classList.add("simple-no-scroll");
    })

    // Size our YouTube containers appropriately
    var youtubeFrames = simpleArticleIframe.querySelectorAll("iframe[src *= 'youtube.com/embed/']");
    for(var i = 0; i < youtubeFrames.length; i++) {
        youtubeFrames[i].parentElement.classList.add("youtubeContainer");
    }
}



/////////////////////////////////////
// Handle the stylesheet syncing
/////////////////////////////////////
var isPaused = false,
    stylesheetObj = {},
    stylesheetVersion = 1.20; // THIS NUMBER MUST BE CHANGED FOR THE STYLESHEETS TO KNOW TO UPDATE
  
function launch() {
        
    mutePage();
    createSimplifiedOverlay();
       
}
launch();
  