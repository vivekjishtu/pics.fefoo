/*
 * TODO: 
 *     Refactor the code
 *     User should be able to add or remove subreddits
 *     Get image url for flickr images
 */ 

var NSFW = true;
var SITE_TITLE = "pics.fefoo";
var NSFW_IMAGE = "nsfw.png";
var NYUD_AVAILABLE = false;
var _gaq = _gaq || [];

// Check for firebug and act accordingly..
if(typeof console == "undefined") 
{
    console = {};
    console.log = function() { };
}

// Check if the user can use Coral Cache
(function()
    {
        var img = new Image();
        img.onload = function()
        {
            if(img.height == 1 && img.width == 1) 
            {
                NYUD_AVAILABLE = true;
		  _gaq.push(['_trackEvent', 'NYUD_AVAILABLE', "true"]);
            }
        };
	
	 _gaq.push(['_trackEvent', 'NYUD_AVAILABLE_DETECTION', "STARTED"]);
        
        /*
         *  Need to check every hour as the connection could have changed.
         *  Also Coral Cache normally caches the image for 12 Hours on the 
         *  client side.
         */
        var date = new Date();
        var uniqueID = date.getUTCDate() + "x" + date.getUTCHours();
        img.src = "http://pics.fefoo.com.nyud.net/blank.gif?uniqueID=" + uniqueID;
    }
)();

$(document).keydown(function(event) {
   // alert(event.which); //+ " " + event.keycode);
    switch(event.which)
    {
        case 33: // Page Up
            if(event.altKey | event.ctrlKey)
            {
                // Don't do anything
            }
            else
            {
                if(event.shiftKey)
                {
                    gotoPage(-1);
                    event.preventDefault();
                }
            }
            break;
        case 34: // Page Down
            if(event.altKey | event.ctrlKey)
            {
                // Don't do anything
            }
            else
            {
                if(event.shiftKey)
                {
                    gotoPage(1);
                    event.preventDefault();
                }
            }
            break;
        case 74: // j
            gotoPage(1);
            break;
        case 75: // k
            gotoPage(-1);
            break;
            break;
    }
    
    
    
 /*
  if (event.keyCode == '13') {
     event.preventDefault();
   }
   xTriggered++;
   var msg = 'Handler for .keypress() called ' + xTriggered + ' time(s).';
  $.print(msg, 'html');
  $.print(event);
  
  
  */
});

function gotoPage(where)
{
    var panels = $(".image");
    var currentScrollPosition = $(window).scrollTop();
    var body = $(window);

    if(where == -1)
    {
        var foundItem = false;
        for(var x = panels.length; x > 0; x--)
        {
            if(panels[x - 1].offsetTop < $(window).scrollTop())
            {
               // panels[x - 1].scrollIntoView(true);
                //body.scrollTop(body.scrollTop() - 30);
                
				body.scrollTop(panels[x - 1].offsetTop - 30);
				
				/*
				$('body,html').animate({
					scrollTop: panels[x - 1].offsetTop - 30
				}, 250);
				*/
				foundItem = true;
                break;
            }
        }
        if(!foundItem) window.scrollTo(0, 0);
        return foundItem;
    }
    //alert(x[0].offsetTop + " " + $(window).scrollTop() + " " + $(window).scrollTop());
    
  
    var foundItem = false;
	var currentPosition = body.scrollTop();
    for(var x = 1; x < panels.length; x++)
    {
       if(panels[x].offsetTop > $(window).scrollTop() + 30)
       {
          //panels[x].scrollIntoView(true);
          //body.scrollTop(body.scrollTop() - 30);
          
		  //$(panels[x]).fadeOut(function(){
			//body.scrollTop(panels[x].offsetTop - 30);
			//$(panels[x]).fadeOut();
		 // });
		  
		  body.scrollTop(panels[x].offsetTop - 30);
		  
		  /*
		  $('body,html').animate({
			scrollTop: panels[x].offsetTop - 30
		  }, panels[x].offsetHeight * 8);
		  */
		  foundItem = true;
          break;
       }
    }
    
	if(currentPosition == body.scrollTop()) foundItem = false;
	
    if(!foundItem) window.scrollTo(0, $(document).height());
	return foundItem;
  //  element
    
}
  
