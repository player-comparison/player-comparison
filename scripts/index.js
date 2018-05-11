function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        

        // orrysean wrote this
        // converting this forloop into a while loop for better speed
        // this website shows us that while loops are faster than for loops for some array operations
        // https://jsperf.com/new-array-vs-splice-vs-slice/31
        // https://jsperf.com/fastest-array-loops-in-javascript/57
        
        let x = arr.length;
        
        while ( x-- ) {
        let y = arr.length - x;     
         
        /*for each item in the array...*/
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[y][2].toUpperCase().includes(val.toUpperCase())) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                
                // orrysean converted this ti ES6 template literal. Ryan said leave it ugly. 
                b.innerHTML = `<strong>${arr[y][2].substr(0, val.length)}</strong>${arr[y][2].substr(val.length)}<input type='hidden' value='${arr[y][2]}'>`;
                
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
} 



////////////////


const nba = {};

// const playa = nba.playersAll = function(players) {
// }

// let playerList;

// getPlayerList includes player names and player ID
nba.getPlayerList = function() {
    return $.ajax({
        url: 'http://stats.nba.com/stats/commonallplayers/?IsOnlyCurrentSeason=0&LeagueID=00&Season=2017-18',
        dataType: 'jsonp',
        method: 'GET'
    })
    .then((results) => {
        return results.resultSets[0].rowSet;
    });
};

nba.autoCompleteNames = (originalList) => {
    // const countries = [];
    // let i = originalList.length;
    // console.log(originalList);
    // while (i--) {
    //     countries[i] = originalList[i][2];
    //     console.log(countries[i]);
    // }
    
}

nba.init = async function() {
    const playerList = await nba.getPlayerList();
    // console.log(playerList);
    nba.autoCompleteNames(playerList);
    autocomplete(document.getElementById("myInput"), playerList);
};

// Document Ready
$(function(){
    nba.init();
});




