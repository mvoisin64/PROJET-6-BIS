

const token = localStorage.getItem("token")
if (token) {
  const logintext = document.getElementById("logintext")
  document.querySelector(".edition-mod").style.display = "flex"

  logintext.innerText = "logout"
  logintext.href = "javascript:logoutUser();"



}

// deconnexion de l'utilisateur
function logoutUser() {
  // Supprimer le token de l'utilisateur (remplacez "token" par le nom de votre variable de token)
  localStorage.removeItem('token');
  // Rediriger vers la page de connexion ou effectuer d'autres actions nécessaires
  window.location.href = 'index.html'; // Remplacez 'page_de_connexion.html' par l'URL de votre page de connexion
}
// Ajouter un gestionnaire d'événements au clic du bouton de déconnexion
logintext.addEventListener('click', logoutUser);




let works = []
fetch("http://localhost:5678/api/works")
  .then(response => {
    if (!response.ok) {
      throw new Error('La requête a échoué');
    }
    return response.json();
  })
  .then(data => {
    // Utiliser les données récupérées
// Afficher les données dans la console par exemple
    works = data


    for (let i = 0; i < data.length; i++) {

      let figure = document.createElement("figure")
      figure.id = data[i].id
      let img = document.createElement("img")
      img.src = data[i].imageUrl
      img.alt = data[i].title
      figure.appendChild(img)

      let title = document.createElement("figcaption")
      title.innerText = data[i].title
      figure.appendChild(title)
      document.querySelector(".gallery").appendChild(figure)


      // MODAL DISPLAY WORKS
      AddWorkModal(data[i])
      // ajout les "figures" à cette div avec AppendChild


    }


  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données :', error);
  });



// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
// [0]==> recupere le premier element qui possede la classe ".close"

// When the user clicks on the button, open the modal
btn.addEventListener("click", function () {
  modal.style.display = "block"
})




// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// RECUPERATION DES CATEGORIES//
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())

  .then(data => {
    console.log(data)
    // splice() m'a permis d'ajouter la catégorie "Tous"
    data.splice(0, 0, { name: "Tous" }) 
    for (let i = 0; i < data.length; i++) {
      let button = document.createElement("button")
      button.innerText = data[i].name
      let catId = data[i].id
      let namelist = data[i].name
      document.getElementById("navsecondaire").appendChild(button)

      // Ici, j'ai crée ma liste déroulante pour le contenu de la modale 2
      const optioncat = document.getElementById("option" + (i + 1))
      optioncat.value = data[i].id
      optioncat.innerText = data[i].name

      button.addEventListener("click", function () {
        // Sélectionne tous les boutons
        const boutons = document.querySelectorAll('button');
        // je parcours à nouveau tous les boutons
        boutons.forEach(otherButton => {
          // Supprime la classe 'highlight' de tous les boutons sauf celui cliqué
          if (otherButton !== button) {
            otherButton.classList.remove('buttonhighlight');
          }
        });
        // Ajoute la classe 'highlight' au bouton cliqué
        button.classList.add('buttonhighlight');



        // recuperation des works et affichages de ceux-ci selon leurs categories 
        fetch("http://localhost:5678/api/works")
          .then(response => {
            if (!response.ok) {
              throw new Error('La requête a échoué');
            }
            return response.json();
          })
          .then(data => {
            // Utiliser les données récupérées
            console.log(data);

            document.querySelector(".gallery").innerHTML = ''
            for (let i = 0; i < data.length; i++) {
              let catIdworks = data[i].categoryId
              if (catId == catIdworks || namelist == 'Tous') {
                let figure = document.createElement("figure")
                figure.id = data[i].id
                let img = document.createElement("img")
                img.src = data[i].imageUrl
                img.alt = data[i].title
                figure.appendChild(img)

                let title = document.createElement("figcaption")
                title.innerText = data[i].title
                figure.appendChild(title)
                document.querySelector(".gallery").appendChild(figure)
              }



            }
          })
          .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données :', error);
          });

      })

    }


  })



//  ---------------------------------------------------------
//  | Management of the "modify" button => Online / Offline |
//  ---------------------------------------------------------

const modifyButtonProfil = document.getElementById('modifierbouton');
if (token) {
  modifyButtonProfil.style.display = 'flex';
} else {
  modifyButtonProfil.style.display = 'none';
}
const titregallerie2 = document.getElementById("titregallerie2")
const titregallerie = document.getElementById("titregallerie")
const gallery = document.getElementById("gallery")
const btnAddModal = document.getElementById("btnAddModal")
const btnAddModal2 = document.getElementById("btnAddModal2")
const modalcontent2 = document.getElementById("modal-content2")
const modalcontent1 = document.getElementById("modal-content1")
btnAddModal.addEventListener('click', function () {
  modalcontent2.style.display = "flex"
  modalcontent1.style.display = "none"


}
)