// Convert any url to Coral Cache URL
function convertToCoralCache(url)
{
    // If Coral Cache is unavailable return the url
    if(!NYUD_AVAILABLE) return url;
    try
    {
        var uriComponents = url.split("/");
        
        // Check that its not coralized already
        if(uriComponents[2].indexOf("nyud.net") == -1)
        {
            url = url.replace(uriComponents[2], uriComponents[2] + ".nyud.net");
        }        
    }
    catch(ex)
    {
        console.log(ex);
    }
    return url;
}

// Get the thumbnail image from a YouTube URL.
function getYouTubeImageUrl(url)
{
    try
    {
        var uriComponents = url.split("/");
        if(uriComponents[2].indexOf("youtube.com") != -1)
        {
            var getComponents = uriComponents[3].substr(uriComponents[3].indexOf("?") + 1).split("&");
            
            for(var x = 0; x <getComponents.length; x++)
            {
                if(getComponents[x].indexOf("v=") == 0)
                {
                    var videoID = getComponents[x].replace("v=", "");
                    return "http://img.youtube.com/vi/" + videoID + "/0.jpg";
                }
            }
        }
    }
    catch(ex)
    {
        console.log(ex);
    }
    return url;
}

// Get imgur image URL
function getImgurImageUrl(url)
{
    try
    {
        var uriComponents = url.split("/");
        
        if(uriComponents[2].indexOf("imgur.com") != -1)
        {
            if(uriComponents[3].indexOf(".") == -1)
            {
                if(uriComponents[3].indexOf("?") == -1)
                {
                    url = url.replace(uriComponents[3], uriComponents[3] + ".png");
                }
                else
                {
                    var imgid = uriComponents[3].substr(0, uriComponents[3].indexOf("?"));
                    url = url.replace(imgid, imgid + ".png");
                }
            }
        }
    } 
    catch(ex)
    {
        console.log(ex);
    }
    return url;
}


// Supported subreddites
var subreddits = ["all", "pics", "funny", "wtf", "fffffffuuuuuuuuuuuu", "aww",
                     "itookapicture" , 
                    "wallpaper", 
                    "gifs", 
                    "earthporn"
                    
    ];


// TODO::
function getFlickrImageUrl(url)
{
    // http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=2de705f0fdd8a32c0e49f12db644dcb9a0&photo_id=459330432384
    // Flickr get photo Info
    /*
        http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}.jpg
        or
        http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
        or
        http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)

        http://www.flickr.com/services/api/misc.urls.html
    */
}

$(document).ready(function()
{
    
    /*
     * Check if browser if IE is < 9
     * Warn user about IE bugs
     * Let the user decide about going forward.
     */
    
    //@cc_on if(doIEStuff()) return;
    
    // Main entry point
    beginExecution();
    
    
});

function doIEStuff()
{   
    
    document.body.className = "ie";
        
    // Verion detection from http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
    var version = (function(){
     
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
     
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );
     
        return v > 4 ? v : undef;
     
    }());
    
    if(version < 9) 
    { 
        warnIEBugs();
        return true;
    }
    
    return false;
}

// Main function where execution begins
function beginExecution()
{
    $.history.init(pageload);

    feed = document.getElementById("feed");
    
    document.getElementById("btnTop").onclick = function()
    {
		var timeToScrollUp = $(window).scrollTop()/3;
		if(timeToScrollUp > 3000) timeToScrollUp = 3000;
        $('body,html').animate({
			scrollTop: 0
		}, timeToScrollUp);
		return false;
    }
    
    var pnlNavigation = document.getElementById("pnlNavigation");
    pnlNavigation.onclick = function(event)
    {
       if(event.target === pnlNavigation)
       {
           window.scrollTo(0,0);
           return false;
       }
    }
    
    document.getElementById("switchNSFW").onclick = switchNSFW_Click;
    document.getElementById("closeShareBar").onclick = closeShareBar_Click;
    
	$(".panelPrevious").delegate("span", "click", function() {
		if(!gotoPage(-1)) {
			if($("#lnkPrevious").css("display") != "none") {
				window.location = $("#lnkPrevious")[0].href;
			}
		}
	});
	
	$(".panelNext").delegate("span", "click", function() {
		if(!gotoPage(1)) {
			if($("#lnkNext").css("display") != "none") {
				window.location = $("#lnkNext")[0].href;
			}
		}
	});
	
    createDialog();
	
	
	$(window).scroll(function() {
		if($(this).scrollTop() > 100) {
			$("#btnTop").fadeIn();
		} else {
			$("#btnTop").fadeOut();
		}
	})
}

