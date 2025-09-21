const accessToken = localStorage?.getItem("idToken"); // your Google access token
const serverUrl = "http://localhost:5000";

let timeoutId;

const initialize = () => {
  if (!accessToken) {
    const authDiv = document.getElementById("auth-div");
    authDiv.style.display = "block";

    const avatar = document.getElementById("avatar");
    avatar.style.display = "none";
  }
};

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((res) => res.json())
  .then((user) => {
    console.log("User Info:", user);

    if (user.error == "invalid_request") {
      localStorage.idToken = "";
      initialize();
    }

    const avatar = document.getElementById("avatar");
    const profile = document.createElement("img");
    profile.src = user.picture;
    avatar.appendChild(profile);
  });

const handleSearch = (event) => {
  event.preventDefault();

  const idToken = localStorage.getItem("idToken");

  const search = document.getElementById("search").value;

  window.location.href = idToken
    ? `${baseUrl}/prompt.html?${search}`
    : `${baseUrl}/signup.html`;
};

// search input
const input = document.getElementById("search");

input.addEventListener("change", (e) => {
  console.log("Final selection:", e.target.value);
});

const handleKeyUp = (event) => {
  event.preventDefault();

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => console.log("waiting..."), 30000);

  axios
    .get(`${serverUrl}/spatial/search/${event.target.value}`)
    .then((res) => {
      const data = res.data.data;

      document.getElementById("destinations").innerHTML = "";

      console.log(data);
      data.length===0
        ? (document.getElementById(
            "destinations"
          ).innerHTML += `<option value="Not Found"></option>`)
        : "";

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        console.log({ element });
        document.getElementById(
          "destinations"
        ).innerHTML += `<option value="${element.name_of_oc} (${element.gid})"></option>`;
      }
    })
    .catch((err) => {
      if (err.code == 400) {
        console.message(err.message);
      }
    });
};
