/**

TODO
- change event onkeyup on a something else
- add signals about situations when plugin does not «true» find 

*/
//declare vars for future assignment into functions 
(function(window, document){
var inputs = [];
var trash = [];
var next_input = 0;

function init(){
    //assign vars once on a page load, use it on every event
    inputs = document.getElementsByTagName("input");
    
    //this for mousetrap lib that not fireing if some text field is focused
    //this add special class to that active element
    toggle_mousetrap(document.activeElement);

    //FIX: ugly code, I should beatify it
    //1
    if (inputs.length > 0){
        is_text_input.exclude = true; //stupid croocked-nail
        inputs = check_list(inputs, is_text_input);
    };
    //2
    if (inputs.length > 0){
        console.log(2);
        inputs = check_list(inputs, have_q_index);
    };
    //3
    if (inputs.length > 0){
        console.log(3);          
        inputs = check_list(inputs, have_search);
    };
    //finds parents and adds them to inputs.no[n].parents 
    if (inputs.length === 0){
        for (var j = 0; j < inputs.no.length; j++){
            inputs.no[j].parents = node_parents(inputs.no[j]);
        }
    }
    //4
    if (inputs.yes.length === 0){
        console.log(4);
        inputs = check_list(inputs, have_search, true);
    };
    //5
    if (inputs.yes.length === 0){
        console.log(5);
        inputs = check_list(inputs, is_navbar, true);
    };
    console.log("--> yes: ", inputs.yes);
    console.log("--> no: ", inputs.no);
    if (inputs.yes.length > 0){
        console.log(true);
        return true;
    }
    else {
        console.log(false);
        return false;
    }
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

function is_text_input(entity){
    if (entity.type.toLowerCase() === "text"){
        return true;
    }
    else {
        return false;
    }
}

function have_q_index(entity){
    var find_q = /^q$/i;
    if (find_q.test(entity.id)){
        return true;
    }
    else {
        return false;
    }
}

function have_search(entity){
    var find_search = /search/i;
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

function is_navbar(entity){
    var find_nav = /[^\w]nav[^\w]/i;
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

function is_search (){
    return {
        type: "exclude",
        test: function (entity){
            if (entity.is_search === true){
                return true;
            }
            else {
                return false;
            }
        }
    }    
}

function check_list(inputs, check_function, parents){
    var temp = [];
    var exclude = check_function.exclude;
    //default value
    if(parents === undefined) {parents = false};
    if(exclude === undefined) {exclude = false};

    //FIX: add inputs.filter() here
    if (parents === false){
        for (var i = 0; i < inputs.yes.length; i++){
            if (check_function(inputs.yes[i])) {
                temp.push(inputs.yes[i]);
            }
            else {
                if (exclude === false) {
                    inputs.no.push(inputs.yes[i]);
                }
            }
        }
    }
    
    else if (parents === true) {
        if (inputs.no.length > 0){
            for (var i = 0; i < inputs.no.length; i++){
                parents = inputs.no[i].parents;
                for (var j = 0; j < parents.length; j++) {
                    if (check_function(parents[j])){
                        temp.push(inputs.no[i]);
                    }
                } 
            }
        }
    }
    inputs.yes = temp;

    return inputs;
}

function search_focus(){
    if (next_input > inputs.yes.lenght-1){
        next_input = 0;
    };
    if(inputs.yes[next_input]){
        //remove class mousetrap from input
        toggle_mousetrap(document.activeElement);
        inputs.yes[next_input].focus();
        //add class mousetrap on the new input
        toggle_mousetrap(inputs.yes[next_input])
        next_input++;
    }
    //FIX: why it is here?
    else {};
}

window.onload = function () {
    console.log(inputs.yes);
    if (init()){
        //see mousetrap lib at http://craig.is/killing/mice
        Mousetrap.bind('ctrl+i', function(e, combo){
            console.log(combo);
            search_focus();
        });        
    };
}

})(window, document);