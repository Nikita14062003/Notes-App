const addBtn = document.getElementById('add');

const notes = JSON.parse(localStorage.getItem('notes'));

if (notes) {
    notes.forEach(note => addNewNote(note.text, note.title));
}

addBtn.addEventListener('click', () => {
    const title = prompt('Enter the title of your note:');
    if (title !== null) {
        addNewNote('', title.substring(0,19));
    }
});

function addNewNote(text = '', title = '') {
    const note = document.createElement('div');
    note.classList.add('note');

    note.innerHTML = `
    <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div class="title-bar">${title}</div>
    <div class="main ${text ? "" : "hidden"}"></div>
    <textarea class="${text ? "hidden" : ""}"></textarea>
    `;

    const editBtn = note.querySelector('.edit');
    const deleteBtn = note.querySelector('.delete');
    const main = note.querySelector('.main');
    const textArea = note.querySelector('textarea');
    const titleBar = note.querySelector('.title-bar');

    textArea.value = text;
    main.innerHTML = marked(text);

    deleteBtn.addEventListener('click', () => {
        note.remove();
        update();
    });

    editBtn.addEventListener('click', () => {
        // Close all other notes
        document.querySelectorAll('.note').forEach(n => {
            if (n !== note) {
                n.querySelector('.main').classList.remove('hidden');
                n.querySelector('textarea').classList.add('hidden');
                n.querySelector('.title-bar').classList.add('hidden');
            }
        });

        // Toggle the current note
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
        titleBar.classList.toggle('hidden');
    });

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);
        update();
    });

    document.body.appendChild(note);
    update();  // Save the note to localStorage immediately after creation
}

function update() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const text = note.querySelector('textarea').value;
        const title = note.querySelector('.title-bar').innerText;
        notes.push({ text, title });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}
