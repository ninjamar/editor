import { Editor } from "./editor/editor.js";
import dedent from 'https://cdn.jsdelivr.net/npm/dedent@1.5.3/+esm';

/*let contents = btoa(`This div is editable
Another line
This <span style="font-style: italic;">word</span> is already italic
`);*/
let contents = dedent`
    This div is editable
    Another line
    This <span style="font-style: italic;">word</span> is already italic
`;
document.addEventListener("DOMContentLoaded", () => {
    let editor = new Editor(document.querySelector("#editor"), {useTab: true});
    editor.load(btoa(contents));
});