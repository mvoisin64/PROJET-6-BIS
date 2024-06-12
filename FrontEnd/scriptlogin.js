let buttonConnexion = document.getElementById("buttonConnexion")

buttonConnexion.addEventListener("click", function (e) {
  e.preventDefault()

  let baliseEmail = document.getElementById("email")
  let email = baliseEmail.value

  let balisemotDePasse = document.getElementById("motDePasse")
  let motDePasse = balisemotDePasse.value




  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": email, "password": motDePasse })
  })
    .then(response => {
      if (!response.ok) {
        // ci-dessous message d'erreur quand mauvais mot de passe/email
        document.getElementById("error").innerText = "E-mail ou mot de passe incorrect"



        throw new Error('Une erreur s\'est produite lors de la suppression du projet');

      }
      return response.json();
    })

    .then(data => {
      console.log(data)
      localStorage.setItem("token", data.token)
      window.location.href = "index.html"
    })

})