function warnIEBugs()
{
    createDialog();
    $("#dialog-ie").dialog('open');
}

function createDialog()
{
    $("#dialog-confirm").dialog({
          resizable: true,
          height: 220,
          width: 340,
          modal: true,
          autoOpen: false,
          buttons: 
          {
            "Yes": function() 
            {
                toggleNSFWImages();
                $(this).dialog('close');
            },
            "No": function() 
            {
              $(this).dialog('close');
            }
          }
        });
        
        
    $("#dialog-ie").dialog({
      resizable: true,
      height: 200,
      modal: true,
      closeOnEscape: false,
      autoOpen: false,
      open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
      buttons: 
      {
        "Yes": function() 
        {
            beginExecution();
            $(this).dialog('close');
        },
        "No": function() 
        {
            window.location = "http://pics.fefoo.com/download.html";
        }
      }
    });
}


// Paint the navigation bar on top.
function paintNavigation(selectedCategory)
{
    var nav = document.getElementById("pnlNavigation");
    nav.innerHTML = "";
    
  //  paintSubCat(selectedCategory);
    function addAnchor(text, href, selected) {
		var a = document.createElement("a");
        a.innerHTML = text;
        a.id = "cat_" + text;
        a.setAttribute("category", "/r/" + text);        
        a.href = href;
        if(selected) a.className = "selected";
        nav.appendChild(a);
	}
    
    for(var x = 0; x < subreddits.length; x++)
    {
		var selected = false;
		if(selectedCategory == subreddits[x]) selected = true;
		addAnchor(subreddits[x], "#!/r/" + subreddits[x], selected);
		/*
        var a = document.createElement("a");
        a.innerHTML = subreddits[x];
        a.id = "cat_" + subreddits[x];
        a.setAttribute("category", "/r/" + subreddits[x]);        
        a.href = "#!/r/" + subreddits[x];
        if(selectedCategory == subreddits[x]) a.className = "selected";
        nav.appendChild(a);
		*/
    }
    
	addAnchor("nsfw", "/nsfw/", false);
	addAnchor("gonewild", "/nsfw/", false);
  
}

function paintSubCat(category, subCat)
{
  var catNew = document.getElementById("catNew");
  var catHot = document.getElementById("catHot");
  var catControversial = document.getElementById("catControversial");
  var catTop = document.getElementById("catTop");
  
  catNew.className = catHot.className = catControversial.className = catTop.className = "";
  switch(subCat)
  {
    case "new":
      catNew.className = "selected";      
      break;
    case "controversial":
      catControversial.className = "selected";
      break;
    case "top":
      catTop.className = "selected";
      break;
    default:
      catHot.className = "selected";
  }
  
  if(subCat) category = category.replace("/" + subCat + "/", "");
  
  catNew.href = "#!" + category + "/new/"; 
  catHot.href = "#!" + category + "/hot/";
  catControversial.href = "#!" + category + "/controversial/";
  catTop.href = "#!" + category + "/top/";
}

// Change subreddit
function changeCategory(event)
{
    var category = this.getAttribute("category");
    paintNavigation(category);
    loadSubReddit(category);
}

// User clicked on one of the internal links
function pageload(hash) 
{
    var fragString_ = "?_escaped_fragment_=";
    
    if(window.location.href.indexOf(fragString_) != -1 && hash == "")
    {
      var fragLoc_ = window.location.href.indexOf(fragString_);
      hash = window.location.href.substring(fragLoc_ + fragString_.length);
    }
    
    
    if(hash.indexOf("!") == 0) hash = hash.replace("!", "");
    
    var category = hash;
    var query = null;
    if(hash.indexOf("?") != -1)
    { 
      category = hash.substring(0, hash.indexOf("?"));
      query = hash.substring(hash.indexOf("?") + 1);
    }
    
    if(category != "" && category.indexOf("/") == -1) category = "/r/" + category;
    
    if(category == "") category = "/r/all";
    
    var elements = category.split("/");
    
    /*
    alert(elements.length);
    for(var x = 0; x < elements.length; x++)
    {
     alert(elements[x]);
    }
    */
   // category = elements[1];
    
    //if(category == "") category = subreddits[0];

    paintNavigation(elements[2]);
    
    paintSubCat(category, elements[3]);
    
    loadSubReddit(category, query);
    
    _gaq.push(['_trackPageview', document.location.href]);
    //_gaq.push(['_trackEvent', 'category', category]);
}


