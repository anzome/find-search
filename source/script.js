/**

TODO
- hightlight text in input when focusing on it
- block posibility to remove current text in the input by next pushing hotkey
- show nice message if there is no search inputs
- change event onkeyup on a something else
- add signals about situations when plugin does not «true» find 


*/
//declare vars for future assignment into functions 
(function ($) {
"use strict";
var inputs = [];
var search_inputs = [];
var backup_inputs = [];
var search_amount = 0;
var next_input = 0;

function init(){
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
        var mouse_re = / mousetrap/i;

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

    for (var i = 0, input, len = inputs.length; i < len; i++) {
        input = inputs[i];
        if (min_check(input)){
            //element meets the minimal criteria
            preliminary_list.push(input);
        };
    }

    //what if we have several inputs that passing minimal check?
    if (preliminary_list.length > 0) {
        for (var i = 0, input, len = preliminary_list.length; i < len; i++){
            input = preliminary_list[i];
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
    var input_type = entity.type.toLowerCase()
    if ((input_type === "text" || input_type === "search") && entity.style.display !== "none") {
        return true;
    }
    else {
        return false;
    }
}

function check(entity){
    //makes full list of elements that we want to check (input itself and parents)
    // var ones = entity.parents;
    // ones.unshift(entity);
    //checks everyone element in our list
    var find_search = /search/i,
        find_nav = /nav/i,
        find_q = /^q$/i;

    var check_rules = function(one, parent){
        // this element is parent?
        if (typeof parent === 'undefined' || parent !== true){
            parent = false;
        }

        if (!parent){
            // if we check input
            if (one.type.toLowerCase() === "search"){
                return true;
            }
            else if (find_q.test(one.id) || find_search.test(one.id)) {
                return true;
            }
            else if (find_search.test(one.name)) {
                return true;
            }
            else if (find_search.test(one.className)) {
                return true;
            }            
            else if (find_search.test(one.placeholder)){
                return true;
            }
        }
        
        else {
            // if we check one of input's parents
            if (find_nav.test(one.id)){
                return true;
            }
            else if (find_nav.test(one.name)) {
                return true;
            }
            else if (find_nav.test(one.className)) {
                return true;
            }
            else if (find_nav.test(one.action) || find_q.test(one.action)){
                return true;
            }
        }
        // if no one condition didn't work
        return false;
    };

    var check_parents = function(node){
        var parent = node.parentNode,
            parent_name = parent.tagName.toLowerCase();
        
        if (parent_name !== ("body" || "html")){
            if (check_rules(node, true)){
                return true;
            }
            check_parents(parent);
        }
        // parents are bad too
        return false;
    }

    if (check_rules(entity)){
        return true;
    }
    else {
        return check_parents(entity);
    }

    //if no item fits 
    return false;
}

function search_focus(){
    if (next_input > search_amount-1){
        next_input = 0;
    };
    if (search_inputs[next_input]){
        //remove class mousetrap from input
        toggle_mousetrap(document.activeElement);
        search_inputs[next_input].focus();
        //add class mousetrap on the new input
        toggle_mousetrap(search_inputs[next_input]);
        next_input++;
    }
    else {
        //TODO: here must be exceprtion handler
    };
}

// The jQuery implementention of ready event is common and works across all browsers. 
$(document).ready(function () {
    init();
    if (search_inputs.length > 0){
        //see mousetrap lib at http://craig.is/killing/mice        
        Mousetrap.bind('ctrl+i', function(e, combo){
            search_focus();
        });        
    };
    if (search_inputs.length > 0 && search_inputs !== backup_inputs){
        chrome.extension.sendMessage({ga_category: "good", ga_action:"find search", ga_label: document.URL }, function(response) {});
    }
    else if (backup_inputs.length > 0) {
        chrome.extension.sendMessage({ga_category: "bad", ga_action:"didn't find search", ga_label: document.URL }, function(response) {});
    };
});



})(jQuery);
