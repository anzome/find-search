/**

TODO
- change event onkeyup on a something else
- add signals about situations when plugin does not «true» find 

*/
//declare vars for future assignment into functions 
(function (window, document) {
var inputs = [];
var search_inputs = [];
var search_amount = 0;
var next_input = 0;

function init(){
    //assign vars once on a page load, use it on every event
    inputs = document.getElementsByTagName("input");
    toggle_mousetrap(document.activeElement);
    console.log(inputs);

    if (inputs.length === 0) {
        return false;
    }
    else {
        search_inputs = get_search_inputs(inputs);
        console.log(search_inputs);
        if (search_inputs.length > 0){
            search_amount = search_inputs.length;
            //console.log(search_amount);
            return true;
        }
        else {
            return false;
        }
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

    for (var i = 0, input; i <= inputs.length-1; i++) {
        input = inputs[i];
        if (min_check(input)){
            //element meets the minimal criteria
            preliminary_list.push(input);
        };
    }

    //what if we have several inputs that passing minimal check?
    if (preliminary_list.length > 0) {
        for (var i = 0, input; i <= preliminary_list.length-1; i++){
            input = preliminary_list[i];
            input.parents = node_parents(input);
            if(check(input)){
                search_inputs.push(input);
            }
        }
    };

    // do sorting on search_inputs 
    if (search_inputs.length > 0) {return search_inputs}
    //if we don't find inputs on a page or if all inputs is not for search
    else {return false;}
    
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
    if ((entity.tagName.toLowerCase() === "input") && (entity.type.toLowerCase() !== "text")) {
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
    var find_q = /^q$/i;
    for (var i = 0, one; i <= ones.length - 1; i++){    
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

window.onload = function () {
    if (init()){
        //see mousetrap lib at http://craig.is/killing/mice
        Mousetrap.bind('ctrl+i', function(e, combo){
            console.log(combo);
            search_focus();
        });        
    };
}
})(window, document);