function loadSubReddit(category, extra)
{
    if(category.indexOf("/") == 0) category = category.substring(1);
    var url = "http://www.reddit.com/" + category + ".json?jsonp=?";
    if(extra) url = "http://www.reddit.com/" + category + ".json?count=25&" + extra + "&jsonp=?"
    
    document.getElementById("feed").innerHTML = "<br /> <br /> <center><img src='images/rotating_arrow.gif' /></center>";
    document.getElementById("navBottom").style.display = "none";
	$(".panelPrevious,.panelNext").hide();
    
    console.log("URL:" + url);
    
    //errorWhileGetingJSONP(category, url, {textStatus: "" , errorThrown: ""});
    //return;
    
    $.jsonp(
    { 
        url: url,
        data: { 
          "lang" : "en-us",
          "format" : "json",
          "tags" : "sunset"
        },
        dataType: "script",
        timeout: 60 * 1000, //30 seconds
        callbackParameter: "proxyGotData",
        // TODO: Better error handling required
        error: function(XHR, textStatus, errorThrown)
        {
           errorWhileGetingJSONP(category, url, {textStatus: textStatus , errorThrown: errorThrown});
           console.log("Error while downloading file: " +  url);
        },        
        success: function(response)
        {
           proxyGotData(response);
           if(response.data.children.length == 0) errorWhileGetingJSONP(category, url, {textStatus: "banned" , errorThrown: "banned"})
           console.log("Downloaded file: " +  url);
        },
        dataType: "jsonp",
        jsonpCallback: "proxyGotData"
    });
    
    document.title = SITE_TITLE + "/" + category.split("/")[1];
    var lblPath = document.getElementById("lblPath");
    lblPath.innerHTML = category.split("/")[1];
    lblPath.title = lblPath.href = "http://www.reddit.com/" + category;
    
    
    var lnkPrevious = document.getElementById("lnkPrevious");
    var lnkNext = document.getElementById("lnkNext");
    
    lnkPrevious.href = "#!/" + category;
    lnkNext.href = "#!/" + category;
    
}

function closeShareBar_Click()
{
  document.getElementById("shareBar").style.display = "none";
}

function errorWhileGetingJSONP(category, url, error)
{
  var feed = document.getElementById("feed");
  feed.innerHTML = "";
  var center = document.createElement("center");
  center.id = "errorFeed";
  if(error.textStatus == "banned")
  {
    center.innerHTML = "<h2>Reddit did not return any results for <a target='_blank' href='http://reddit.com/" + category +  "'>http://reddit.com/" + category + "</a>. <br />You can check on reddit if this category has any results.</h2>";
  }
  else center.innerHTML = "<h2>Currently unable to connect to <a target='_blank' href='http://reddit.com/" + category +  "'>http://reddit.com/" + category + "</a></h2>";
  
  feed.appendChild(center);
  //alert(error.textStatus + " " + error.errorThrown);
}

// Callback function
function proxyGotData(data)
{
    document.getElementById("feed").innerHTML = "";
    var items = data.data.children;
    for(var x = 0; x < items.length; x++)
    {
        addItem(items[x].data);
    }
    
    var lnkPrevious = document.getElementById("lnkPrevious");
    var lnkNext = document.getElementById("lnkNext");
    
    lnkPrevious.href =  lnkPrevious.href.substring(lnkPrevious.href.indexOf("#")) + "?before=" + data.data.before;
    
    if(data.data.before == null) lnkPrevious.style.display = "none";
    else lnkPrevious.style.display = "";
    
    lnkNext.href = lnkNext.href.substring(lnkNext.href.indexOf("#")) + "?after=" + data.data.after;
    if(data.data.after == null) lnkNext.style.display = "none";
    else lnkNext.style.display = "";

    document.getElementById("navBottom").style.display = "";
	$(".panelPrevious,.panelNext").show();
	
	$("#btnTop").hide();
}


