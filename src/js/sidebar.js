// This file manages the sidebar component, including file navigation, project structure display, and interaction with the editor.

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const fileList = sidebar.querySelector('.file-list');
    const editor = document.getElementById('editor');

    // Sample project structure
    const projectStructure = [
        { name: 'src', type: 'folder', children: [
            { name: 'js', type: 'folder', children: [
                { name: 'app.js', type: 'file' },
                { name: 'editor.js', type: 'file' },
                { name: 'sidebar.js', type: 'file' },
                { name: 'terminal.js', type: 'file' }
            ]},
            { name: 'css', type: 'folder', children: [
                { name: 'main.css', type: 'file' },
                { name: 'themes', type: 'folder', children: [
                    { name: 'dark.css', type: 'file' },
                    { name: 'light.css', type: 'file' }
                ]},
                { name: 'components', type: 'folder', children: [
                    { name: 'sidebar.css', type: 'file' },
                    { name: 'editor.css', type: 'file' },
                    { name: 'terminal.css', type: 'file' }
                ]}
            ]},
            { name: 'components', type: 'folder', children: [
                { name: 'sidebar.html', type: 'file' },
                { name: 'editor.html', type: 'file' },
                { name: 'terminal.html', type: 'file' }
            ]}
        ],
        { name: 'index.html', type: 'file' },
        { name: 'favicon.svg', type: 'file' },
        { name: 'README.md', type: 'file' }
    ];

    function createFileList(structure, parentElement) {
        structure.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name;

            if (item.type === 'folder') {
                listItem.classList.add('folder');
                const subList = document.createElement('ul');
                createFileList(item.children, subList);
                listItem.appendChild(subList);
            } else {
                listItem.classList.add('file');
                listItem.addEventListener('click', () => {
                    loadFile(item.name);
                });
            }

            parentElement.appendChild(listItem);
        });
    }

    function loadFile(fileName) {
        // Logic to load the file content into the editor
        editor.value = `Loading content of ${fileName}...`;
    }

    createFileList(projectStructure, fileList);
});