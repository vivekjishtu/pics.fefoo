// Check for firebug and act accordingly..
if(typeof console == "undefined") 
{
    console = {};
    console.log = function() { };
}

$(document).ready(function()
{
    main();
});

function main()
{
   $.history.init(pageload);
   
   document.getElementById("viewSource").href = "view-source:" + window.location;
   
   document.getElementById("frmSubmit").onsubmit = function()
   {
       $.history.load(document.getElementById("username").value);
       return false;
   }
}

// User clicked on one of the internal links
function pageload(hash) 
{
/*
    var category = hash;
    var query = null;
    if(hash.indexOf("?") != -1)
    {
        category = hash.substring(0, hash.indexOf("?"));
        query = hash.substring(hash.indexOf("?") + 1);
    }
    
    if(category == "") category = subreddits[0];

    paintNavigation(category);
    */
    
    if(hash) loadAboutUser(hash);
    else {
       document.getElementById("page1").style.display = "block";
       document.getElementById("page2").style.display = "none";
       document.getElementById("searching").style.display = "none";
       document.getElementById("username").focus();
    }
}



function proxyGotData(result)
{
    //alert(result.data.created_utc);
    var createdDate = new Date((result.data.created_utc) * 1000);
    //alert(createdDate.toTimeSinceString());
    $("#results").html(createdDate.toTimeSinceString());
    $("#bday").html(createdDate.getUTCMonth() + 1 + "/" + createdDate.getUTCDate() + "/" + createdDate.getFullYear());
    $("#bday1").html(createdDate.toLocaleDateString());
    
}

function loadAboutUser(user, extra)
{
    document.getElementById("page1").style.display = "none";
    document.getElementById("searching").style.display = "block";
    
    var url = "http://www.reddit.com/user/" + user + "/about.json?jsonp=?";
    
    $.jsonp(
    { 
        url: url,
        dataType: "script",
        timeout: 30 * 1000, //30 seconds
        
        // TODO: Better error handling required
        error: function()
        {
            alert("Unable to find information about the user " + user);
            document.getElementById("page1").style.display = "block";
            document.getElementById("page2").style.display = "none";
            document.getElementById("searching").style.display = "none";
            document.getElementById("username").focus();
        },
        
        success: function(response)
        {
            proxyGotData(response);
            document.getElementById("page1").style.display = "none";
            document.getElementById("page2").style.display = "block";
            document.getElementById("searching").style.display = "none";
            console.log("Downloaded file: " +  url);
        },
        dataType: "jsonp",
        callbackParameter: "proxyGotData"
    });
    
}