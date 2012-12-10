/**

TODO
- change event onkeyup on a something else
- add signals about situations when plugin does not «true» find 

*/
//declare vars for future assignment into functions 
(function ($) {
var inputs = [];
var search_inputs = [];
var backup_inputs = [];
var search_amount = 0;
var next_input = 0;

function init(){
    //assign vars once on a page load, use it on every event
    inputs = document.getElementsByTagName("input");
    toggle_mousetrap(document.activeElement);
    if (inputs.length === 0) {
        return false;
    }
    else {
        get_search_inputs(inputs);
        if (search_inputs.length === 0 && backup_inputs.length > 0){
            search_inputs = backup_inputs
        }
        search_amount = search_inputs.length;
    };
}

function toggle_mousetrap(element){
    if (element.tagName.toLowerCase() === "input"){
        mouse_re = / mousetrap/i
        if (mouse_re.test(element.className)){
            element.className.replace(mouse_re, "");
        }
        else {
            element.setAttribute("class", element.className + " mousetrap");
        };
    };   
}

function get_search_inputs(inputs){
    var preliminary_list = [];
    var weight = 0;
    var parents;

    for (var i = 0, input; i < inputs.length; i++) {
        input = inputs[i];
        if (min_check(input)){
            //element meets the minimal criteria
            preliminary_list.push(input);
        };
    }

    //what if we have several inputs that passing minimal check?
    if (preliminary_list.length > 0) {
        for (var i = 0, input; i < preliminary_list.length; i++){
            input = preliminary_list[i];
            input.parents = node_parents(input);
            if(check(input)){
                search_inputs.push(input);
            }
        }
        if (search_inputs.length === 0){
            for (var i = 0, input; i < preliminary_list.length; i++){
                backup_inputs.push(preliminary_list[i]);
            }
        }
    }    
}

function node_parents(node){
    var list = [];
    //recursion returns all parents
    function get_parent(node) {
        var parent = node.parentNode;
        if (parent.tagName.toLowerCase() !== ("body" || "html")){
            list.push(parent);
            get_parent(parent);
        };
    };
    get_parent(node);
    return list;
}

function min_check(entity) {
    // if we got not text input elements
    if ((entity.type.toLowerCase() !== "text") || entity.style.display === "none") {
        return false;
    }
    else {
        return true;
    }
}

function check(entity){
    //makes full list of elements that we want to check (input itself and parents)
    var ones = entity.parents;
    ones.unshift(entity);
    //checks everyone element in our list
    var find_search = /search/i;
    var find_nav = /nav/i;
    var find_q = /^q$/i;
    for (var i = 0, one; i < ones.length; i++){    
        one = ones[i];       
        if (find_q.test(one.id) || find_search.test(one.id)) {
            return true;
        }
        else if (find_search.test(one.name)) {
            return true;
        }
        else if (find_search.test(one.className)) {
            return true;
        }
        else if (i > 0){
            if (find_nav.test(one.id)){
                return true;
            }
            else if (find_nav.test(one.name)) {
                return true;
            }
            else if (find_nav.test(one.className)) {
                return true;
            }
        }     
    }
    //if no item fits 
    return false;
}

function search_focus(){
    if (next_input > search_amount-1){
        next_input = 0;
    };
    if(search_inputs[next_input]){
        //remove class mousetrap from input
        toggle_mousetrap(document.activeElement);
        search_inputs[next_input].focus();
        //add class mousetrap on the new input
        toggle_mousetrap(search_inputs[next_input])
        next_input++;
    }
    else {};
}

$(document).ready(function () {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36942724-1']);
    _gaq.push(['_trackPageview']);    

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    init();
    if (search_inputs.length > 0){
        //see mousetrap lib at http://craig.is/killing/mice
        _gaq.push(['_trackEvent', 'good', 'track', 'find the search', document.URL]);
        Mousetrap.bind('ctrl+i', function(e, combo){
            search_focus();
        });        
    }
    else {
        _gaq.push(['_trackEvent', 'bad', 'track', 'not find the search', document.URL]);
    }
});



})(jQuery);
