import { objectEquals } from "./utils.js";

// TODO: Use a dataclass for this
/**
 * Create options from default parameters
 * 
 * @typedef {object} Option
 * 
 * @param {object} [{tagName = null, props = {}, name = null, value = null}={}] - The default parameters
 * @return {Option} The created object
 */
export function Option({tagName = null, props = {}, name = null, value = null} = {}){
    return {
        tagName: tagName,
        props : props,
        css: {
            name: name,
            value: value
        },
    };
}
/**
 * Turn an option into an html element
 *
 * @param {Option} option - The option to compute
 * @param {string} [text] - Optional text
 * @return {HTMLElement} The computed element
 */
export function computeOption(option, text){
    let element;
    if (option.tagName){ // If style
        element = document.createElement(option.tagName);
    } else {
        element = document.createElement("SPAN");
        element.style[option.css.name] = option.css.value;
    }
    if (text){
        element.textContent = text;
    }
    return element;
}

/**
 * Generate a list of options from an element
 *
 * @param {HTMLElement} child - An element to generate options from
 * @return {Array.<Option>} A list of options
 */
function createOptionsFromChild(child){
    let ret = [];
    let curr = child;

    while (curr){
        ret.push(curr)
        curr = curr.firstElementChild;
    }
    ret = ret.map(x => {
        // Properties would have to be changed here
        if (x.style.length > 0){
            // TODO: Won't work for when there are more than one styles
            // Get the first style, then get the value for it
            return Option({ name: x.style[0], value: x.style[x.style[0]]});
        }
        return Option({tagName: x.tagName});
    });
    return ret;
}
/**
 * Toggle an option
 *
 * @param {Array.<Option>} childOptions - An array of options
 * @param {Option} currOption - The option to toggle
 * @return {Array.<Option>}
 */
function toggleOption(childOptions, currOption){
    // if currOption is inside child options
    // Array.contains doesn't work for objects
    if (childOptions.some(x => objectEquals(x, currOption))){
        // Remove all references to the object
        childOptions = childOptions.filter(x => !objectEquals(x, currOption));
    } else {
        // Add the current option to the array
        childOptions.push(currOption);
    }
    return childOptions;
}
/**
 * Recursively compute every option from an array
 *
 * @param {Array.<Option>} options - A list of options
 * @param {string} text - Text of element
 * @return {HTMLElement} 
 */
function computeAll(options, text){
    // [a, b, c] -> a.b.c
    if (options.length > 0){
        let ret = computeOption(options[0]);
        let curr = ret;
        let elem;

        for (let option of options.slice(1)){ // We have already computed the first item
            elem = computeOption(option);
            curr = curr.appendChild(elem);    
        }
        curr.appendChild(document.createTextNode(text));
        return ret;

    }
    return computeOption(Option({tagName: "SPAN"}), text);
}

/**
 * Toggle a style on an element
 * 
 * This function can be called with either 1 or 2 arguments
 * TODO: Use object destructuring here
 *
 * @param {string} [tagName] - The tag to toggle
 * 
 * @param {string} [rule] - The rule to toggle
 * @param {string} [value] - The value for the rule
 */
export function toggleStyle(){
    /* 
        Replacement for document exec command
        if contents.firstElementChild

            For every child of contents.children[0]
                add element name to array

            If the current style isn't in this array, add it
            If current style is in this array, remove it
            Create a new element from this array
        else
            Create a new element with only style
    */

    let currOption;
    if (arguments.length == 1){
        currOption = Option({tagName: arguments[0]})
    } else if (arguments.length == 2){
        currOption = Option({ name: arguments[0], value: arguments[1] })
    } else {
        throw new Error("Need 1 or 2 arguments");
    }
    
    let range = window.getSelection().getRangeAt(0);   
    let contents = range.extractContents();
    let newContents;

    if (contents.firstElementChild){
        let childOptions = createOptionsFromChild(contents.firstElementChild);
        let filteredChildren = toggleOption(childOptions, currOption);
        newContents = computeAll(filteredChildren, contents.textContent);

    } else {
        newContents = computeOption(currOption, contents.textContent);
    }
    
    range.insertNode(newContents);
}