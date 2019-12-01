/* Firebase */
const config = {}; // config and credentials for firebase
firebase.initializeApp(config);

const database = firebase.database();
load();

function load() {
    const ref = database.ref('notes');
    ref.on('value', success, error);
}

function save() {
    const noteTitleValue = noteTitleDialogTextfield.value;
    const noteTextValue = noteTextDialogTextfield.value;

    const note = {
        title: noteTitleValue,
        note: noteTextValue
    };

    const ref = database.ref('notes');
    ref.push(note);
}

function remove(key) {
    const ref = database.ref('notes');
    ref.child(key).remove();
}

function success(data) {
    refreshCard();
    const notes = data.val();
    if (notes !== null) {
        const keys = Object.keys(notes);
        keys.forEach(key => {
            const noteTitle = notes[key].title;
            const noteText = notes[key].note;
            createCard(noteTitle, noteText, key);
        });
    }
    document.querySelector('#spinner').remove();
}

function error(error) {
    console.log(error);
}


/* Dialog */
const dialog = document.querySelector('dialog');
const openDialogButton = document.querySelector('#show-dialog');
const saveDialogButton = document.querySelector('#save');
const closeDialogButton = document.querySelector('.close');

const noteTitleDialogTextfield = document.querySelector('#noteTitle');
const noteTextDialogTextfield = document.querySelector('#noteText');

openDialogButton.addEventListener('click', () => {
    dialog.showModal();
});

saveDialogButton.addEventListener('click', () => {
    save();
    noteTitleDialogTextfield.value = '';
    noteTextDialogTextfield.value = '';
    dialog.close();
});

closeDialogButton.addEventListener('click', () => {
    dialog.close();
});

if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}


/* Card Component */
const content = document.querySelector('.page-content');

function createCard(title, note, key) {
    const cardElement = document.createElement('div');
    const cardTitle = document.createElement('div');
    const cardText = document.createElement('div');
    const cardMenu = document.createElement('div');

    const cardTitleText = document.createElement('h2');
    const cardMenuButton = document.createElement('button');

    cardElement.className = 'note mdl-card mdl-shadow--2dp';
    cardTitle.className = 'mdl-card__title';
    cardText.className = 'mdl-card__supporting-text';
    cardMenu.className = 'mdl-card__menu';

    cardTitleText.className = 'mdl-card__title-text';
    cardMenuButton.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect';

    cardTitleText.innerHTML = title;
    cardText.innerHTML = note;

    content.appendChild(cardElement);
    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardText);
    cardElement.appendChild(cardMenu);

    cardTitle.appendChild(cardTitleText);
    cardMenu.appendChild(cardMenuButton);
    cardMenuButton.innerHTML = '<i class="material-icons" id=' + key + '>delete</i>';

    cardMenuButton.addEventListener('click', event => {
        remove(event.target.id);
    });
}

function refreshCard() {
    const cards = document.querySelectorAll('.note');
    for (let i = 0; i < cards.length; ++i) {
        content.removeChild(cards[i]);
    }
}