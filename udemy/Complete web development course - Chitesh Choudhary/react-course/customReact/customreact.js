function mainContainer(reactElement, container) {
    const domElement = document.createElement(reactElement.type);
    domElement.innerHTML = reactElement.children;
    for (const prop in reactElement.props) {
        domElement.setAttribute(prop, reactElement.props[prop]);
    }
    container.appendChild(domElement);
}


const react_element = {
    type: 'a',
        props: {
        href: "https://google.com",
        target: "_blank"
    },
    children: 'Click me to visit google'
}

const root = document.getElementById('root')

customRender(react_element, root)