var feed;

function print(message)
{
    $(message).appendTo("#console");
}

function addItem(item)
{
    var span = document.createElement("span");
    span.className = "image";
        
    var imgUrl = item.url;
    
    var img = document.createElement("img");
    var imgSpan = document.createElement("div");
    var a = document.createElement("a");
    var div = document.createElement("div");
    div.className = "title";
    imgSpan.className = "imgContainer";

    img.onerror = function()
    {
        if(this.width > 1) console.log(this.src + " seems to be a problem with the image");
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); 
    }
    
    img.onload = function()
    {
        var newImg = new Image();
        newImg.onload = function()
        {
            if(this.width > img.offsetWidth) setImageResizer(img);
        }
        newImg.src = img.src;
        this.parentNode.parentNode.style.display = "";
    }
    img.title = imgUrl;
    
    var imageUrl = imgUrl;
    
    if(item.domain == "imgur.com") imageUrl = getImgurImageUrl(imgUrl);
    //if(item.domain == "youtube.com") imageUrl = getYouTubeImageUrl(imgUrl);
    
    //convertToCoralCache(imageUrl)
    
    if(isUrlImage(imageUrl)) 
    {
        img.src = imageUrl;
    }
    else
    {
        img.src = convertToCoralCache(imageUrl);
        console.log("Image: " +  imageUrl);
        span.style.display = "none";
    }
    
    // Hide it till we are sure its an image
    a.href = "http://reddit.com" + item.permalink;    
    a.innerHTML = item.title;
	a.title = item.title;
    div.appendChild(a);
    
    span.appendChild(div);
    span.appendChild(imgSpan);    
    imgSpan.appendChild(img);
    
    var NSFW_switch = true;
    
    if(document.getElementById("switchNSFW").style.display == "block") NSFW_switch =  false;
    
    if(item.over_18)
    {
        if(NSFW_switch) img.style.visibility = "hidden";
       
        imgSpan.title = "The image has been marked Not Safe For Work. Click to toggle view.";
        imgSpan.className = "spanNSFW";
        span.onclick = nsfwImg_Click;
    }

    feed.appendChild(span);
    loadStoryInfo(item, img);
}

function switchNSFW_Click(event)
{
    document.getElementById("switchNSFW").style.display = "";
    
    var spans = getElementsByClassName(document, "spanNSFW");
    for(var count = 0; count < spans.length; count++)
    {
        var images = spans[count].getElementsByTagName("img");
        for(var imageCount = 0; imageCount < images.length; imageCount++)
        {
            var image = images[imageCount];
            try
            {
                if(image.className == "imageNSFW") image.style.visibility = "visible";
                else image.style.visibility = "hidden";
            }
            catch(ex)
            {
                console.log(ex);
            }
        }
    }
    return false;
}

function toggleNSFWImages()
{
    var spans = getElementsByClassName(document, "spanNSFW");
    for(var count = 0; count < spans.length; count++)
    {
        var images = spans[count].getElementsByTagName("img");
        for(var imageCount = 0; imageCount < images.length; imageCount++)
        {
            var image = images[imageCount];
            if(image.style.visibility == "hidden") image.style.visibility = "visible";
            else image.style.visibility = "hidden";
        }
    }
    
    var switchNSFW = document.getElementById("switchNSFW");
    
    if(switchNSFW.style.display == "") switchNSFW.style.display = "block"; 
    else switchNSFW.style.display = "";
}


function nsfwImg_Click(event)
{
    if(event.target.tagName == "DIV") 
    {
        var switchNSFW = document.getElementById("switchNSFW");
        if(switchNSFW.style.display == "") $("#dialog-confirm").dialog('open');
        else toggleNSFWImages();
    }
}

