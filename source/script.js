/**

TODO
- change event onkeyup on a something else
- add signals about situations when plugin does not «true» find 

*/
//declare vars for future assignment into functions 
(function (){
var inputs = [];
var next_input = 0;

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



//TODO: remove duplication from tests  
function is_text_input(){
    return {
        "type": "exclude",
        "test": function (entity){
            if (entity.type !== undefined && entity.type.toLowerCase() === "text"){
                return true;
            }
            else {
                return false;
            }
        }
    }   
}

function have_q(){
    var find_q = /^q$/i;
    return {
        "type": "simple",
        "test": function(entity){
            var tests = [
                find_q.test(entity.id),
                find_q.test(entity.className),
                find_q.test(entity.name)
            ]
            for (var i = 0, length = tests.length; i < length; i++){
                if (tests[i] === true) { return true; } 
            }
            return false;
        }
    }    
}

function have_search(){
    var find_search = /search/i;
    return {
        "type": "simple",
        "test": function (entity){
            var tests = [
                find_search.test(entity.id),
                find_search.test(entity.className),
                find_search.test(entity.name)
            ]
            for (var i = 0, length = tests.length; i < length; i++){
                if (tests[i] === true) { return true; } 
            }

            return false;
        }
    }    
}

function in_navbar(){
    var find_nav = /nav/i;
    return {
        "type": "simple",
        "test": function (entity){
            var tests = [
                find_nav.test(entity.id),
                find_nav.test(entity.className),
                find_nav.test(entity.name)
            ]
            for (var i = 0, length = tests.length; i < length; i++){
                if (tests[i] === true) { return true; } 
            }

            return false;
        }
    }   
}

function clearing (){
    return {
        "type": "exclude",
        "test": function (entity){
            if (entity.is_search === true){
                return true;
            }
            else {
                return false;
            }
        }
    }    
}

function init(){
    //assign vars once on a page load, use it on every event
    var raw_inputs = document.getElementsByTagName("input");
    //puts elements in js array
    for (var i = 0, len = inputs.length = raw_inputs.length; i < len; i++) {
        inputs[i] = raw_inputs[i];
    }
    
    
    //this for mousetrap lib that not fireing if some text field is focused
    //this add special class to that active element
    toggle_mousetrap(document.activeElement);

    //FIX: ugly code, I should beatify it
    //1
    if (inputs.length > 0){
        inputs = check_list(inputs, is_text_input()); //takes result of the function
        console.log(inputs.length);
    };
    //2
    if (inputs.length > 0){
        inputs = check_list(inputs, have_q());
        console.log(inputs.length);
    };
    //3
    if (inputs.length > 0){
        inputs = check_list(inputs, have_search());
        console.log(inputs.length);
    };

    //finds parents and adds them to inputs.no[n].parents 
    if (inputs.length > 0){
        for (var j = 0; j < inputs.length; j++){
            inputs[j].parents = node_parents(inputs[j]);
        }
    }
    //4
    if (inputs.length > 0){
        inputs = check_list(inputs, have_search(), true);
        console.log(inputs.length);
    };
    //5
    if (inputs.length > 0){
        inputs = check_list(inputs, in_navbar(), true);
        console.log(inputs.length);
    };

    //6
    if (inputs.length > 0){
        inputs = check_list(inputs, clearing());
        console.log(inputs.length);
    };
    if (inputs.length > 0){
        console.log("here");
        return true;
    }
    else {
        console.log("there");
        return false;
    }
}

function check_list(inputs, check_function, parents){
    /*
    function produce all tests I want to make
    */
    if (parents === undefined || parents !== true) {parents = false}; //default value
    var type = check_function.type;

    var temp = [];
    console.log(inputs);
    while (inputs.length !== 0){
        var elem = inputs.pop();
        if (parents === true && elem.is_search === undefined){
            list = elem.parents;
            for (var j = 0; j < list.length; j++) {
                if (check_function.test(list[j])){
                    if (type === "simple"){
                        elem.is_search = true;
                    }
                    temp.push(elem); 
                    break;
                }
            }
            //if no one parent have search in attributes
            if (type === "simple"){
                temp.push(elem);
            }
        }
        else if (parents === false) {
            if (check_function.test(elem)){
                if (type === "simple"){
                    elem.is_search = true;
                }
                temp.push(elem);
            }
            else if (type === "simple") {
                temp.push(elem);
            }
        }
    }
    return temp;
}

function search_focus(){
    if (next_input > inputs.length-1){
        next_input = 0;
    };
    if(inputs[next_input]){
        //remove class mousetrap from input
        toggle_mousetrap(document.activeElement);
        inputs[next_input].focus();
        //add class mousetrap on the new input
        toggle_mousetrap(inputs[next_input])
        next_input++;
    }
    //FIX: why it is here?
    else {};
}

$(document).ready(function () {
    if (init()){
        //see mousetrap lib at http://craig.is/killing/mice
        Mousetrap.bind('ctrl+i', function(e, combo){
            console.log(combo);
            search_focus();
        });        
    };
});

})();