// DELETE WORKS IN MODALE
function deleteProject(garbageIcon, projectId) {

  garbageIcon.addEventListener('click', async function () {

    try {
      // Appeler l'API de suppression avec le token d'authentification
      const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Une erreur s\'est produite lors de la suppression du projet');
      }


      // Supprime le parent de l'image de la galerie


      const modalImageContainer = garbageIcon.parentElement;
      modalImageContainer.remove();

      const ImageContainer = document.getElementById(projectId);
      if (ImageContainer) {
        ImageContainer.remove();
      }

    } catch (error) {
      console.error('Une erreur s\'est produite lors de la suppression du projet:', error);
    }

  });
}

// PREVIEW IMAGE BEFORE UPLOAD

const imageUploader = document.getElementById("avatar");
const imagePreview = document.getElementById("previewimage");
const pictureicon = document.getElementById("pictureicon")
const labelfile = document.getElementById("labelimagepreview")
const acceptedformat = document.getElementById("acceptedformat")
function showImage() {
  let reader = new FileReader();
  reader.readAsDataURL(imageUploader.files[0]);
  reader.onload = function (e) {
    pictureicon.style.display = "none"
    pictureicon.style.display = "none"
    labelfile.style.display = "none"
    acceptedformat.style.display = "none"
    imagePreview.style.display = "block"
    imagePreview.src = e.target.result;
  };
}

// VALIDER BUTTON ADD PROJECT //

const ValiderButton = document.getElementById("ValiderBtn");
ValiderButton.disabled = true;// Button is disabled at the beginning

const titreWork = document.getElementById('titre')

const categorieSelect = document.getElementById('categorie');



titreWork.addEventListener('input', checkAndEnable);

categorieSelect.addEventListener('input', checkAndEnable);

imageUploader.addEventListener('input', checkAndEnable);



function checkAndEnable() {
  let error = false
  if (titreWork.value < 1) {
    error = true

  }
  if (imageUploader.files.length < 1) {
    error = true
  }
  if (categorieSelect.value == "undefined") {
    error = true
  }
  if (error) {
    ValiderButton.disabled = true

  } else {
    ValiderButton.disabled = false
    ValiderButton.classList.add('buttonenabled')
  }

}

// SEND NEW WORKS TO API //

// creer une action : addeventlistener

// POST NEW WORK ON API //



// le (e) ==> a l'objet evenement, dans le cas ou il doit etre utilisé (idem qu'un nb par ex) 
ValiderButton.addEventListener('click', function (e) {
  e.preventDefault()
  // objet permettant d'envoyer des donnees a l'API
  let data = new FormData()
  data.append("title", titreWork.value)
  data.append("category", categorieSelect.value)
  data.append("image", imageUploader.files[0])
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  })

    // ATTENTE DE LA REPONSE API ET LES DEUX OUTCOMES POSSIBLES
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json();
    })

    // .THEN--> CE QUI EST EFFECTUE APRES AVOIR RECU LES DONNEES DE l'API
    // DATA = donnees recues
    .then(data => {
      // Utiliser les données récupérées
      console.log(data); // Afficher les données dans la console par exemple
      modal.style.display = "none";

      let figure = document.createElement("figure")
      figure.id = data.id
      let img = document.createElement("img")
      img.src = data.imageUrl
      img.alt = data.title
      figure.appendChild(img)

      let title = document.createElement("figcaption")
      title.innerText = data.title
      figure.appendChild(title)
      document.querySelector(".gallery").appendChild(figure)


      // MODAL DISPLAY WORKS
      AddWorkModal(data)


      // AJOUT DANS GALLERIE MEME SANS RAFRAICHIR //
      // AJOUT SUR LE DOM: APPEND.CHILD
      // COPIER ET ADAPTER CODE QUI A PERMIS DE DISPLAY LES WORKS

    })
}
)

function AddWorkModal(data){
  const figure = document.createElement("figure")
 const img = document.createElement("img")

  img.src = data.imageUrl
  img.alt = data.title
  figure.appendChild(img)

  document.getElementById("gallery").appendChild(figure)
  let trash = document.createElement("i")
  trash.classList.add("fa-solid");
  trash.classList.add("fa-trash-can");
  trash.classList.add("trashicon")
  figure.appendChild(trash)
  deleteProject(trash, data.id)
}


// Get the arrow element that closes the modal
let arrow = document.getElementById("arrowleft");

// When the user clicks on arrowleft, switch to modal content 1 //
arrow.addEventListener('click', function () {
  modalcontent2.style.display = "none"
  modalcontent1.style.display = "block"
})