// Clean up this function. Use DOM instead of innerHTML
function loadStoryInfo(item, img)
{
    var span = img.parentNode.parentNode;
    
    var twitterUrl = "http://platform.twitter.com/widgets/tweet_button.html?url=http://reddit.com/" + item.id + "&via=fefoo&text=" + item.title + "&related=fefoo&count=horizontal";
    var facebookUrl = "http://www.facebook.com/plugins/like.php?href=http://reddit.com/" + item.id + "&layout=button_count&show_faces=false&width=80&action=like&font&colorscheme=light&height=25&api_key=154589504586845";
    
    var div = document.createElement("div");
    div.className = "storyInfo";
    div.innerHTML = '<iframe class="ifrmReddit" width="80" height="52"  scrolling="no" frameborder="0" src="http://www.reddit.com/static/button/button3.html?width=120&url=' + item.url + '&bordercolor=#bababa&bgcolor=#bababa"></iframe>';
    //+ '<iframe height="25" width="130" class="ifrmTwitter" allowtransparency="true" frameborder="0" scrolling="no" src="' + twitterUrl + '"></iframe>'
    //+ '<iframe height="25" width="130" class="ifrmFacebook" allowtransparency="true" frameborder="0" scrolling="no" src="' + facebookUrl + '"></iframe>';

    var createdDate = new Date((item.created_utc) * 1000);
    
    var submittedby = document.createElement("span");
    var links = document.createElement("span");
    
    submittedby.innerHTML = "submitted " + createdDate.toTimeSinceString() + " ago by <a href='http://www.reddit.com/user/" + item.author + "'>" + item.author + "</a> to <a href='#!/r/" + item.subreddit + "'>" + item.subreddit + "</a> ";
    submittedby.className = "submittedby";
    
    links.innerHTML = "<a href=\"http://www.reddit.com" + item.permalink + "\">" + item.num_comments + " comments</a> | <a class='share'>Share</a> | <a class='tweet'>Tweet</a>"; // | <a class='pinterest'>Pin it</a>";
    links.className = "commentsLinks links";
    
    div.appendChild(submittedby);
    div.appendChild(links);
    
    var share = links.getElementsByTagName("a")[1];
    share.setAttribute("data-title", item.title);
    share.setAttribute("data-id", item.id);
    //share.onclick = Share_Clicked;

  //  $(links).delegate(".pinterest", "click", pinterest_clicked);
    $(links).delegate(".tweet", "click", tweet_clicked);
    $(links).delegate(".share", "click", facebook_clicked);

    var title = $(span).find(".title")[0]
   // var a = $(title).find("a")[0];
   // div.appendChild(a);
    title.insertBefore(div, title.firstChild);
}

function tweet_clicked(event) {
    var w = 640;
    var h = 260;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var imageSpan = $(this.parentNode.parentNode.parentNode.parentNode);
    var currentLocation = "http://pics.fefoo.com";

    window.open("https://twitter.com/intent/tweet?original_referer=" + currentLocation + "&related=fefoo&source=tweetbutton&text=" + imageSpan.find(".title > a").text() + "&url=" + imageSpan.find(".imgContainer img")[0].src + "&via=fefoo" , 
        "_blank",
        "width=" + w + ",height=" + h+ ",resizable,scrollbars=yes,status=1," + 'top='+top+', left='+left);
}

function pinterest_clicked(event) {
    var w = 640;
    var h = 260;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var imageSpan = $(this.parentNode.parentNode.parentNode.parentNode);
    var currentLocation = "http://pics.fefoo.com/" + escape(location.hash);

    window.open("http://pinterest.com/pin/create/button/?url=" + currentLocation + "&media=" + imageSpan.find(".imgContainer img")[0].src + "&description=" + imageSpan.find(".title > a").text(), 
        "_blank",
        "width=" + w + ",height=" + h+ ",resizable,scrollbars=yes,status=1," + 'top='+top+', left='+left);
}

