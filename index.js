const editId = document.getElementById("editId");
const editTitre = document.getElementById("editTitre");
const editDateDebut = document.getElementById("editDateDebut");
const editDateFin = document.getElementById("editDateFin");
const editDescription = document.getElementById("editDescription");

const fileInput = document.getElementById("fileInput");
// Ajoutez un gestionnaire d'événements pour le bouton "Enregistrer"
// Ajoutez un gestionnaire d'événements pour le formulaire
const form = document.querySelector('form');  // Sélectionnez le formulaire par son balisage <form>


form.addEventListener('submit', function (e) {
  e.preventDefault()
  // Récupérez les valeurs des champs d'édition
  // e.preventDefault()
  const editedId = editId.value;
  const editedTitre = editTitre.value;
  const editedDateDebut = editDateDebut.value;
  const editedDateFin = editDateFin.value;
  const editedDescription = editDescription.innerHTML;

  // Récupérez les données du sessionStorage
  const jsonData = JSON.parse(sessionStorage.getItem('jsonData'));

  // Parcourez les données pour trouver et mettre à jour l'élément approprié
  jsonData.forEach(function (item) {

    if (item.id === parseInt(editedId)) {
      item.titre = editedTitre;
      item.dateDebut = editedDateDebut;
      item.dateFin = editedDateFin;
      item.description = editedDescription;
    }
  });

  // Mettez à jour le sessionStorage avec les données mises à jour
  sessionStorage.setItem('jsonData', JSON.stringify(jsonData));

  displayData()
  form.reset();
  editDescription.textContent = ""
})

addEventListener('load', () => {
  const table = document.getElementById('jsonData');
  if (sessionStorage.getItem('jsonData')) {

    setTimeout(() => {
      fileInput.value = '';
      displayData()
      // table.classList.remove('none')
    }, 2000);


  } else {
    // table.classList.add('none')
  }

  // form.reset()
})

// Gestionnaire d'événement pour le champ d'entrée de fichier
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFile(file);

  if (sessionStorage.getItem('jsonData')) {
    handleFile(file);
  }
});


function handleFile(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const jsonContent = event.target.result;

    try {
      const jsonData = JSON.parse(jsonContent);
      // Vérifie si des données existent déjà dans le session storage
      if (sessionStorage.getItem('jsonData')) {
        // Si des données existent, remplacez-les
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        displayData();
      } else {
        // Si aucune donnée n'existe, créez une nouvelle entrée
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        displayData();

        setTimeout(() => {
          fileInput.value = '';
        }, 1000);
      }
    } catch (error) {
      alert('Le fichier n\'est pas au format JSON valide.');
    }
  };

  reader.readAsText(file);
}



function displayData() {
  // Sélectionnez le tbody
  const tbody = document.querySelector('#jsonData tbody');

  // Effacez le contenu actuel du tbody
  tbody.innerHTML = '';

  const jsonDataString = sessionStorage.getItem('jsonData');

  if (jsonDataString) {
    const data = JSON.parse(jsonDataString);

    data.forEach(function (item) {
      const row = tbody.insertRow();
      row.insertCell(0).textContent = item.id;
      row.insertCell(1).textContent = item.titre;
      row.insertCell(2).textContent = item.dateDebut;
      row.insertCell(3).textContent = item.dateFin;

      // Utilisez innerHTML pour interpréter le contenu HTML
      const descriptionCell = row.insertCell(4);
      descriptionCell.innerHTML = item.description;

      // Colonne "Action" avec le bouton "Modifier"
      const actionCell = row.insertCell(5);
      const actionD = row.insertCell(6);


      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');

      editButton.textContent = 'Modifier';
      deleteButton.textContent = 'Supprimer';

      editButton.addEventListener('click', function () {
        openEditPopup(item);
      });

      deleteButton.addEventListener('click', function () {
        deleteItem(item.id); // Appel de la fonction de suppression
      });

      actionCell.appendChild(editButton);
      actionD.appendChild(deleteButton);
    });
  } else {
    alert('Aucune donnée JSON n\'est stockée en session.');
  }
}

// Fonction pour supprimer un élément par ID
function deleteItem(id) {
  const jsonDataString = sessionStorage.getItem('jsonData');

  if (jsonDataString) {
    const data = JSON.parse(jsonDataString);

    // Recherche de l'indice de l'élément à supprimer dans le tableau
    const index = data.findIndex(item => item.id === id);

    if (index !== -1) {
      data.splice(index, 1); // Suppression de l'élément du tableau

      // Mettre à jour le stockage de session avec les données mises à jour
      sessionStorage.setItem('jsonData', JSON.stringify(data));

      // Mettre à jour le tableau HTML
      displayData();
    }
  }
}

cancelEditButton.addEventListener('click', function (event) {
  event.preventDefault(); // Empêche la soumission du formulaire
  // Réinitialisez les valeurs du formulaire aux valeurs d'origine
  editId.value = "";
  editTitre.value = "";
  editDateDebut.value = "";
  editDateFin.value = "";
  editDescription.innerHTML = "";

  // Vous pouvez également masquer le formulaire si nécessaire
  // Par exemple, si vous avez un élément avec une classe 'hidden', vous pouvez le cacher ainsi :
  // editPopup.classList.add('hidden');
});


function openEditPopup(data) {
  // Code pour afficher un popup avec les données du formulaire
  // Vous pouvez créer un élément de formulaire et remplir les champs avec les données passées
  // et afficher le popup à l'aide de CSS ou JavaScript

  editId.value = data.id;
  editTitre.value = data.titre;
  editDateDebut.value = data.dateDebut;
  editDateFin.value = data.dateFin;
  editDescription.innerHTML = data.description;
}