function showFaceBookFeedUI(imgUrl, locationUrl, desc, span) {

	var submittedBy = $(span).find(".submittedby");
	var category = submittedBy.find("a")[1];
	var comments = $(span).find(".links a")[0];
	
	 FB.ui(
	  {
	   method: 'feed',
	   //message: 'getting educated about Facebook Connect',
	   name: desc,
	   caption: submittedBy.text(),
	 /*  caption: 'The Facebook Connect JavaScript SDK',
		  description: (
		  'A small JavaScript library that allows you to harness ' +
		  'the power of Facebook, bringing the user\'s identity, ' +
		  'social graph and distribution power to your site.'
	   ), 
	*/
	  properties: { "Category" : { "text": $(category).text(), "href": category.href}, "Comments": {"text": $(comments).text(), "href": comments.href}},
	//properties: { "Item1" : { "text": "Title of Item #1", "href": "http://www.mysite.compage.aspx" }, "Item2" : { "text": "Title of Item #2", "href": "http://www.mdsdsysite.compage.aspx" }
	//},
	   link: locationUrl,
	   picture: imgUrl
	   /*,
	   actions: [
			{ name: 'fbrell', link: 'http://www.fbrell.com/' }
	   ],
	  user_message_prompt: 'Share your thoughts about RELL'
	  */
	  }
	  /*,
	  function(response) {
		if (response && response.post_id) {
		  alert('Post was published.');
		} else {
		  console.log('Post was not published.');
		}
	  }
	  */
	);
}
 
function facebook_clicked(event)
{
   // showShareBar(this.getAttribute("data-id"), this.getAttribute("data-title"));
    var span = this.parentNode.parentNode.parentNode.parentNode;
    var img = $(span).find("img")[0];
    
	showFaceBookFeedUI(img.src, img.src, this.getAttribute("data-title"), span);
	/*
	var attachment = { 'name': this.getAttribute("data-title"), 'media': [{ 'type': 'image', 'src': img.src, 'href': img.src}] };
    FB.ui({
        method: 'stream.publish',
        message: 'I just found this Super Cool Website!',
        attachment: attachment,
        user_message_prompt: 'post this to your wall?'
    });
    */
    return false;
}

function showShareBar(id, title)
{
  var shareBar = document.getElementById("shareBar");
  var titleSpan = shareBar.getElementsByTagName("span")[0];
  var buttons = shareBar.getElementsByTagName("span")[1];
  titleSpan.innerHTML = title;
  
  var twitterUrl = "http://platform.twitter.com/widgets/tweet_button.html?url=http://reddit.com/" + id + "&via=fefoo&text=" + title + "&related=fefoo&count=horizontal";
  var facebookUrl = "http://www.facebook.com/plugins/like.php?href=http://reddit.com/" + id + "&layout=button_count&show_faces=false&width=80&action=like&font&colorscheme=light&height=25&api_key=154589504586845";
  buttons.innerHTML = '<iframe height="25" width="110" class="ifrmTwitter" allowtransparency="true" frameborder="0" scrolling="no" src="' + twitterUrl + '"></iframe>' +
                      '<iframe height="25" width="50" class="ifrmFacebook" allowtransparency="true" frameborder="0" scrolling="no" src="' + facebookUrl + '"></iframe>';

  document.getElementById("shareBar").style.display = "block";
}

function getElementsByClassName(oElm, strClassName)
{
    // Check if there is native support.
    if(oElm.getElementsByClassName)
    {
        return oElm.getElementsByClassName(strClassName);
    }
    else
    {
        var strTagName = "*";
        var arrElements = (strTagName == "*" && oElm.all)? oElm.all : 
            oElm.getElementsByTagName(strTagName);
        var arrReturnElements = new Array();
        strClassName = strClassName.replace(/\-/g, "\\-");
        var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
        var oElement;
        for(var i=0; i<arrElements.length; i++)
        {
            oElement = arrElements[i];      
            if(oRegExp.test(oElement.className))
            {
                arrReturnElements.push(oElement);
            }   
        }
        return (arrReturnElements)
    }
}

function setImageResizer(img)
{
    img.className = "cursorPlus";
    img.onclick = function()
    {
        if(img.className == "cursorPlus") img.className = "cursorMinus";
        else img.className = "cursorPlus";
    }
}

// Simple function to check if a URL is an image
function isUrlImage(url)
{
    var extensions = [".png", ".jpg", ".bmp", ".gif", ".jpeg"];
    for(var x = 0; x < extensions.length; x++)
    {
        if(url.length - url.toLowerCase().lastIndexOf(extensions[x]) == extensions[x].length)  return true;
    }
    return false;
}
